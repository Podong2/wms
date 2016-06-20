package kr.wisestone.wms.service;

import kr.wisestone.wms.domain.MenuPermission;
import kr.wisestone.wms.repository.MenuPermissionRepository;
import kr.wisestone.wms.repository.search.MenuPermissionSearchRepository;
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
 * Service Implementation for managing MenuPermission.
 */
@Service
@Transactional
public class MenuPermissionService {

    private final Logger log = LoggerFactory.getLogger(MenuPermissionService.class);
    
    @Inject
    private MenuPermissionRepository menuPermissionRepository;
    
    @Inject
    private MenuPermissionSearchRepository menuPermissionSearchRepository;
    
    /**
     * Save a menuPermission.
     * 
     * @param menuPermission the entity to save
     * @return the persisted entity
     */
    public MenuPermission save(MenuPermission menuPermission) {
        log.debug("Request to save MenuPermission : {}", menuPermission);
        MenuPermission result = menuPermissionRepository.save(menuPermission);
        menuPermissionSearchRepository.save(result);
        return result;
    }

    /**
     *  Get all the menuPermissions.
     *  
     *  @return the list of entities
     */
    @Transactional(readOnly = true) 
    public List<MenuPermission> findAll() {
        log.debug("Request to get all MenuPermissions");
        List<MenuPermission> result = menuPermissionRepository.findAll();
        return result;
    }

    /**
     *  Get one menuPermission by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Transactional(readOnly = true) 
    public MenuPermission findOne(Long id) {
        log.debug("Request to get MenuPermission : {}", id);
        MenuPermission menuPermission = menuPermissionRepository.findOne(id);
        return menuPermission;
    }

    /**
     *  Delete the  menuPermission by id.
     *  
     *  @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete MenuPermission : {}", id);
        menuPermissionRepository.delete(id);
        menuPermissionSearchRepository.delete(id);
    }

    /**
     * Search for the menuPermission corresponding to the query.
     *
     *  @param query the query of the search
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<MenuPermission> search(String query) {
        log.debug("Request to search MenuPermissions for query {}", query);
        return StreamSupport
            .stream(menuPermissionSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
