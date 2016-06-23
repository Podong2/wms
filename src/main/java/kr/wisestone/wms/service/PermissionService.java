package kr.wisestone.wms.service;

import com.google.common.base.Function;
import com.google.common.collect.Iterables;
import com.google.common.collect.Lists;
import com.mysema.query.BooleanBuilder;
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

    public List<Permission> findByUserId(String login) {

        QSystemRolePermission $systemRolePermission = QSystemRolePermission.systemRolePermission;
        QSystemRole $systemRole = QSystemRole.systemRole;
        QSystemRoleUser $systemRoleUser = QSystemRoleUser.systemRoleUser;

        JPQLQuery query = systemRolePermissionRepository.createQuery();
        query.innerJoin($systemRolePermission.systemRole, $systemRole);
        query.innerJoin($systemRole.systemRoleUsers, $systemRoleUser);

        BooleanBuilder predicate = new BooleanBuilder();
        predicate.and($systemRolePermission.systemRole.systemRoleUsers.any().user.login.eq(login));

        List<SystemRolePermission> systemRolePermissions = systemRolePermissionRepository.findAll(query.where(predicate));

        List<Permission> permissions = systemRolePermissions.stream()
            .map(
                SystemRolePermission::getPermission)
            .collect(Collectors.toList());

        return permissions;
    }

    public List<PermissionDTO> findMenuPermissionByUserAndMenuUrl(String menuUrl) {

        String login = SecurityUtils.getCurrentUserLogin();

        List<Long> permissionIds = this.findByUserId(login).stream().map(permission -> permission.getId()).collect(Collectors.toList());

        QMenuPermission $menuPermission = QMenuPermission.menuPermission;
        QMenu $menu = QMenu.menu;
        QPermission $permission = QPermission.permission;

        JPQLQuery query = menuPermissionRepository.createQuery();
        query.innerJoin($menuPermission.menu, $menu);
        query.innerJoin($menuPermission.permission, $permission);

        BooleanBuilder predicate = new BooleanBuilder();

        predicate.and($permission.id.in(permissionIds));
        predicate.and($menu.urlPath.eq(menuUrl));

        List<MenuPermission> menuPermissions = menuPermissionRepository.findAll(query.where(predicate));

        List<Permission> permissions = menuPermissions.stream()
            .map(
                MenuPermission::getPermission)
            .collect(Collectors.toList());

        return permissionMapper.permissionsToPermissionDTOs(permissions);
    }

    public List<PermissionDTO> getAllPermissionOfUser() {

        String login = SecurityUtils.getCurrentUserLogin();

        Optional<User> userOptional = userService.getUserWithAuthoritiesByLogin(login);
        User user = userOptional.get();

        List<PermissionDTO> allPermission = permissionMapper.permissionsToPermissionDTOs(permissionRepository.findAll());
        List<PermissionDTO> userPermissions = Lists.newArrayList();

        if(user != null)
            userPermissions.addAll(permissionMapper.permissionsToPermissionDTOs(this.findByUserId(user.getLogin())));

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
