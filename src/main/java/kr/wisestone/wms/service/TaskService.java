package kr.wisestone.wms.service;

import com.google.common.collect.Lists;
import com.mysema.query.BooleanBuilder;
import kr.wisestone.wms.common.exception.CommonRuntimeException;
import kr.wisestone.wms.common.util.DateUtil;
import kr.wisestone.wms.domain.*;
import kr.wisestone.wms.repository.TaskRepository;
import kr.wisestone.wms.repository.search.TaskSearchRepository;
import kr.wisestone.wms.security.SecurityUtils;
import kr.wisestone.wms.web.rest.condition.ProjectTaskCondition;
import kr.wisestone.wms.web.rest.condition.TaskCondition;
import kr.wisestone.wms.web.rest.dto.TaskDTO;
import kr.wisestone.wms.web.rest.dto.UserDTO;
import kr.wisestone.wms.web.rest.form.TaskForm;
import kr.wisestone.wms.web.rest.mapper.ProjectMapper;
import kr.wisestone.wms.web.rest.mapper.TaskMapper;
import kr.wisestone.wms.web.rest.mapper.UserMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.inject.Inject;
import java.util.Date;
import java.util.List;
import java.util.Optional;

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

    @Inject
    private ProjectMapper projectMapper;

    /**
     *  Get all the tasks.
     *
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<TaskDTO> findAll(TaskCondition taskCondition) {
        log.debug("Request to get all Tasks by condition");

        String login = SecurityUtils.getCurrentUserLogin();

        BooleanBuilder predicate = taskListPredicate(taskCondition);

        List<Task> result = Lists.newArrayList(taskRepository.findAll(predicate, QTask.task.endDate.asc()));

        List<TaskDTO> taskDTOs = Lists.newArrayList();

        for(Task task : result) {

            TaskDTO taskDTO = taskMapper.taskToTaskDTO(task);

            this.copyTaskRelationProperties(task, taskDTO);
            this.determineStatusGroup(taskDTO, taskCondition.getListType(), login);

            taskDTOs.add(taskDTO);
        }

        return taskDTOs;
    }


    private void determineStatusGroup(TaskDTO taskDTO, String listType, String login) {

        String statusGroup = "";

        if(listType.equals(TaskCondition.LIST_TYPE_TODAY)) {

            statusGroup = "IN_PROGRESS";

            if(StringUtils.isEmpty(taskDTO.getEndDate())) {
                statusGroup = "NONE_SCHEDULED";
            } else {
                String today = DateUtil.getTodayWithYYYYMMDD();
                String createdDate = DateUtil.convertDateToYYYYMMDD(Date.from(taskDTO.getCreatedDate().toInstant()));

                if(taskDTO.getEndDate().equals(today)) {
                    statusGroup = "SCHEDULED_TODAY";
                } else if(DateUtil.convertStrToDate(taskDTO.getEndDate(), "yyyy-MM-dd").getTime() < DateUtil.convertStrToDate(today, "yyyy-MM-dd").getTime()) {
                    statusGroup = "DELAYED";
                }

                if(createdDate.equals(today)) {
                    statusGroup = "REGISTERED_TODAY";
                }
            }

        } else if(listType.equals(TaskCondition.LIST_TYPE_SCHEDULED) || listType.equals(TaskCondition.LIST_TYPE_HOLD) || listType.equals(TaskCondition.LIST_TYPE_COMPLETE)) {

            if(taskDTO.getAssignees() != null) {
                Optional<UserDTO> assignee = taskDTO.getAssignees().stream().filter(userDTO -> userDTO.getLogin().equals(login)).findFirst();

                if(assignee.isPresent()) {
                    statusGroup = "MY_TASK";
                }

            } else if(taskDTO.getCreatedBy().equals(login)) {

                statusGroup = "REQUEST_TASK";

            } else if(taskDTO.getWatchers() != null) {

                Optional<UserDTO> watcher = taskDTO.getWatchers().stream().filter(userDTO -> userDTO.getLogin().equals(login)).findFirst();

                if(watcher.isPresent()) {
                    statusGroup = "WATCHED_TASK";
                }
            }
        }

        taskDTO.setStatusGroup(statusGroup);
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

        if(task.getTaskProjects() != null && !task.getTaskProjects().isEmpty())
            taskDTO.setTaskProjects(projectMapper.projectsToProjectDTOs(task.getPlainTaskProject()));
    }

    private BooleanBuilder taskListPredicate(TaskCondition taskCondition) {

        String login = SecurityUtils.getCurrentUserLogin();

        QTask $task = QTask.task;

        BooleanBuilder predicate = new BooleanBuilder();

        predicate.and($task.taskUsers.any().user.login.eq(login).or($task.createdBy.eq(login)));

        String today = DateUtil.getTodayWithYYYYMMDD();

        switch (taskCondition.getListType()) {
            case TaskCondition.LIST_TYPE_TODAY:

                predicate.and($task.startDate.lt(today).or($task.endDate.isNull()));
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

    public List<TaskDTO> findAllTaskByProjectHierarchy(Project project, String listType) {

        List<TaskDTO> taskDTOs = Lists.newArrayList();

        taskDTOs.addAll(this.findDTOByProject(project, listType));

        this.crawlingTasksByProject(project, listType, taskDTOs);

        for(TaskDTO taskDTO : taskDTOs) {

            String statusGroup = "SCHEDULED";

            if(listType.equals(ProjectTaskCondition.LIST_TYPE_WEEK) || listType.equals(ProjectTaskCondition.LIST_TYPE_TOTAL)) {

                if(!StringUtils.isEmpty(taskDTO.getEndDate())) {

                    String today = DateUtil.getTodayWithYYYYMMDD();

                    if(taskDTO.getEndDate().equals(today)) {
                        statusGroup = "SCHEDULED_TODAY";
                    } else if(DateUtil.convertStrToDate(taskDTO.getEndDate(), "yyyy-MM-dd").getTime() < DateUtil.convertStrToDate(today, "yyyy-MM-dd").getTime()) {
                        statusGroup = "DELAYED";
                    }
                }
            }

            taskDTO.setStatusGroup(statusGroup);
        }

        return taskDTOs;
    }

    private void crawlingTasksByProject(Project project, String listType, List<TaskDTO> tasks) {
        for(ProjectRelation projectRelation : project.getProjectChilds()) {

            tasks.addAll(this.findDTOByProject(projectRelation.getChild(), listType));

            this.crawlingTasksByProject(projectRelation.getChild(), listType, tasks);
        }
    }

    public List<Task> findByProject(Project project, String listType) {

        QTask $task = QTask.task;

        BooleanBuilder predicate = new BooleanBuilder();

        predicate.and($task.taskProjects.any().project.id.eq(project.getId()));

        if(listType.equals(ProjectTaskCondition.LIST_TYPE_WEEK)) {

            Date weekStartDate = DateUtil.getWeekStartDate();
            Date weekEndDate = DateUtil.getWeekEndDate();

            predicate.and($task.endDate.goe(DateUtil.convertDateToYYYYMMDD(weekStartDate)));
            predicate.and($task.endDate.loe(DateUtil.convertDateToYYYYMMDD(weekEndDate)));

        } else if(listType.equals(ProjectTaskCondition.LIST_TYPE_WEEK)) {

            String today = DateUtil.getTodayWithYYYYMMDD();

            predicate.and($task.endDate.gt(today));
        }

        List<Task> tasks = Lists.newArrayList(taskRepository.findAll(predicate));

        return tasks;
    }

    public List<TaskDTO> findDTOByProject(Project project, String listType) {

        List<Task> tasks = this.findByProject(project, listType);

        List<TaskDTO> taskDTOs = Lists.newArrayList();

        for(Task task : tasks) {

            TaskDTO taskDTO = taskMapper.taskToTaskDTO(task);

            this.copyTaskRelationProperties(task, taskDTO);

            taskDTOs.add(taskDTO);
        }

        return taskDTOs;
    }
}
