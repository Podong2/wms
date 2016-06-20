package kr.wisestone.wms.web.rest;

import com.codahale.metrics.annotation.Timed;
import kr.wisestone.wms.domain.PermissionCategory;
import kr.wisestone.wms.repository.PermissionCategoryRepository;
import kr.wisestone.wms.repository.search.PermissionCategorySearchRepository;
import kr.wisestone.wms.service.PushService;
import kr.wisestone.wms.web.rest.dto.PermissionCategoryDTO;
import kr.wisestone.wms.web.rest.mapper.PermissionCategoryMapper;
import kr.wisestone.wms.web.rest.util.HeaderUtil;
import kr.wisestone.wms.web.rest.util.PaginationUtil;
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
import java.util.List;
import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * REST controller for managing PermissionCategory.
 */
@RestController
@RequestMapping("/api")
public class PermissionCategoryResource {

    private final Logger log = LoggerFactory.getLogger(PermissionCategoryResource.class);

    @Inject
    private PermissionCategoryRepository permissionCategoryRepository;

    @Inject
    private PermissionCategoryMapper permissionCategoryMapper;

    @Inject
    private PermissionCategorySearchRepository permissionCategorySearchRepository;

    /**
     * POST  /permission-categories : Create a new permissionCategory.
     *
     * @param permissionCategoryDTO the permissionCategoryDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new permissionCategoryDTO, or with status 400 (Bad Request) if the permissionCategory has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/permission-categories",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<PermissionCategoryDTO> createPermissionCategory(@RequestBody PermissionCategoryDTO permissionCategoryDTO) throws URISyntaxException {
        log.debug("REST request to save PermissionCategory : {}", permissionCategoryDTO);
        if (permissionCategoryDTO.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("permissionCategory", "idexists", "A new permissionCategory cannot already have an ID")).body(null);
        }
        PermissionCategory permissionCategory = permissionCategoryMapper.permissionCategoryDTOToPermissionCategory(permissionCategoryDTO);
        permissionCategory = permissionCategoryRepository.save(permissionCategory);
        PermissionCategoryDTO result = permissionCategoryMapper.permissionCategoryToPermissionCategoryDTO(permissionCategory);
        permissionCategorySearchRepository.save(permissionCategory);

        return ResponseEntity.created(new URI("/api/permission-categories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("permissionCategory", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /permission-categories : Updates an existing permissionCategory.
     *
     * @param permissionCategoryDTO the permissionCategoryDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated permissionCategoryDTO,
     * or with status 400 (Bad Request) if the permissionCategoryDTO is not valid,
     * or with status 500 (Internal Server Error) if the permissionCategoryDTO couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/permission-categories",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<PermissionCategoryDTO> updatePermissionCategory(@RequestBody PermissionCategoryDTO permissionCategoryDTO) throws URISyntaxException {
        log.debug("REST request to update PermissionCategory : {}", permissionCategoryDTO);
        if (permissionCategoryDTO.getId() == null) {
            return createPermissionCategory(permissionCategoryDTO);
        }
        PermissionCategory permissionCategory = permissionCategoryMapper.permissionCategoryDTOToPermissionCategory(permissionCategoryDTO);
        permissionCategory = permissionCategoryRepository.save(permissionCategory);
        PermissionCategoryDTO result = permissionCategoryMapper.permissionCategoryToPermissionCategoryDTO(permissionCategory);
        permissionCategorySearchRepository.save(permissionCategory);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("permissionCategory", permissionCategoryDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /permission-categories : get all the permissionCategories.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of permissionCategories in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/permission-categories",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<List<PermissionCategoryDTO>> getAllPermissionCategories(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of PermissionCategories");
        Page<PermissionCategory> page = permissionCategoryRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/permission-categories");
        return new ResponseEntity<>(permissionCategoryMapper.permissionCategoriesToPermissionCategoryDTOs(page.getContent()), headers, HttpStatus.OK);
    }

    /**
     * GET  /permission-categories/:id : get the "id" permissionCategory.
     *
     * @param id the id of the permissionCategoryDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the permissionCategoryDTO, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/permission-categories/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<PermissionCategoryDTO> getPermissionCategory(@PathVariable Long id) {
        log.debug("REST request to get PermissionCategory : {}", id);
        PermissionCategory permissionCategory = permissionCategoryRepository.findOne(id);
        PermissionCategoryDTO permissionCategoryDTO = permissionCategoryMapper.permissionCategoryToPermissionCategoryDTO(permissionCategory);
        return Optional.ofNullable(permissionCategoryDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /permission-categories/:id : delete the "id" permissionCategory.
     *
     * @param id the id of the permissionCategoryDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/permission-categories/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deletePermissionCategory(@PathVariable Long id) {
        log.debug("REST request to delete PermissionCategory : {}", id);
        permissionCategoryRepository.delete(id);
        permissionCategorySearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("permissionCategory", id.toString())).build();
    }

    /**
     * SEARCH  /_search/permission-categories?query=:query : search for the permissionCategory corresponding
     * to the query.
     *
     * @param query the query of the permissionCategory search
     * @return the result of the search
     */
    @RequestMapping(value = "/_search/permission-categories",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<List<PermissionCategoryDTO>> searchPermissionCategories(@RequestParam String query, Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to search for a page of PermissionCategories for query {}", query);
        Page<PermissionCategory> page = permissionCategorySearchRepository.search(queryStringQuery("*"+query+"*"), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/permission-categories");
        return new ResponseEntity<>(permissionCategoryMapper.permissionCategoriesToPermissionCategoryDTOs(page.getContent()), headers, HttpStatus.OK);
    }

}
