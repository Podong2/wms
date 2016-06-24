package kr.wisestone.wms.web.rest;

import com.codahale.metrics.annotation.Timed;
import kr.wisestone.wms.domain.TaskAttachedFile;
import kr.wisestone.wms.repository.TaskAttachedFileRepository;
import kr.wisestone.wms.repository.search.TaskAttachedFileSearchRepository;
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
 * REST controller for managing TaskAttachedFile.
 */
@RestController
@RequestMapping("/api")
public class TaskAttachedFileResource {

    private final Logger log = LoggerFactory.getLogger(TaskAttachedFileResource.class);
        
    @Inject
    private TaskAttachedFileRepository taskAttachedFileRepository;
    
    @Inject
    private TaskAttachedFileSearchRepository taskAttachedFileSearchRepository;
    
    /**
     * POST  /task-attached-files : Create a new taskAttachedFile.
     *
     * @param taskAttachedFile the taskAttachedFile to create
     * @return the ResponseEntity with status 201 (Created) and with body the new taskAttachedFile, or with status 400 (Bad Request) if the taskAttachedFile has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/task-attached-files",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<TaskAttachedFile> createTaskAttachedFile(@RequestBody TaskAttachedFile taskAttachedFile) throws URISyntaxException {
        log.debug("REST request to save TaskAttachedFile : {}", taskAttachedFile);
        if (taskAttachedFile.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("taskAttachedFile", "idexists", "A new taskAttachedFile cannot already have an ID")).body(null);
        }
        TaskAttachedFile result = taskAttachedFileRepository.save(taskAttachedFile);
        taskAttachedFileSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/task-attached-files/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("taskAttachedFile", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /task-attached-files : Updates an existing taskAttachedFile.
     *
     * @param taskAttachedFile the taskAttachedFile to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated taskAttachedFile,
     * or with status 400 (Bad Request) if the taskAttachedFile is not valid,
     * or with status 500 (Internal Server Error) if the taskAttachedFile couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/task-attached-files",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<TaskAttachedFile> updateTaskAttachedFile(@RequestBody TaskAttachedFile taskAttachedFile) throws URISyntaxException {
        log.debug("REST request to update TaskAttachedFile : {}", taskAttachedFile);
        if (taskAttachedFile.getId() == null) {
            return createTaskAttachedFile(taskAttachedFile);
        }
        TaskAttachedFile result = taskAttachedFileRepository.save(taskAttachedFile);
        taskAttachedFileSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("taskAttachedFile", taskAttachedFile.getId().toString()))
            .body(result);
    }

    /**
     * GET  /task-attached-files : get all the taskAttachedFiles.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of taskAttachedFiles in body
     */
    @RequestMapping(value = "/task-attached-files",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<TaskAttachedFile> getAllTaskAttachedFiles() {
        log.debug("REST request to get all TaskAttachedFiles");
        List<TaskAttachedFile> taskAttachedFiles = taskAttachedFileRepository.findAll();
        return taskAttachedFiles;
    }

    /**
     * GET  /task-attached-files/:id : get the "id" taskAttachedFile.
     *
     * @param id the id of the taskAttachedFile to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the taskAttachedFile, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/task-attached-files/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<TaskAttachedFile> getTaskAttachedFile(@PathVariable Long id) {
        log.debug("REST request to get TaskAttachedFile : {}", id);
        TaskAttachedFile taskAttachedFile = taskAttachedFileRepository.findOne(id);
        return Optional.ofNullable(taskAttachedFile)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /task-attached-files/:id : delete the "id" taskAttachedFile.
     *
     * @param id the id of the taskAttachedFile to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/task-attached-files/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteTaskAttachedFile(@PathVariable Long id) {
        log.debug("REST request to delete TaskAttachedFile : {}", id);
        taskAttachedFileRepository.delete(id);
        taskAttachedFileSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("taskAttachedFile", id.toString())).build();
    }

    /**
     * SEARCH  /_search/task-attached-files?query=:query : search for the taskAttachedFile corresponding
     * to the query.
     *
     * @param query the query of the taskAttachedFile search
     * @return the result of the search
     */
    @RequestMapping(value = "/_search/task-attached-files",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<TaskAttachedFile> searchTaskAttachedFiles(@RequestParam String query) {
        log.debug("REST request to search TaskAttachedFiles for query {}", query);
        return StreamSupport
            .stream(taskAttachedFileSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
