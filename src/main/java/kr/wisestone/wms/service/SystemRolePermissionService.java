package kr.wisestone.wms.service;

import kr.wisestone.wms.domain.SystemRolePermission;
import kr.wisestone.wms.repository.SystemRolePermissionRepository;
import kr.wisestone.wms.repository.search.SystemRolePermissionSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing SystemRolePermission.
 */
@Service
@Transactional
public class SystemRolePermissionService {

    private final Logger log = LoggerFactory.getLogger(SystemRolePermissionService.class);
    
    @Inject
    private SystemRolePermissionRepository systemRolePermissionRepository;
    
    @Inject
    private SystemRolePermissionSearchRepository systemRolePermissionSearchRepository;
    
    /**
     * Save a systemRolePermission.
     * 
     * @param systemRolePermission the entity to save
     * @return the persisted entity
     */
    public SystemRolePermission save(SystemRolePermission systemRolePermission) {
        log.debug("Request to save SystemRolePermission : {}", systemRolePermission);
        SystemRolePermission result = systemRolePermissionRepository.save(systemRolePermission);
        systemRolePermissionSearchRepository.save(result);
        return result;
    }

    /**
     *  Get all the systemRolePermissions.
     *  
     *  @return the list of entities
     */
    @Transactional(readOnly = true) 
    public List<SystemRolePermission> findAll() {
        log.debug("Request to get all SystemRolePermissions");
        List<SystemRolePermission> result = systemRolePermissionRepository.findAll();
        return result;
    }

    /**
     *  Get one systemRolePermission by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Transactional(readOnly = true) 
    public SystemRolePermission findOne(Long id) {
        log.debug("Request to get SystemRolePermission : {}", id);
        SystemRolePermission systemRolePermission = systemRolePermissionRepository.findOne(id);
        return systemRolePermission;
    }

    /**
     *  Delete the  systemRolePermission by id.
     *  
     *  @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete SystemRolePermission : {}", id);
        systemRolePermissionRepository.delete(id);
        systemRolePermissionSearchRepository.delete(id);
    }

    /**
     * Search for the systemRolePermission corresponding to the query.
     *
     *  @param query the query of the search
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<SystemRolePermission> search(String query) {
        log.debug("Request to search SystemRolePermissions for query {}", query);
        return StreamSupport
            .stream(systemRolePermissionSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
