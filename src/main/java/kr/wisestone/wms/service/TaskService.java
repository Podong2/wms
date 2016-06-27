package kr.wisestone.wms.service;

import com.mysema.query.BooleanBuilder;
import kr.wisestone.wms.domain.QTask;
import kr.wisestone.wms.domain.Task;
import kr.wisestone.wms.repository.TaskRepository;
import kr.wisestone.wms.repository.search.TaskSearchRepository;
import kr.wisestone.wms.web.rest.condition.TaskCondition;
import kr.wisestone.wms.web.rest.dto.TaskDTO;
import kr.wisestone.wms.web.rest.mapper.TaskMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.inject.Inject;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Task.
 */
@Service
@Transactional
public class TaskService {

    private final Logger log = LoggerFactory.getLogger(TaskService.class);

    @Inject
    private TaskRepository taskRepository;

    @Inject
    private TaskMapper taskMapper;

    @Inject
    private TaskSearchRepository taskSearchRepository;

    /**
     * Save a task.
     *
     * @param taskDTO the entity to save
     * @return the persisted entity
     */
    public TaskDTO save(TaskDTO taskDTO) {
        log.debug("Request to save Task : {}", taskDTO);
        Task task = taskMapper.taskDTOToTask(taskDTO);
        task = taskRepository.save(task);
        TaskDTO result = taskMapper.taskToTaskDTO(task);
        taskSearchRepository.save(task);
        return result;
    }

    /**
     *  Get all the tasks.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<Task> findAll(TaskCondition taskCondition, Pageable pageable) {
        log.debug("Request to get all Tasks by condition");

        QTask $task = QTask.task;

        BooleanBuilder predicate = new BooleanBuilder();

        if(StringUtils.hasText(taskCondition.getName()))
            predicate.and($task.name.contains(taskCondition.getName()));

        if(StringUtils.hasText(taskCondition.getDueDateFrom()))
            predicate.and($task.dueDate.goe(taskCondition.getDueDateFrom()));

        if(StringUtils.hasText(taskCondition.getDueDateTo()))
            predicate.and($task.dueDate.loe(taskCondition.getDueDateTo()));

        if(!taskCondition.getSeverities().isEmpty())
            predicate.and($task.severity.id.in(taskCondition.getSeverities()));

        if(StringUtils.hasText(taskCondition.getContents()))
            predicate.and($task.contents.contains(taskCondition.getContents()));

        if(!taskCondition.getAssignees().isEmpty())
            predicate.and($task.assignee.id.in(taskCondition.getAssignees()));

        Page<Task> result = taskRepository.findAll(predicate, pageable);

        return result;
    }

    /**
     *  Get one task by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Transactional(readOnly = true)
    public TaskDTO findOne(Long id) {
        log.debug("Request to get Task : {}", id);
        Task task = taskRepository.findOne(id);
        TaskDTO taskDTO = taskMapper.taskToTaskDTO(task);
        return taskDTO;
    }

    /**
     *  Delete the task by ids.
     *
     *  @param ids the id list of the entity
     */
    public void delete(List<Long> ids) {
        ids.stream().forEach(this::delete);
    }

    /**
     *  Delete the  task by id.
     *
     *  @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Task : {}", id);
        taskRepository.delete(id);
        taskSearchRepository.delete(id);
    }

    /**
     * Search for the task corresponding to the query.
     *
     *  @param query the query of the search
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<Task> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Tasks for query {}", query);
        return taskSearchRepository.search(queryStringQuery(query), pageable);
    }
}