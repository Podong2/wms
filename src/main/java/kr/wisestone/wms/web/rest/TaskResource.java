package kr.wisestone.wms.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.google.common.collect.Lists;
import kr.wisestone.wms.domain.Code;
import kr.wisestone.wms.domain.Task;
import kr.wisestone.wms.domain.User;
import kr.wisestone.wms.repository.TaskRepository;
import kr.wisestone.wms.repository.search.TaskSearchRepository;
import kr.wisestone.wms.service.TaskService;
import kr.wisestone.wms.service.UserService;
import kr.wisestone.wms.web.rest.condition.TaskCondition;
import kr.wisestone.wms.web.rest.form.TaskForm;
import kr.wisestone.wms.web.rest.util.HeaderUtil;
import kr.wisestone.wms.web.rest.util.PaginationUtil;
import kr.wisestone.wms.web.rest.dto.TaskDTO;
import kr.wisestone.wms.web.rest.mapper.TaskMapper;
import org.elasticsearch.common.unit.Fuzziness;
import org.elasticsearch.index.query.MatchQueryBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
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
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
    private TaskRepository taskRepository;

    @Inject
    private TaskSearchRepository taskSearchRepository;

    @Inject
    private TaskMapper taskMapper;

    @Inject
    private ElasticsearchTemplate elasticsearchTemplate;

    @Inject
    private UserService userService;

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
    public ResponseEntity<TaskDTO> createTask(@RequestBody TaskForm taskForm) throws URISyntaxException {
        log.debug("REST request to save Task : {}", taskForm);
        if (taskForm.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("task", "idexists", "A new task cannot already have an ID")).body(null);
        }

        TaskDTO result = taskService.createByName(taskForm.getName());
        return ResponseEntity.created(new URI("/api/tasks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("task", result.getId().toString()))
            .body(result);
    }

    @RequestMapping(value = "/tasks/save",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<TaskDTO> saveTask(@RequestBody TaskForm taskForm, MultipartHttpServletRequest request) throws URISyntaxException {

        log.debug("REST request to save Task : {}", taskForm);

        if (taskForm.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("task", "idexists", "A new task cannot already have an ID")).body(null);
        }

        List<MultipartFile> files = request.getFiles("file");

        TaskDTO result = taskService.saveTask(taskForm, files);

        return ResponseEntity.created(new URI("/api/tasks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("task", result.getId().toString()))
            .body(result);
    }

    @RequestMapping(value = "/tasks/createSubTask",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<TaskDTO> createSubTask(@RequestBody TaskForm taskForm) throws URISyntaxException {
        log.debug("REST request to save Task : {}", taskForm);
        if (taskForm.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("task", "idexists", "A new task cannot already have an ID")).body(null);
        }

        TaskDTO result = taskService.createSubTask(taskForm);
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
            return createTask(taskForm);
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
     * @return the ResponseEntity with status 200 (OK) and the list of tasks in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/tasks",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<List<TaskDTO>> getAllTasks(@ModelAttribute TaskCondition taskCondition)
        throws URISyntaxException {
        log.debug("REST request to get a page of Tasks");

        List<TaskDTO> result = taskService.findAll(taskCondition);
//        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/tasks");
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/tasks/findByName",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<TaskDTO>> findByName(@RequestParam("name") String name) {
        log.debug("REST request to get Task name : {}", name);

        List<TaskDTO> taskDTOs = taskService.findByNameLike(name);

        return new ResponseEntity<>(taskDTOs, HttpStatus.OK);
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
    @Transactional(readOnly = true)
    public ResponseEntity<List<TaskDTO>> findSimilar(@RequestParam String name) throws URISyntaxException {

        SearchQuery searchQuery = new NativeSearchQueryBuilder()
            .withQuery(matchQuery("name", name)
                .operator(MatchQueryBuilder.Operator.AND)
                .fuzziness(Fuzziness.AUTO)
                .prefixLength(0))
            .build();

        List<Task> tasks = elasticsearchTemplate.queryForList(searchQuery, Task.class);

        for(Task task : tasks) {
//            task.setAssignee(this.userService.getUserWithAuthorities(task.getAssignee().getId()));
        }

        return new ResponseEntity<>(taskMapper.tasksToTaskDTOs(tasks), HttpStatus.OK);
    }

    @RequestMapping(value = "/tasks/bulkInsert",
                    method = RequestMethod.GET,
                    produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    public ResponseEntity<Void> findSimilar() throws URISyntaxException {

        Code code = new Code();
        code.setId(10000L);

        User user = new User();
        user.setId(3L);

        for(int i=0; i<100;i++) {

            Task task = new Task();
            task.setName("task-"+i);
            task.setEndDate("2016-07-01");
            task.setContents("1231231234123");
            task.setStatus(code);

            this.taskRepository.save(task);
            this.taskSearchRepository.save(task);
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
