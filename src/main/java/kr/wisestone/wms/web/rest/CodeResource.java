package kr.wisestone.wms.web.rest;

import com.codahale.metrics.annotation.Timed;
import kr.wisestone.wms.domain.Code;
import kr.wisestone.wms.repository.CodeRepository;
import kr.wisestone.wms.repository.search.CodeSearchRepository;
import kr.wisestone.wms.web.rest.util.HeaderUtil;
import kr.wisestone.wms.web.rest.util.PaginationUtil;
import kr.wisestone.wms.web.rest.dto.CodeDTO;
import kr.wisestone.wms.web.rest.mapper.CodeMapper;
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
 * REST controller for managing Code.
 */
@RestController
@RequestMapping("/api")
public class CodeResource {

    private final Logger log = LoggerFactory.getLogger(CodeResource.class);

    @Inject
    private CodeRepository codeRepository;

    @Inject
    private CodeMapper codeMapper;

    @Inject
    private CodeSearchRepository codeSearchRepository;

    /**
     * POST  /codes : Create a new code.
     *
     * @param codeDTO the codeDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new codeDTO, or with status 400 (Bad Request) if the code has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/codes",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<CodeDTO> createCode(@RequestBody CodeDTO codeDTO) throws URISyntaxException {
        log.debug("REST request to save Code : {}", codeDTO);
        if (codeDTO.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("code", "idexists", "A new code cannot already have an ID")).body(null);
        }
        Code code = codeMapper.codeDTOToCode(codeDTO);
        code = codeRepository.save(code);
        CodeDTO result = codeMapper.codeToCodeDTO(code);
        codeSearchRepository.save(code);
        return ResponseEntity.created(new URI("/api/codes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("code", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /codes : Updates an existing code.
     *
     * @param codeDTO the codeDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated codeDTO,
     * or with status 400 (Bad Request) if the codeDTO is not valid,
     * or with status 500 (Internal Server Error) if the codeDTO couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/codes",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<CodeDTO> updateCode(@RequestBody CodeDTO codeDTO) throws URISyntaxException {
        log.debug("REST request to update Code : {}", codeDTO);
        if (codeDTO.getId() == null) {
            return createCode(codeDTO);
        }
        Code code = codeMapper.codeDTOToCode(codeDTO);
        code = codeRepository.save(code);
        CodeDTO result = codeMapper.codeToCodeDTO(code);
        codeSearchRepository.save(code);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("code", codeDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /codes : get all the codes.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of codes in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/codes",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<List<CodeDTO>> getAllCodes(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Codes");
        Page<Code> page = codeRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/codes");
        return new ResponseEntity<>(codeMapper.codesToCodeDTOs(page.getContent()), headers, HttpStatus.OK);
    }

    /**
     * GET  /codes : get all the codes.
     *
     * @param codeType the code's type
     * @return the ResponseEntity with status 200 (OK) and the list of codes in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/codes/findByCodeType",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<List<CodeDTO>> findByCodeType(@RequestParam String codeType)
        throws URISyntaxException {
        log.debug("REST request to get a page of Codes");
        List<Code> list = codeRepository.findByCodeType(codeType);
        return new ResponseEntity<>(codeMapper.codesToCodeDTOs(list), HttpStatus.OK);
    }

    /**
     * GET  /codes/:id : get the "id" code.
     *
     * @param id the id of the codeDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the codeDTO, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/codes/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<CodeDTO> getCode(@PathVariable Long id) {
        log.debug("REST request to get Code : {}", id);
        Code code = codeRepository.findOne(id);
        CodeDTO codeDTO = codeMapper.codeToCodeDTO(code);
        return Optional.ofNullable(codeDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /codes/:id : delete the "id" code.
     *
     * @param id the id of the codeDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/codes/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteCode(@PathVariable Long id) {
        log.debug("REST request to delete Code : {}", id);
        codeRepository.delete(id);
        codeSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("code", id.toString())).build();
    }

    /**
     * SEARCH  /_search/codes?query=:query : search for the code corresponding
     * to the query.
     *
     * @param query the query of the code search
     * @return the result of the search
     */
    @RequestMapping(value = "/_search/codes",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<List<CodeDTO>> searchCodes(@RequestParam String query, Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to search for a page of Codes for query {}", query);
        Page<Code> page = codeSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/codes");
        return new ResponseEntity<>(codeMapper.codesToCodeDTOs(page.getContent()), headers, HttpStatus.OK);
    }

}
