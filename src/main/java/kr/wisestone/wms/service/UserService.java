package kr.wisestone.wms.service;

import com.google.common.collect.Lists;
import com.mysema.query.BooleanBuilder;
import com.mysema.query.jpa.JPASubQuery;
import com.mysema.query.jpa.JPQLSubQuery;
import kr.wisestone.wms.domain.*;
import kr.wisestone.wms.repository.*;
import kr.wisestone.wms.repository.search.UserSearchRepository;
import kr.wisestone.wms.security.SecurityUtils;
import kr.wisestone.wms.service.util.RandomUtil;
import kr.wisestone.wms.web.rest.dto.ManagedUserDTO;
import kr.wisestone.wms.web.rest.dto.UserDTO;
import kr.wisestone.wms.web.rest.mapper.AttachedFileMapper;
import kr.wisestone.wms.web.rest.mapper.UserMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;


import java.time.LocalDate;
import java.time.ZonedDateTime;
import javax.inject.Inject;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service class for managing users.
 */
@Service
@Transactional
public class UserService {

    private final Logger log = LoggerFactory.getLogger(UserService.class);

    @Inject
    private UserMapper userMapper;

    @Inject
    private SocialService socialService;

    @Inject
    private PasswordEncoder passwordEncoder;

    @Inject
    private UserRepository userRepository;

    @Inject
    private UserSearchRepository userSearchRepository;

    @Inject
    private CompanyRepository companyRepository;

    @Inject
    private DepartmentService departmentService;

    @Inject
    private PersistentTokenRepository persistentTokenRepository;

    @Inject
    private AuthorityRepository authorityRepository;

    @Inject
    private AttachedFileService attachedFileService;

    @Inject
    private AttachedFileMapper attachedFileMapper;

    @Inject
    private TaskRepository taskRepository;

    @Inject
    private ProjectRepository projectRepository;

    public Optional<User> activateRegistration(String key) {
        log.debug("Activating user for activation key {}", key);
        return userRepository.findOneByActivationKey(key)
            .map(user -> {
                // activate given user for the registration key.
                user.setActivated(true);
                user.setActivationKey(null);
                userRepository.save(user);
                userSearchRepository.save(user);
                log.debug("Activated user: {}", user);
                return user;
            });
    }

    public Optional<User> completePasswordReset(String newPassword, String key) {
       log.debug("Reset user password for reset key {}", key);

       return userRepository.findOneByResetKey(key)
            .filter(user -> {
                ZonedDateTime oneDayAgo = ZonedDateTime.now().minusHours(24);
                return user.getResetDate().isAfter(oneDayAgo);
           })
           .map(user -> {
                user.setPassword(passwordEncoder.encode(newPassword));
                user.setResetKey(null);
                user.setResetDate(null);
                user.setStatus(User.USER_STATUS_ACTIVE);
                userRepository.save(user);
                return user;
           });
    }

    public Optional<User> requestPasswordReset(String mail) {
        return userRepository.findOneByEmail(mail)
            .filter(User::getActivated)
            .map(user -> {
                user.setResetKey(RandomUtil.generateResetKey());
                user.setResetDate(ZonedDateTime.now());
                userRepository.save(user);
                return user;
            });
    }

    public User createUserInformation(String login, String password, String name, String email,
        String langKey, Long companyId, Long departmentId) {

        User newUser = new User();

        String encryptedPassword = passwordEncoder.encode(password);
        newUser.setLogin(login);
        // new user gets initially a generated password
        newUser.setPassword(encryptedPassword);
        newUser.setName(name);
        newUser.setEmail(email);
        newUser.setLangKey(langKey);
        // new user is not active
        newUser.setActivated(Boolean.TRUE);
        // new user gets registration key
//        newUser.setActivationKey(RandomUtil.generateActivationKey());
        Authority authority = authorityRepository.findOne("ROLE_USER");
        Set<Authority> authorities = new HashSet<>();
        authorities.add(authority);
        newUser.setAuthorities(authorities);
        newUser.setStatus(User.USER_STATUS_JOIN);

        if(companyId != null)
            newUser.setCompany(this.companyRepository.findOne(companyId));

        if(departmentId != null)
            newUser.setDepartment(this.departmentService.findOne(departmentId));

        userRepository.save(newUser);
        userSearchRepository.save(newUser);
        log.debug("Created Information for User: {}", newUser);
        return newUser;
    }

