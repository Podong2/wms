package kr.wisestone.wms.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.google.common.base.Predicate;
import com.google.common.collect.Iterables;
import kr.wisestone.wms.domain.Menu;
import kr.wisestone.wms.repository.MenuRepository;
import kr.wisestone.wms.repository.search.MenuSearchRepository;
import kr.wisestone.wms.web.rest.util.HeaderUtil;
import kr.wisestone.wms.web.rest.util.PaginationUtil;
import kr.wisestone.wms.web.rest.dto.MenuDTO;
import kr.wisestone.wms.web.rest.mapper.MenuMapper;
import org.hibernate.Hibernate;
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

import javax.annotation.Nullable;
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
 * REST controller for managing Menu.
 */
@RestController
@RequestMapping("/api")
public class MenuResource {

    private final Logger log = LoggerFactory.getLogger(MenuResource.class);

    @Inject
    private MenuRepository menuRepository;

    @Inject
    private MenuMapper menuMapper;

    @Inject
    private MenuSearchRepository menuSearchRepository;

    /**
     * POST  /menus : Create a new menu.
     *
     * @param menuDTO the menuDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new menuDTO, or with status 400 (Bad Request) if the menu has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/menus",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<MenuDTO> createMenu(@RequestBody MenuDTO menuDTO) throws URISyntaxException {
        log.debug("REST request to save Menu : {}", menuDTO);
        if (menuDTO.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("menu", "idexists", "A new menu cannot already have an ID")).body(null);
        }
        Menu menu = menuMapper.menuDTOToMenu(menuDTO);
        menu = menuRepository.save(menu);
        MenuDTO result = menuMapper.menuToMenuDTO(menu);
        menuSearchRepository.save(menu);
        return ResponseEntity.created(new URI("/api/menus/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("menu", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /menus : Updates an existing menu.
     *
     * @param menuDTO the menuDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated menuDTO,
     * or with status 400 (Bad Request) if the menuDTO is not valid,
     * or with status 500 (Internal Server Error) if the menuDTO couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/menus",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<MenuDTO> updateMenu(@RequestBody MenuDTO menuDTO) throws URISyntaxException {
        log.debug("REST request to update Menu : {}", menuDTO);
        if (menuDTO.getId() == null) {
            return createMenu(menuDTO);
        }
        Menu origin = menuRepository.findOne(menuDTO.getId());
        origin.update(menuDTO);

        if(menuDTO.getParentId() != null) {
            origin.setParent(menuRepository.findOne(menuDTO.getParentId()));
        } else {
            origin.setParent(null);
        }

        origin = menuRepository.save(origin);
        MenuDTO result = menuMapper.menuToMenuDTO(origin);
        menuSearchRepository.save(origin);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("menu", menuDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /menus : get all the menus.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of menus in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/menus",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<List<MenuDTO>> getAllMenus(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Menus");
        Page<Menu> page = menuRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/menus");
        return new ResponseEntity<>(menuMapper.menusToMenuDTOs(page.getContent()), headers, HttpStatus.OK);
    }

    /**
     * GET  /menus : get all the menus.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of menus in body
     */
    @RequestMapping(value = "/menus/top-menus",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<List<MenuDTO>> getTopMenus()
        throws URISyntaxException {
        log.debug("REST request to get a page of Menus");
        List<Menu> topMenuList = menuRepository.findByParentIsNullAndDisplayYnIsTrueOrderByPosition();
        return new ResponseEntity<>(menuMapper.menusToMenuDTOs(topMenuList), HttpStatus.OK);
    }

    /**
     * GET  /menus/:id : get the "id" menu.
     *
     * @param id the id of the menuDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the menuDTO, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/menus/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<MenuDTO> getMenu(@PathVariable Long id) {
        log.debug("REST request to get Menu : {}", id);
        Menu menu = menuRepository.findOne(id);
        MenuDTO menuDTO = menuMapper.menuToMenuDTO(menu);
        return Optional.ofNullable(menuDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /menus/:id : delete the "id" menu.
     *
     * @param id the id of the menuDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/menus/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteMenu(@PathVariable Long id) {
        log.debug("REST request to delete Menu : {}", id);

        Menu origin = menuRepository.findOne(id);

        if(origin.getChildMenus() != null && !origin.getChildMenus().isEmpty()) {

            for(Menu childMenu : origin.getChildMenus()) {
                childMenu.setParent(null);

                menuRepository.save(childMenu);
                menuSearchRepository.save(childMenu);
            }
        }

        menuRepository.delete(id);
        menuSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("menu", id.toString())).build();
    }

    /**
     * SEARCH  /_search/menus?query=:query : search for the menu corresponding
     * to the query.
     *
     * @param query the query of the menu search
     * @return the result of the search
     */
    @RequestMapping(value = "/_search/menus",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<List<MenuDTO>> searchMenus(@RequestParam String query, Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to search for a page of Menus for query {}", query);
        Page<Menu> page = menuSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/menus");
        return new ResponseEntity<>(menuMapper.menusToMenuDTOs(page.getContent()), headers, HttpStatus.OK);
    }

}
