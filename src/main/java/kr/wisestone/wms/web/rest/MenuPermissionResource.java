package kr.wisestone.wms.web.rest;

import com.codahale.metrics.annotation.Timed;
import kr.wisestone.wms.domain.MenuPermission;
import kr.wisestone.wms.service.MenuPermissionService;
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
 * REST controller for managing MenuPermission.
 */
@RestController
@RequestMapping("/api")
public class MenuPermissionResource {

    private final Logger log = LoggerFactory.getLogger(MenuPermissionResource.class);
        
    @Inject
    private MenuPermissionService menuPermissionService;
    
    /**
     * POST  /menu-permissions : Create a new menuPermission.
     *
     * @param menuPermission the menuPermission to create
     * @return the ResponseEntity with status 201 (Created) and with body the new menuPermission, or with status 400 (Bad Request) if the menuPermission has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/menu-permissions",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<MenuPermission> createMenuPermission(@RequestBody MenuPermission menuPermission) throws URISyntaxException {
        log.debug("REST request to save MenuPermission : {}", menuPermission);
        if (menuPermission.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("menuPermission", "idexists", "A new menuPermission cannot already have an ID")).body(null);
        }
        MenuPermission result = menuPermissionService.save(menuPermission);
        return ResponseEntity.created(new URI("/api/menu-permissions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("menuPermission", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /menu-permissions : Updates an existing menuPermission.
     *
     * @param menuPermission the menuPermission to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated menuPermission,
     * or with status 400 (Bad Request) if the menuPermission is not valid,
     * or with status 500 (Internal Server Error) if the menuPermission couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/menu-permissions",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<MenuPermission> updateMenuPermission(@RequestBody MenuPermission menuPermission) throws URISyntaxException {
        log.debug("REST request to update MenuPermission : {}", menuPermission);
        if (menuPermission.getId() == null) {
            return createMenuPermission(menuPermission);
        }
        MenuPermission result = menuPermissionService.save(menuPermission);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("menuPermission", menuPermission.getId().toString()))
            .body(result);
    }

    /**
     * GET  /menu-permissions : get all the menuPermissions.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of menuPermissions in body
     */
    @RequestMapping(value = "/menu-permissions",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<MenuPermission> getAllMenuPermissions() {
        log.debug("REST request to get all MenuPermissions");
        return menuPermissionService.findAll();
    }

    /**
     * GET  /menu-permissions/:id : get the "id" menuPermission.
     *
     * @param id the id of the menuPermission to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the menuPermission, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/menu-permissions/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<MenuPermission> getMenuPermission(@PathVariable Long id) {
        log.debug("REST request to get MenuPermission : {}", id);
        MenuPermission menuPermission = menuPermissionService.findOne(id);
        return Optional.ofNullable(menuPermission)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /menu-permissions/:id : delete the "id" menuPermission.
     *
     * @param id the id of the menuPermission to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/menu-permissions/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteMenuPermission(@PathVariable Long id) {
        log.debug("REST request to delete MenuPermission : {}", id);
        menuPermissionService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("menuPermission", id.toString())).build();
    }

    /**
     * SEARCH  /_search/menu-permissions?query=:query : search for the menuPermission corresponding
     * to the query.
     *
     * @param query the query of the menuPermission search
     * @return the result of the search
     */
    @RequestMapping(value = "/_search/menu-permissions",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<MenuPermission> searchMenuPermissions(@RequestParam String query) {
        log.debug("REST request to search MenuPermissions for query {}", query);
        return menuPermissionService.search(query);
    }

}