    public User createUser(ManagedUserDTO managedUserDTO) {
        User user = new User();
        user.setLogin(managedUserDTO.getLogin());
        user.setName(managedUserDTO.getName());
        user.setEmail(managedUserDTO.getEmail());
        if (managedUserDTO.getLangKey() == null) {
            user.setLangKey("ko"); // default language
        } else {
            user.setLangKey(managedUserDTO.getLangKey());
        }
        if (managedUserDTO.getAuthorities() != null) {
            Set<Authority> authorities = new HashSet<>();
            managedUserDTO.getAuthorities().stream().forEach(
                authority -> authorities.add(authorityRepository.findOne(authority))
            );
            user.setAuthorities(authorities);
        }

        user.setActivated(true);

        if((StringUtils.hasText(managedUserDTO.getStatus()) && managedUserDTO.getStatus().equals(User.USER_STATUS_ACTIVE))) {

            user.setPassword(passwordEncoder.encode(user.getLogin()));
            user.setStatus(User.USER_STATUS_ACTIVE);
        } else {

            user.setPassword(passwordEncoder.encode(RandomUtil.generatePassword()));
            user.setResetKey(RandomUtil.generateResetKey());
            user.setResetDate(ZonedDateTime.now());
            user.setStatus(User.USER_STATUS_ADD);
        }

        if(managedUserDTO.getCompanyId() != null)
            user.setCompany(this.companyRepository.findOne(managedUserDTO.getCompanyId()));

        if(managedUserDTO.getDepartmentId() != null)
            user.setDepartment(this.departmentService.findOne(managedUserDTO.getDepartmentId()));

        userRepository.save(user);
        userSearchRepository.save(user);
        log.debug("Created Information for User: {}", user);
        return user;
    }

