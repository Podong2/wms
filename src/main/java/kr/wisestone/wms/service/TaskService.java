package kr.wisestone.wms.service;

import com.google.common.collect.Lists;
import com.mysema.query.BooleanBuilder;
import kr.wisestone.wms.common.exception.CommonRuntimeException;
import kr.wisestone.wms.common.util.DateUtil;
import kr.wisestone.wms.domain.*;
import kr.wisestone.wms.repository.TaskRepository;
import kr.wisestone.wms.repository.search.TaskSearchRepository;
import kr.wisestone.wms.security.SecurityUtils;
import kr.wisestone.wms.web.rest.condition.TaskCondition;
import kr.wisestone.wms.web.rest.dto.TaskDTO;
import kr.wisestone.wms.web.rest.form.TaskForm;
import kr.wisestone.wms.web.rest.mapper.TaskMapper;
import kr.wisestone.wms.web.rest.mapper.UserMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
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
    private NotificationService notificationService;

    @Inject
    private UserService userService;

    @Inject
    private AttachedFileService attachedFileService;

    @Inject
    private TaskMapper taskMapper;

    @Inject
    private UserMapper userMapper;

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

        TaskDTO result = taskMapper.taskToTaskDTO(task);

//        User user = userService.getUserWithAuthorities(task.getAssignee().getId());
//
//        notificationService.sendIssueCreatedNotification(result, Lists.newArrayList(user), "04");

        return result;
    }

    /**
     *  Get all the tasks.
     *
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<TaskDTO> findAll(TaskCondition taskCondition) {
        log.debug("Request to get all Tasks by condition");

        BooleanBuilder predicate = taskListPredicate(taskCondition);

        List<Task> result = Lists.newArrayList(taskRepository.findAll(predicate, QTask.task.endDate.asc()));

        List<TaskDTO> taskDTOs = Lists.newArrayList();

        taskDTOs.addAll(result.stream().map(this::convertTaskToDTO).collect(Collectors.toList()));

        return taskDTOs;
    }

    private TaskDTO convertTaskToDTO(Task task) {
        TaskDTO taskDTO = taskMapper.taskToTaskDTO(task);

        this.copyTaskRelationProperties(task, taskDTO);

        return taskDTO;
    }

    private void copyTaskRelationProperties(Task task, TaskDTO taskDTO) {
        if(task.getTaskUsers() != null && !task.getTaskUsers().isEmpty()) {
            taskDTO.setAssignees(userMapper.usersToUserDTOs(task.findTaskUsersByType(TaskUserType.ASSIGNEE)));
            taskDTO.setWatchers(userMapper.usersToUserDTOs(task.findTaskUsersByType(TaskUserType.WATCHER)));
        }

        if(task.getSubTasks() != null && !task.getSubTasks().isEmpty())
            taskDTO.setSubTasks(taskMapper.tasksToTaskDTOs(Lists.newArrayList(task.getSubTasks())));

        if(task.getRelatedTasks() != null && !task.getRelatedTasks().isEmpty())
            taskDTO.setRelatedTasks(taskMapper.tasksToTaskDTOs(task.getPlainRelatedTask()));

        if(task.getParent() != null)
            taskDTO.setParent(taskMapper.taskToTaskDTO(task.getParent()));
    }

    private BooleanBuilder taskListPredicate(TaskCondition taskCondition) {

        String login = SecurityUtils.getCurrentUserLogin();

        QTask $task = QTask.task;

        BooleanBuilder predicate = new BooleanBuilder();

        predicate.and($task.taskUsers.any().user.login.eq(login).or($task.createdBy.eq(login)));

        String today = DateUtil.getTodayWithYYYYMMDD();

        switch (taskCondition.getListType()) {
            case TaskCondition.LIST_TYPE_TODAY:

                predicate.and($task.endDate.loe(today).or($task.endDate.isNull()));
                predicate.and($task.status.isNull().or($task.status.id.eq(1L)));

                break;
            case TaskCondition.LIST_TYPE_SCHEDULED:

                predicate.and($task.startDate.gt(today));
                predicate.and($task.status.id.eq(1L));

                break;
            case TaskCondition.LIST_TYPE_HOLD:

                predicate.and($task.status.id.eq(3L));

                break;
            case TaskCondition.LIST_TYPE_COMPLETE:

                predicate.and($task.status.id.eq(2L));
                break;
        }

        return predicate;
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

        this.copyTaskRelationProperties(task, taskDTO);

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

//        User user = userService.getUserWithAuthorities(targetTask.getAssignee().getId());
//
//        notificationService.sendIssueRemovedNotification(taskMapper.taskToTaskDTO(targetTask), Lists.newArrayList(user), "04");

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

    public TaskDTO createByName(String name) {

        Task task = this.taskRepository.findByName(name);

        if(task != null) {
            throw new CommonRuntimeException("error.task.taskNameDuplicate");
        }

        task = this.taskRepository.save(new Task(name));

        return taskMapper.taskToTaskDTO(task);
    }

    public TaskDTO createSubTask(TaskForm taskForm) {

        Task subTask = taskForm.bindSubTask(new Task());

        subTask = taskRepository.save(subTask);

        TaskDTO result = taskMapper.taskToTaskDTO(subTask);

        return result;
    }

    public List<TaskDTO> findByNameLike(String name) {
        BooleanBuilder predicate = new BooleanBuilder();

        predicate.and(QTask.task.name.contains(name));

        List<Task> tasks = Lists.newArrayList(this.taskRepository.findAll(predicate));

        return taskMapper.tasksToTaskDTOs(tasks);
    }
}
