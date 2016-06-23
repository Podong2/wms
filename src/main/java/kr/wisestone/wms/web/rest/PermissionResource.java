package kr.wisestone.wms.web.rest;

import com.codahale.metrics.annotation.Timed;
import kr.wisestone.wms.domain.Permission;
import kr.wisestone.wms.service.PermissionService;
import kr.wisestone.wms.web.rest.util.HeaderUtil;
import kr.wisestone.wms.web.rest.util.PaginationUtil;
import kr.wisestone.wms.web.rest.dto.PermissionDTO;
import kr.wisestone.wms.web.rest.mapper.PermissionMapper;
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
 * REST controller for managing Permission.
 */
@RestController
@RequestMapping("/api")
public class PermissionResource {

    private final Logger log = LoggerFactory.getLogger(PermissionResource.class);

    @Inject
    private PermissionService permissionService;

    @Inject
    private PermissionMapper permissionMapper;

    /**
     * POST  /permissions : Create a new permission.
     *
     * @param permissionDTO the permissionDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new permissionDTO, or with status 400 (Bad Request) if the permission has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/permissions",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<PermissionDTO> createPermission(@RequestBody PermissionDTO permissionDTO) throws URISyntaxException {
        log.debug("REST request to save Permission : {}", permissionDTO);
        if (permissionDTO.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("permission", "idexists", "A new permission cannot already have an ID")).body(null);
        }
        PermissionDTO result = permissionService.save(permissionDTO);
        return ResponseEntity.created(new URI("/api/permissions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("permission", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /permissions : Updates an existing permission.
     *
     * @param permissionDTO the permissionDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated permissionDTO,
     * or with status 400 (Bad Request) if the permissionDTO is not valid,
     * or with status 500 (Internal Server Error) if the permissionDTO couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/permissions",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<PermissionDTO> updatePermission(@RequestBody PermissionDTO permissionDTO) throws URISyntaxException {
        log.debug("REST request to update Permission : {}", permissionDTO);
        if (permissionDTO.getId() == null) {
            return createPermission(permissionDTO);
        }
        PermissionDTO result = permissionService.save(permissionDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("permission", permissionDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /permissions : get all the permissions.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of permissions in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/permissions",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<List<PermissionDTO>> getAllPermissions(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Permissions");
        Page<Permission> page = permissionService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/permissions");
        return new ResponseEntity<>(permissionMapper.permissionsToPermissionDTOs(page.getContent()), headers, HttpStatus.OK);
    }

    /**
     * GET  /permissions : get all the permissions.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of permissions in body
     */
    @RequestMapping(value = "/permissions/user-permissions",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<List<PermissionDTO>> getAllUserPermissions()
        throws URISyntaxException {
        log.debug("REST request to get a page of Permissions");
        List<PermissionDTO> userPermissions = permissionService.getAllPermissionOfUser();
        return new ResponseEntity<>(userPermissions, HttpStatus.OK);
    }

    /**
     * GET  /permissions : get all the permissions.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of permissions in body
     */
    @RequestMapping(value = "/permissions/menu-permissions",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<List<PermissionDTO>> getMenuUserPermissions(@RequestParam(name="urlPath") String urlPath)
        throws URISyntaxException {
        log.debug("REST request to get a page of Permissions");
        List<PermissionDTO> userPermissions = permissionService.findMenuPermissionByUserAndMenuUrl(urlPath);
        return new ResponseEntity<>(userPermissions, HttpStatus.OK);
    }

    /**
     * GET  /permissions/user : get all the permissions of login user.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of permissions in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/permissions/user",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<List<PermissionDTO>> getAllPermissionOfUser()
        throws URISyntaxException {
        log.debug("REST request to get a page of Permissions");

        return new ResponseEntity<>(permissionService.getAllPermissionOfUser(), HttpStatus.OK);
    }

    /**
     * GET  /permissions/:id : get the "id" permission.
     *
     * @param id the id of the permissionDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the permissionDTO, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/permissions/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<PermissionDTO> getPermission(@PathVariable Long id) {
        log.debug("REST request to get Permission : {}", id);
        PermissionDTO permissionDTO = permissionService.findOne(id);
        return Optional.ofNullable(permissionDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /permissions/:id : delete the "id" permission.
     *
     * @param id the id of the permissionDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/permissions/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deletePermission(@PathVariable Long id) {
        log.debug("REST request to delete Permission : {}", id);
        permissionService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("permission", id.toString())).build();
    }

    /**
     * SEARCH  /_search/permissions?query=:query : search for the permission corresponding
     * to the query.
     *
     * @param query the query of the permission search
     * @return the result of the search
     */
    @RequestMapping(value = "/_search/permissions",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<List<PermissionDTO>> searchPermissions(@RequestParam String query, Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to search for a page of Permissions for query {}", query);
        Page<Permission> page = permissionService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/permissions");
        return new ResponseEntity<>(permissionMapper.permissionsToPermissionDTOs(page.getContent()), headers, HttpStatus.OK);
    }

}