    public void updateUserInformation(String name, String email, String langKey) {
        userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).ifPresent(u -> {
            u.setName(name);
            u.setEmail(email);
            u.setLangKey(langKey);
            userRepository.save(u);
            userSearchRepository.save(u);
            log.debug("Changed Information for User: {}", u);
        });
    }

    public void deleteUserInformation(String login) {
        userRepository.findOneByLogin(login).ifPresent(u -> {
            socialService.deleteUserSocialConnection(u.getLogin());
            userRepository.delete(u);
            userSearchRepository.delete(u);
            log.debug("Deleted User: {}", u);
        });
    }

    public void changePassword(String password) {
        userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).ifPresent(u -> {
            String encryptedPassword = passwordEncoder.encode(password);
            u.setPassword(encryptedPassword);
            userRepository.save(u);
            log.debug("Changed password for User: {}", u);
        });
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthoritiesByLogin(String login) {
        return userRepository.findOneByLogin(login).map(u -> {
            u.getAuthorities().size();
            return u;
        });
    }

    @Transactional(readOnly = true)
    public User getUserWithAuthorities(Long id) {
        User user = userRepository.findOne(id);

        if(user == null)
            return null;

        user.getAuthorities().size(); // eagerly load the association
        return user;
    }

    @Transactional(readOnly = true)
    public UserDTO getUserWithAuthorities() {
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();
        user.getAuthorities().size(); // eagerly load the association

        UserDTO userDTO = userMapper.userToUserDTO(user);

        if(user.getProfileImage() != null)
            userDTO.setProfileImage(attachedFileMapper.attachedFileToAttachedFileDTO(user.getProfileImage()));

        return userDTO;
    }

    /**
     * Persistent Token are used for providing automatic authentication, they should be automatically deleted after
     * 30 days.
     * <p>
     * This is scheduled to get fired everyday, at midnight.
     * </p>
     */
    @Scheduled(cron = "0 0 0 * * ?")
    public void removeOldPersistentTokens() {
        LocalDate now = LocalDate.now();
        persistentTokenRepository.findByTokenDateBefore(now.minusMonths(1)).stream().forEach(token -> {
            log.debug("Deleting token {}", token.getSeries());
            User user = token.getUser();
            user.getPersistentTokens().remove(token);
            persistentTokenRepository.delete(token);
        });
    }

    /**
     * Not activated users should be automatically deleted after 3 days.
     * <p>
     * This is scheduled to get fired everyday, at 01:00 (am).
     * </p>
     */
    @Scheduled(cron = "0 0 1 * * ?")
    public void removeNotActivatedUsers() {
        ZonedDateTime now = ZonedDateTime.now();
        List<User> users = userRepository.findAllByActivatedIsFalseAndCreatedDateBefore(now.minusDays(3));
        for (User user : users) {
            log.debug("Deleting not activated user {}", user.getLogin());
            userRepository.delete(user);
            userSearchRepository.delete(user);
        }
    }

    public User updateUser(ManagedUserDTO managedUserDTO, MultipartFile file) {

        User user = userRepository.findOne(managedUserDTO.getId());

//        user.setLogin(managedUserDTO.getLogin());
        user.setName(managedUserDTO.getName());
        user.setPhone(managedUserDTO.getPhone());
        user.setEmail(managedUserDTO.getEmail());
//        user.setActivated(managedUserDTO.isActivated());
//        user.setLangKey(managedUserDTO.getLangKey());

//        if(managedUserDTO.getCompanyId() != null)
//            user.setCompany(this.companyRepository.findOne(managedUserDTO.getCompanyId()));
//
//        if(managedUserDTO.getDepartmentId() != null)
//            user.setDepartment(this.departmentService.findOne(managedUserDTO.getDepartmentId()));

//        Set<Authority> authorities = user.getAuthorities();
//        authorities.clear();
//        managedUserDTO.getAuthorities().stream().forEach(
//            authority -> authorities.add(authorityRepository.findOne(authority))
//        );
//        user.setAuthorities(authorities);


        if(file != null) {
            AttachedFile attachedFile = this.attachedFileService.saveFile(file);
            user.setProfileImage(attachedFile);
        }

//        if(StringUtils.hasText(managedUserDTO.getStatus()))
//            user.setStatus(managedUserDTO.getStatus());

        userRepository.save(user);
        userSearchRepository.save(user);

        return user;
    }

    public User initPassword(ManagedUserDTO managedUserDTO) {

        User user = userRepository.findOne(managedUserDTO.getId());

        user.setPassword(passwordEncoder.encode(user.getLogin()));
        user.setStatus(User.USER_STATUS_ACTIVE);
        user.setResetDate(null);
        user.setResetKey(null);

        userRepository.save(user);
        userSearchRepository.save(user);

        return user;
    }

    public List<UserDTO> findByNameLike(String name) {

        BooleanBuilder predicate = new BooleanBuilder();

        predicate.and(QUser.user.name.containsIgnoreCase(name));

        List<User> users = Lists.newArrayList(this.userRepository.findAll(predicate));

        return userMapper.usersToUserDTOs(users);
    }

    public List<UserDTO> findByNameLikeAndExcludeIds(String name, List<Long> excludeIds) {

        BooleanBuilder predicate = new BooleanBuilder();

        predicate.and(QUser.user.name.containsIgnoreCase(name));

        if(excludeIds != null && !excludeIds.isEmpty())
            predicate.and(QUser.user.id.notIn(excludeIds));

        List<User> users = Lists.newArrayList(this.userRepository.findAll(predicate));

        return userMapper.usersToUserDTOs(users);
    }

    public List<UserDTO> findProjectMember(String name, Long projectId, List<Long> excludeIds) {

        BooleanBuilder predicate = new BooleanBuilder();

        if(StringUtils.hasText(name))
            predicate.and(QUser.user.name.containsIgnoreCase(name));

        if(excludeIds != null && !excludeIds.isEmpty())
            predicate.and(QUser.user.id.notIn(excludeIds));

        predicate.and(QUser.user.id.notIn(new JPASubQuery()
            .from(QProjectUser.projectUser)
            .where(QProjectUser.projectUser.project.id.eq(projectId).and(QProjectUser.projectUser.userType.eq(UserType.MEMBER)))
            .list(QProjectUser.projectUser.user.id)));

        List<User> users = Lists.newArrayList(this.userRepository.findAll(predicate));

        return userMapper.usersToUserDTOs(users);
    }

    public User findOne(Long sender) {

        if(sender == null)
            return null;

        return this.userRepository.findOne(sender);
    }

    public User findByLogin(String login) {

        if(login == null)
            return null;

        Optional<User> user = this.userRepository.findOneByLogin(login);

        return user.orElseGet(null);
    }
}
