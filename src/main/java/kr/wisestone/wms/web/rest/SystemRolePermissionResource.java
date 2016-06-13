package kr.wisestone.wms.web.rest;

import com.codahale.metrics.annotation.Timed;
import kr.wisestone.wms.domain.SystemRolePermission;
import kr.wisestone.wms.service.SystemRolePermissionService;
import kr.wisestone.wms.web.rest.util.HeaderUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing SystemRolePermission.
 */
@RestController
@RequestMapping("/api")
public class SystemRolePermissionResource {

    private final Logger log = LoggerFactory.getLogger(SystemRolePermissionResource.class);
        
    @Inject
    private SystemRolePermissionService systemRolePermissionService;
    
    /**
     * POST  /system-role-permissions : Create a new systemRolePermission.
     *
     * @param systemRolePermission the systemRolePermission to create
     * @return the ResponseEntity with status 201 (Created) and with body the new systemRolePermission, or with status 400 (Bad Request) if the systemRolePermission has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/system-role-permissions",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<SystemRolePermission> createSystemRolePermission(@RequestBody SystemRolePermission systemRolePermission) throws URISyntaxException {
        log.debug("REST request to save SystemRolePermission : {}", systemRolePermission);
        if (systemRolePermission.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("systemRolePermission", "idexists", "A new systemRolePermission cannot already have an ID")).body(null);
        }
        SystemRolePermission result = systemRolePermissionService.save(systemRolePermission);
        return ResponseEntity.created(new URI("/api/system-role-permissions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("systemRolePermission", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /system-role-permissions : Updates an existing systemRolePermission.
     *
     * @param systemRolePermission the systemRolePermission to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated systemRolePermission,
     * or with status 400 (Bad Request) if the systemRolePermission is not valid,
     * or with status 500 (Internal Server Error) if the systemRolePermission couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/system-role-permissions",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<SystemRolePermission> updateSystemRolePermission(@RequestBody SystemRolePermission systemRolePermission) throws URISyntaxException {
        log.debug("REST request to update SystemRolePermission : {}", systemRolePermission);
        if (systemRolePermission.getId() == null) {
            return createSystemRolePermission(systemRolePermission);
        }
        SystemRolePermission result = systemRolePermissionService.save(systemRolePermission);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("systemRolePermission", systemRolePermission.getId().toString()))
            .body(result);
    }

    /**
     * GET  /system-role-permissions : get all the systemRolePermissions.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of systemRolePermissions in body
     */
    @RequestMapping(value = "/system-role-permissions",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<SystemRolePermission> getAllSystemRolePermissions() {
        log.debug("REST request to get all SystemRolePermissions");
        return systemRolePermissionService.findAll();
    }

    /**
     * GET  /system-role-permissions/:id : get the "id" systemRolePermission.
     *
     * @param id the id of the systemRolePermission to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the systemRolePermission, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/system-role-permissions/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<SystemRolePermission> getSystemRolePermission(@PathVariable Long id) {
        log.debug("REST request to get SystemRolePermission : {}", id);
        SystemRolePermission systemRolePermission = systemRolePermissionService.findOne(id);
        return Optional.ofNullable(systemRolePermission)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /system-role-permissions/:id : delete the "id" systemRolePermission.
     *
     * @param id the id of the systemRolePermission to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/system-role-permissions/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteSystemRolePermission(@PathVariable Long id) {
        log.debug("REST request to delete SystemRolePermission : {}", id);
        systemRolePermissionService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("systemRolePermission", id.toString())).build();
    }

    /**
     * SEARCH  /_search/system-role-permissions?query=:query : search for the systemRolePermission corresponding
     * to the query.
     *
     * @param query the query of the systemRolePermission search
     * @return the result of the search
     */
    @RequestMapping(value = "/_search/system-role-permissions",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<SystemRolePermission> searchSystemRolePermissions(@RequestParam String query) {
        log.debug("REST request to search SystemRolePermissions for query {}", query);
        return systemRolePermissionService.search(query);
    }

}
