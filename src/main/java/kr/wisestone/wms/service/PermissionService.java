package kr.wisestone.wms.service;

import kr.wisestone.wms.domain.Permission;
import kr.wisestone.wms.repository.PermissionRepository;
import kr.wisestone.wms.repository.search.PermissionSearchRepository;
import kr.wisestone.wms.web.rest.dto.PermissionDTO;
import kr.wisestone.wms.web.rest.mapper.PermissionMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

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
    private PermissionMapper permissionMapper;
    
    @Inject
    private PermissionSearchRepository permissionSearchRepository;
    
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
}
