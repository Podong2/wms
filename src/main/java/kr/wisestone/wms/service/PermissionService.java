package kr.wisestone.wms.service;

import com.google.common.base.Function;
import com.google.common.collect.Iterables;
import com.google.common.collect.Lists;
import com.mysema.query.BooleanBuilder;
import com.mysema.query.jpa.JPASubQuery;
import com.mysema.query.jpa.JPQLQuery;
import com.mysema.query.jpa.JPQLSubQuery;
import kr.wisestone.wms.domain.*;
import kr.wisestone.wms.repository.MenuPermissionRepository;
import kr.wisestone.wms.repository.MenuRepository;
import kr.wisestone.wms.repository.PermissionRepository;
import kr.wisestone.wms.repository.SystemRolePermissionRepository;
import kr.wisestone.wms.repository.search.PermissionSearchRepository;
import kr.wisestone.wms.security.SecurityUtils;
import kr.wisestone.wms.web.rest.dto.PermissionDTO;
import kr.wisestone.wms.web.rest.mapper.PermissionMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Nullable;
import javax.inject.Inject;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * Service Implementation for managing Permission.
 */
@Service
@Transactional
public class PermissionService {

    private final Logger log = LoggerFactory.getLogger(PermissionService.class);

    @Inject
    private PermissionRepository permissionRepository;

    @Inject
    private MenuPermissionRepository menuPermissionRepository;

    @Inject
    private PermissionMapper permissionMapper;

    @Inject
    private PermissionSearchRepository permissionSearchRepository;

    @Inject
    private SystemRolePermissionRepository systemRolePermissionRepository;

    @Inject
    private UserService userService;

    /**
     * Save a permission.
     *
     * @param permissionDTO the entity to save
     * @return the persisted entity
     */
    public PermissionDTO save(PermissionDTO permissionDTO) {
        log.debug("Request to save Permission : {}", permissionDTO);
        Permission permission = permissionMapper.permissionDTOToPermission(permissionDTO);
        permission = permissionRepository.save(permission);
        PermissionDTO result = permissionMapper.permissionToPermissionDTO(permission);
        permissionSearchRepository.save(permission);
        return result;
    }

    public PermissionDTO update(PermissionDTO permissionDTO) {
        log.debug("Request to save Permission : {}", permissionDTO);

        Permission origin = permissionRepository.findOne(permissionDTO.getId());
        origin.update(permissionDTO);

        if(permissionDTO.getParentId() != null) {
            origin.setParent(permissionRepository.findOne(permissionDTO.getParentId()));
        } else {
            origin.setParent(null);
        }

        if(permissionDTO.getPermissionCategoryId() != null) {
            origin.setPermissionCategory(permissionMapper.permissionCategoryFromId(permissionDTO.getPermissionCategoryId()));
        }

        origin = permissionRepository.save(origin);
        PermissionDTO result = permissionMapper.permissionToPermissionDTO(origin);
        permissionSearchRepository.save(origin);

        return result;
    }

    /**
     *  Get all the permissions.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<Permission> findAll(Pageable pageable) {
        log.debug("Request to get all Permissions");
        Page<Permission> result = permissionRepository.findAll(pageable);
        return result;
    }

    /**
     *  Get one permission by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Transactional(readOnly = true)
    public PermissionDTO findOne(Long id) {
        log.debug("Request to get Permission : {}", id);
        Permission permission = permissionRepository.findOne(id);
        PermissionDTO permissionDTO = permissionMapper.permissionToPermissionDTO(permission);
        return permissionDTO;
    }

    /**
     *  Delete the  permission by id.
     *
     *  @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Permission : {}", id);


        Permission origin = permissionRepository.findOne(id);

        if(origin.getChildPermissions() != null && !origin.getChildPermissions().isEmpty()) {

            for(Permission childPermission : origin.getChildPermissions()) {
                childPermission.setParent(null);

                permissionRepository.save(childPermission);
                permissionSearchRepository.save(childPermission);
            }
        }

        permissionRepository.delete(id);
        permissionSearchRepository.delete(id);
    }

    /**
     * Search for the permission corresponding to the query.
     *
     *  @param query the query of the search
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<Permission> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Permissions for query {}", query);
        return permissionSearchRepository.search(queryStringQuery(query), pageable);
    }

    public List<PermissionDTO> findByUserId(String login) {

        QPermission $permission = QPermission.permission;

        BooleanBuilder predicate = new BooleanBuilder();

        predicate.and($permission.id.in(new JPASubQuery()
            .from(QSystemRolePermission.systemRolePermission)
            .where(QSystemRolePermission.systemRolePermission.systemRole.systemRoleUsers.any().user.login.eq(login))
            .list(QSystemRolePermission.systemRolePermission.permission.id)));

        List<Permission> permissions = Lists.newArrayList(permissionRepository.findAll(predicate));

        return permissionMapper.permissionsToPermissionDTOs(permissions);
    }

    public List<PermissionDTO> findMenuPermissionByUserAndMenuUrl(String menuUrl) {

        String login = SecurityUtils.getCurrentUserLogin();

        QPermission $permission = QPermission.permission;

        BooleanBuilder predicate = new BooleanBuilder();

        predicate.and($permission.id.in(new JPASubQuery()
            .from(QSystemRolePermission.systemRolePermission)
            .where(QSystemRolePermission.systemRolePermission.systemRole.systemRoleUsers.any().user.login.eq(login))
            .list(QSystemRolePermission.systemRolePermission.permission.id)));
        predicate.and($permission.menuPermissions.any().menu.urlPath.eq(menuUrl));

        List<PermissionDTO> permissions = permissionMapper.permissionsToPermissionDTOs(Lists.newArrayList(permissionRepository.findAll(predicate)));

        permissions.stream().forEach(permission -> permission.setActiveYn(Boolean.TRUE));

        return permissions;
    }

    public List<PermissionDTO> getAllPermissionOfUser() {

        String login = SecurityUtils.getCurrentUserLogin();

        Optional<User> userOptional = userService.getUserWithAuthoritiesByLogin(login);
        User user = userOptional.get();

        List<PermissionDTO> allPermission = permissionMapper.permissionsToPermissionDTOs(permissionRepository.findAll());
        List<PermissionDTO> userPermissions = Lists.newArrayList();

        if(user != null)
            userPermissions.addAll(this.findByUserId(user.getLogin()));

        for(PermissionDTO permission : allPermission) {

            final Long permissionId = permission.getId();

            PermissionDTO userPermission = userPermissions.stream()
                .filter(
                    input -> input.getId().equals(permissionId))
                .findFirst().orElseGet(() -> null);

            if(userPermission != null) {
                permission.setActiveYn(Boolean.TRUE);
            } else {
                permission.setActiveYn(Boolean.FALSE);
            }

        }

        return allPermission;
    }
}
