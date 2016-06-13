package kr.wisestone.wms.web.rest;

import com.codahale.metrics.annotation.Timed;
import kr.wisestone.wms.domain.SystemRole;
import kr.wisestone.wms.repository.SystemRoleRepository;
import kr.wisestone.wms.repository.search.SystemRoleSearchRepository;
import kr.wisestone.wms.web.rest.util.HeaderUtil;
import kr.wisestone.wms.web.rest.util.PaginationUtil;
import kr.wisestone.wms.web.rest.dto.SystemRoleDTO;
import kr.wisestone.wms.web.rest.mapper.SystemRoleMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing SystemRole.
 */
@RestController
@RequestMapping("/api")
public class SystemRoleResource {

    private final Logger log = LoggerFactory.getLogger(SystemRoleResource.class);
        
    @Inject
    private SystemRoleRepository systemRoleRepository;
    
    @Inject
    private SystemRoleMapper systemRoleMapper;
    
    @Inject
    private SystemRoleSearchRepository systemRoleSearchRepository;
    
    /**
     * POST  /system-roles : Create a new systemRole.
     *
     * @param systemRoleDTO the systemRoleDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new systemRoleDTO, or with status 400 (Bad Request) if the systemRole has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/system-roles",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<SystemRoleDTO> createSystemRole(@RequestBody SystemRoleDTO systemRoleDTO) throws URISyntaxException {
        log.debug("REST request to save SystemRole : {}", systemRoleDTO);
        if (systemRoleDTO.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("systemRole", "idexists", "A new systemRole cannot already have an ID")).body(null);
        }
        SystemRole systemRole = systemRoleMapper.systemRoleDTOToSystemRole(systemRoleDTO);
        systemRole = systemRoleRepository.save(systemRole);
        SystemRoleDTO result = systemRoleMapper.systemRoleToSystemRoleDTO(systemRole);
        systemRoleSearchRepository.save(systemRole);
        return ResponseEntity.created(new URI("/api/system-roles/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("systemRole", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /system-roles : Updates an existing systemRole.
     *
     * @param systemRoleDTO the systemRoleDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated systemRoleDTO,
     * or with status 400 (Bad Request) if the systemRoleDTO is not valid,
     * or with status 500 (Internal Server Error) if the systemRoleDTO couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/system-roles",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<SystemRoleDTO> updateSystemRole(@RequestBody SystemRoleDTO systemRoleDTO) throws URISyntaxException {
        log.debug("REST request to update SystemRole : {}", systemRoleDTO);
        if (systemRoleDTO.getId() == null) {
            return createSystemRole(systemRoleDTO);
        }
        SystemRole systemRole = systemRoleMapper.systemRoleDTOToSystemRole(systemRoleDTO);
        systemRole = systemRoleRepository.save(systemRole);
        SystemRoleDTO result = systemRoleMapper.systemRoleToSystemRoleDTO(systemRole);
        systemRoleSearchRepository.save(systemRole);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("systemRole", systemRoleDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /system-roles : get all the systemRoles.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of systemRoles in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/system-roles",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<List<SystemRoleDTO>> getAllSystemRoles(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of SystemRoles");
        Page<SystemRole> page = systemRoleRepository.findAll(pageable); 
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/system-roles");
        return new ResponseEntity<>(systemRoleMapper.systemRolesToSystemRoleDTOs(page.getContent()), headers, HttpStatus.OK);
    }

    /**
     * GET  /system-roles/:id : get the "id" systemRole.
     *
     * @param id the id of the systemRoleDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the systemRoleDTO, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/system-roles/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<SystemRoleDTO> getSystemRole(@PathVariable Long id) {
        log.debug("REST request to get SystemRole : {}", id);
        SystemRole systemRole = systemRoleRepository.findOne(id);
        SystemRoleDTO systemRoleDTO = systemRoleMapper.systemRoleToSystemRoleDTO(systemRole);
        return Optional.ofNullable(systemRoleDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /system-roles/:id : delete the "id" systemRole.
     *
     * @param id the id of the systemRoleDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/system-roles/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteSystemRole(@PathVariable Long id) {
        log.debug("REST request to delete SystemRole : {}", id);
        systemRoleRepository.delete(id);
        systemRoleSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("systemRole", id.toString())).build();
    }

    /**
     * SEARCH  /_search/system-roles?query=:query : search for the systemRole corresponding
     * to the query.
     *
     * @param query the query of the systemRole search
     * @return the result of the search
     */
    @RequestMapping(value = "/_search/system-roles",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<List<SystemRoleDTO>> searchSystemRoles(@RequestParam String query, Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to search for a page of SystemRoles for query {}", query);
        Page<SystemRole> page = systemRoleSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/system-roles");
        return new ResponseEntity<>(systemRoleMapper.systemRolesToSystemRoleDTOs(page.getContent()), headers, HttpStatus.OK);
    }

}
