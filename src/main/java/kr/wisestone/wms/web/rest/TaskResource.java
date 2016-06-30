package kr.wisestone.wms.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.google.common.collect.Lists;
import kr.wisestone.wms.domain.Task;
import kr.wisestone.wms.service.TaskService;
import kr.wisestone.wms.web.rest.condition.TaskCondition;
import kr.wisestone.wms.web.rest.form.TaskForm;
import kr.wisestone.wms.web.rest.util.HeaderUtil;
import kr.wisestone.wms.web.rest.util.PaginationUtil;
import kr.wisestone.wms.web.rest.dto.TaskDTO;
import kr.wisestone.wms.web.rest.mapper.TaskMapper;
import org.elasticsearch.common.unit.Fuzziness;
import org.elasticsearch.index.query.MoreLikeThisQueryBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.core.query.MoreLikeThisQuery;
import org.springframework.data.elasticsearch.core.query.NativeSearchQuery;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.core.query.SearchQuery;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.inject.Inject;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Task.
 */
@RestController
@RequestMapping("/api")
public class TaskResource {

    private final Logger log = LoggerFactory.getLogger(TaskResource.class);

    @Inject
    private TaskService taskService;

    @Inject
    private TaskMapper taskMapper;

    @Inject
    private ElasticsearchTemplate elasticsearchTemplate;

    /**
     * POST  /tasks : Create a new task.
     *
     * @param taskForm the taskForm to create
     * @return the ResponseEntity with status 201 (Created) and with body the new taskDTO, or with status 400 (Bad Request) if the task has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/tasks",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<TaskDTO> createTask(TaskForm taskForm, MultipartHttpServletRequest request) throws URISyntaxException {
        log.debug("REST request to save Task : {}", taskForm);
        if (taskForm.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("task", "idexists", "A new task cannot already have an ID")).body(null);
        }

        List<MultipartFile> files = request.getFiles("file");

        TaskDTO result = taskService.save(taskForm, files);
        return ResponseEntity.created(new URI("/api/tasks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("task", result.getId().toString()))
            .body(result);
    }

    /**
     * POST  /tasks/update : Updates an existing task.
     *
     * @param taskForm the taskForm to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated taskDTO,
     * or with status 400 (Bad Request) if the taskDTO is not valid,
     * or with status 500 (Internal Server Error) if the taskDTO couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/tasks/update",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<TaskDTO> updateTask(TaskForm taskForm, MultipartHttpServletRequest request) throws URISyntaxException, IOException {
        log.debug("REST request to update Task : {}", taskForm);
        if (taskForm.getId() == null) {
            return createTask(taskForm, request);
        }

        List<MultipartFile> files = request.getFiles("file");

        TaskDTO result = taskService.update(taskForm, files);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("task", taskForm.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /tasks : Updates an existing task.
     *
     * @param taskForm the taskForm to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated taskDTO,
     * or with status 400 (Bad Request) if the taskDTO is not valid,
     * or with status 500 (Internal Server Error) if the taskDTO couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/tasks",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<TaskDTO> updateTask(TaskForm taskForm) throws URISyntaxException {
        log.debug("REST request to update Task : {}", taskForm);

        TaskDTO result = taskService.update(taskForm, Lists.newArrayList());
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("task", taskForm.getId().toString()))
            .body(result);
    }

    /**
     * GET  /tasks : get all the tasks.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of tasks in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/tasks",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<List<TaskDTO>> getAllTasks(@ModelAttribute TaskCondition taskCondition, Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Tasks");
        Page<Task> page = taskService.findAll(taskCondition, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/tasks");
        return new ResponseEntity<>(taskMapper.tasksToTaskDTOs(page.getContent()), headers, HttpStatus.OK);
    }

    /**
     * GET  /tasks/:id : get the "id" task.
     *
     * @param id the id of the taskDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the taskDTO, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/tasks/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<TaskDTO> getTask(@PathVariable Long id) {
        log.debug("REST request to get Task : {}", id);
        TaskDTO taskDTO = taskService.findOne(id);
        return Optional.ofNullable(taskDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /tasks/:id : delete the "id" task.
     *
     * @param id the id of the taskDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/tasks/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        log.debug("REST request to delete Task : {}", id);
        taskService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntitySingleDeletionAlert("task", id.toString())).build();
    }

    /**
     * DELETE  /tasks : delete the "targetIds" task.
     *
     * @param targetIds the id of the taskDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/tasks",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteTask(@RequestParam(value = "targetIds", required = true) List<Long> targetIds) {
        taskService.delete(targetIds);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityMultipleDeletionAlert("task", targetIds.size()+"")).build();
    }

    /**
     * SEARCH  /_search/tasks?query=:query : search for the task corresponding
     * to the query.
     *
     * @param query the query of the task search
     * @return the result of the search
     */
    @RequestMapping(value = "/_search/tasks",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<List<TaskDTO>> searchTasks(@RequestParam String query, Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to search for a page of Tasks for query {}", query);
        Page<Task> page = taskService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/tasks");
        return new ResponseEntity<>(taskMapper.tasksToTaskDTOs(page.getContent()), headers, HttpStatus.OK);
    }

    @RequestMapping(value = "/tasks/findSimilar",
                    method = RequestMethod.GET,
                    produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<TaskDTO>> findSimilar(@RequestParam String name) throws URISyntaxException {

        SearchQuery query = new NativeSearchQueryBuilder().withQuery(
                                    matchQuery("name", name).boost(2).prefixLength(0).slop(3)
                                ).build();

        List<Task> tasks = elasticsearchTemplate.queryForList(query, Task.class);

        return new ResponseEntity<>(taskMapper.tasksToTaskDTOs(tasks), HttpStatus.OK);
    }
}
