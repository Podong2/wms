package kr.wisestone.wms.service;

import kr.wisestone.wms.domain.SystemRoleUser;
import kr.wisestone.wms.repository.SystemRoleUserRepository;
import kr.wisestone.wms.repository.search.SystemRoleUserSearchRepository;
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
 * Service Implementation for managing SystemRoleUser.
 */
@Service
@Transactional
public class SystemRoleUserService {

    private final Logger log = LoggerFactory.getLogger(SystemRoleUserService.class);
    
    @Inject
    private SystemRoleUserRepository systemRoleUserRepository;
    
    @Inject
    private SystemRoleUserSearchRepository systemRoleUserSearchRepository;
    
    /**
     * Save a systemRoleUser.
     * 
     * @param systemRoleUser the entity to save
     * @return the persisted entity
     */
    public SystemRoleUser save(SystemRoleUser systemRoleUser) {
        log.debug("Request to save SystemRoleUser : {}", systemRoleUser);
        SystemRoleUser result = systemRoleUserRepository.save(systemRoleUser);
        systemRoleUserSearchRepository.save(result);
        return result;
    }

    /**
     *  Get all the systemRoleUsers.
     *  
     *  @return the list of entities
     */
    @Transactional(readOnly = true) 
    public List<SystemRoleUser> findAll() {
        log.debug("Request to get all SystemRoleUsers");
        List<SystemRoleUser> result = systemRoleUserRepository.findAll();
        return result;
    }

    /**
     *  Get one systemRoleUser by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Transactional(readOnly = true) 
    public SystemRoleUser findOne(Long id) {
        log.debug("Request to get SystemRoleUser : {}", id);
        SystemRoleUser systemRoleUser = systemRoleUserRepository.findOne(id);
        return systemRoleUser;
    }

    /**
     *  Delete the  systemRoleUser by id.
     *  
     *  @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete SystemRoleUser : {}", id);
        systemRoleUserRepository.delete(id);
        systemRoleUserSearchRepository.delete(id);
    }

    /**
     * Search for the systemRoleUser corresponding to the query.
     *
     *  @param query the query of the search
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<SystemRoleUser> search(String query) {
        log.debug("Request to search SystemRoleUsers for query {}", query);
        return StreamSupport
            .stream(systemRoleUserSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
