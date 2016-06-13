package kr.wisestone.wms.web.rest;

import com.codahale.metrics.annotation.Timed;
import kr.wisestone.wms.domain.SystemRoleUser;
import kr.wisestone.wms.service.SystemRoleUserService;
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
 * REST controller for managing SystemRoleUser.
 */
@RestController
@RequestMapping("/api")
public class SystemRoleUserResource {

    private final Logger log = LoggerFactory.getLogger(SystemRoleUserResource.class);
        
    @Inject
    private SystemRoleUserService systemRoleUserService;
    
    /**
     * POST  /system-role-users : Create a new systemRoleUser.
     *
     * @param systemRoleUser the systemRoleUser to create
     * @return the ResponseEntity with status 201 (Created) and with body the new systemRoleUser, or with status 400 (Bad Request) if the systemRoleUser has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/system-role-users",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<SystemRoleUser> createSystemRoleUser(@RequestBody SystemRoleUser systemRoleUser) throws URISyntaxException {
        log.debug("REST request to save SystemRoleUser : {}", systemRoleUser);
        if (systemRoleUser.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("systemRoleUser", "idexists", "A new systemRoleUser cannot already have an ID")).body(null);
        }
        SystemRoleUser result = systemRoleUserService.save(systemRoleUser);
        return ResponseEntity.created(new URI("/api/system-role-users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("systemRoleUser", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /system-role-users : Updates an existing systemRoleUser.
     *
     * @param systemRoleUser the systemRoleUser to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated systemRoleUser,
     * or with status 400 (Bad Request) if the systemRoleUser is not valid,
     * or with status 500 (Internal Server Error) if the systemRoleUser couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/system-role-users",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<SystemRoleUser> updateSystemRoleUser(@RequestBody SystemRoleUser systemRoleUser) throws URISyntaxException {
        log.debug("REST request to update SystemRoleUser : {}", systemRoleUser);
        if (systemRoleUser.getId() == null) {
            return createSystemRoleUser(systemRoleUser);
        }
        SystemRoleUser result = systemRoleUserService.save(systemRoleUser);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("systemRoleUser", systemRoleUser.getId().toString()))
            .body(result);
    }

    /**
     * GET  /system-role-users : get all the systemRoleUsers.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of systemRoleUsers in body
     */
    @RequestMapping(value = "/system-role-users",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<SystemRoleUser> getAllSystemRoleUsers() {
        log.debug("REST request to get all SystemRoleUsers");
        return systemRoleUserService.findAll();
    }

    /**
     * GET  /system-role-users/:id : get the "id" systemRoleUser.
     *
     * @param id the id of the systemRoleUser to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the systemRoleUser, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/system-role-users/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<SystemRoleUser> getSystemRoleUser(@PathVariable Long id) {
        log.debug("REST request to get SystemRoleUser : {}", id);
        SystemRoleUser systemRoleUser = systemRoleUserService.findOne(id);
        return Optional.ofNullable(systemRoleUser)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /system-role-users/:id : delete the "id" systemRoleUser.
     *
     * @param id the id of the systemRoleUser to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/system-role-users/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteSystemRoleUser(@PathVariable Long id) {
        log.debug("REST request to delete SystemRoleUser : {}", id);
        systemRoleUserService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("systemRoleUser", id.toString())).build();
    }

    /**
     * SEARCH  /_search/system-role-users?query=:query : search for the systemRoleUser corresponding
     * to the query.
     *
     * @param query the query of the systemRoleUser search
     * @return the result of the search
     */
    @RequestMapping(value = "/_search/system-role-users",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<SystemRoleUser> searchSystemRoleUsers(@RequestParam String query) {
        log.debug("REST request to search SystemRoleUsers for query {}", query);
        return systemRoleUserService.search(query);
    }

}
