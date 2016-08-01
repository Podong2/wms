package kr.wisestone.wms.service;

import com.google.common.collect.Lists;
import com.mysema.query.BooleanBuilder;
import kr.wisestone.wms.common.exception.CommonRuntimeException;
import kr.wisestone.wms.domain.*;
import kr.wisestone.wms.repository.TaskRepository;
import kr.wisestone.wms.repository.search.TaskSearchRepository;
import kr.wisestone.wms.web.rest.condition.TaskCondition;
import kr.wisestone.wms.web.rest.dto.TaskDTO;
import kr.wisestone.wms.web.rest.form.TaskForm;
import kr.wisestone.wms.web.rest.mapper.TaskMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

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
    private TaskSearchRepository taskSearchRepository;

    @Inject
    private TaskMapper taskMapper;

    @Inject
    private NotificationService notificationService;

    @Inject
    private UserService userService;

    @Inject
    private  AttachedFileService attachedFileService;

    /**
     * Save a task.
     *
     * @param taskForm the entity to save
     * @param files
     * @return the persisted entity
     */
    @Transactional
    public TaskDTO save(TaskForm taskForm, List<MultipartFile> files) {
        log.debug("Request to save Task : {}", taskForm);

        Task task = taskForm.bind(new Task());

        for(MultipartFile multipartFile : files) {

            AttachedFile attachedFile = this.attachedFileService.saveFile(multipartFile);

            task.addAttachedFile(attachedFile);
        }

        task = taskRepository.save(task);
//        taskSearchRepository.save(task);

        TaskDTO result = taskMapper.taskToTaskDTO(task);

        User user = userService.getUserWithAuthorities(task.getAssignee().getId());

        notificationService.sendIssueCreatedNotification(result, Lists.newArrayList(user), "04");

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

        if(StringUtils.hasText(taskCondition.getEndDateFrom()))
            predicate.and($task.endDate.goe(taskCondition.getEndDateFrom()));

        if(StringUtils.hasText(taskCondition.getEndDateTo()))
            predicate.and($task.endDate.loe(taskCondition.getEndDateTo()));

        if(!taskCondition.getSeverities().isEmpty())
            predicate.and($task.status.id.in(taskCondition.getSeverities()));

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

        if(!task.getTaskAttachedFiles().isEmpty()) {
            taskDTO.setAttachedFiles(Lists.newArrayList(task.getTaskAttachedFiles()));
        }

        return taskDTO;
    }

    /**
     *  Delete the task by ids.
     *
     *  @param ids the id list of the entity
     */
    @Transactional
    public void delete(List<Long> ids) {

        if(ids == null || ids.isEmpty())
            throw new CommonRuntimeException("error.task.targetIdIsNull");

        ids.stream().forEach(this::delete);
    }

    /**
     *  Delete the  task by id.
     *
     *  @param id the id of the entity
     */
    @Transactional
    public void delete(Long id) {

        if(id == null)
            throw new CommonRuntimeException("error.task.targetIdIsNull");

        log.debug("Request to delete Task : {}", id);

        Task targetTask = taskRepository.findOne(id);

        User user = userService.getUserWithAuthorities(targetTask.getAssignee().getId());

        notificationService.sendIssueRemovedNotification(taskMapper.taskToTaskDTO(targetTask), Lists.newArrayList(user), "04");

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

    @Transactional
    public TaskDTO update(TaskForm taskForm, List<MultipartFile> files) {

        Task origin = taskRepository.findOne(taskForm.getId());

        origin = taskForm.bind(origin);

        for(MultipartFile multipartFile : files) {

            AttachedFile attachedFile = this.attachedFileService.saveFile(multipartFile);

            origin.addAttachedFile(attachedFile);
        }

        if(!taskForm.getRemoveTargetFiles().isEmpty()) {

            for(Long targetFileId : taskForm.getRemoveTargetFiles()) {

                origin.removeAttachedFile(targetFileId);
            }
        }

        origin = taskRepository.save(origin);
//        taskSearchRepository.save(origin);
        TaskDTO result = taskMapper.taskToTaskDTO(origin);

        return result;
    }
}
