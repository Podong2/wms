package kr.wisestone.wms.service;

import com.google.common.collect.Lists;
import com.mysema.query.BooleanBuilder;
import com.mysema.query.types.OrderSpecifier;
import kr.wisestone.wms.common.exception.CommonRuntimeException;
import kr.wisestone.wms.common.util.DateUtil;
import kr.wisestone.wms.domain.*;
import kr.wisestone.wms.repository.TaskRepository;
import kr.wisestone.wms.repository.search.TaskSearchRepository;
import kr.wisestone.wms.security.SecurityUtils;
import kr.wisestone.wms.web.rest.condition.ProjectTaskCondition;
import kr.wisestone.wms.web.rest.condition.TaskCondition;
import kr.wisestone.wms.web.rest.dto.TaskDTO;
import kr.wisestone.wms.web.rest.dto.TaskRepeatScheduleDTO;
import kr.wisestone.wms.web.rest.dto.TaskStatisticsDTO;
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
import java.util.Set;
import java.util.stream.Collectors;

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

    @Inject
    private TraceLogService traceLogService;


    /**
     *  Get all the tasks.
     *
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<TaskDTO> findAll(TaskCondition taskCondition) {
        log.debug("Request to get all Tasks by condition");

        User loginUser = SecurityUtils.getCurrentUser();

        BooleanBuilder predicate = taskListPredicate(taskCondition);

        List<Task> result = Lists.newArrayList(taskRepository.findAll(predicate, QTask.task.period.endDate.asc()));

        List<TaskDTO> taskDTOs = Lists.newArrayList();

        for(Task task : result) {

            TaskDTO taskDTO = taskMapper.taskToTaskDTO(task);

            this.copyTaskRelationProperties(task, taskDTO);
            this.determineStatusGroup(taskDTO, taskCondition.getListType(), loginUser.getLogin());

            taskDTOs.add(taskDTO);
        }

        return taskDTOs;
    }

    /**
     *  Get all the tasks.
     *
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Long getTodayTaskCount(TaskCondition taskCondition) {

        BooleanBuilder predicate = taskListPredicate(taskCondition);

        return taskRepository.count(predicate);
    }

    /**
     *  Get all the tasks.
     *
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public TaskStatisticsDTO getMyTaskStatistics(TaskCondition taskCondition) {

        TaskStatisticsDTO taskStatisticsDTO = new TaskStatisticsDTO();

        Long totalCount = taskRepository.count(taskListPredicate(taskCondition));

        taskCondition.setFilterType(TaskCondition.FILTER_TYPE_ASSIGNED);
        Long assignedCount = taskRepository.count(taskListPredicate(taskCondition));

        taskCondition.setFilterType(TaskCondition.FILTER_TYPE_WATCHED);
        Long watchedCount = taskRepository.count(taskListPredicate(taskCondition));

        taskCondition.setFilterType(TaskCondition.FILTER_TYPE_REQUESTED);
        Long createdCount = taskRepository.count(taskListPredicate(taskCondition));

        taskStatisticsDTO.setTotalCount(totalCount);
        taskStatisticsDTO.setAssignedCount(assignedCount);
        taskStatisticsDTO.setWatchedCount(watchedCount);
        taskStatisticsDTO.setCreatedCount(createdCount);

        return taskStatisticsDTO;
    }


    private void determineStatusGroup(TaskDTO taskDTO, String listType, String login) {

        String statusGroup = "";

        if(listType.equalsIgnoreCase(TaskCondition.LIST_TYPE_TODAY)) {

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

        } else if(listType.equalsIgnoreCase(TaskCondition.LIST_TYPE_SCHEDULED) || listType.equalsIgnoreCase(TaskCondition.LIST_TYPE_HOLD) || listType.equalsIgnoreCase(TaskCondition.LIST_TYPE_COMPLETE)) {

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

    public void copyTaskRelationProperties(Task task, TaskDTO taskDTO) {
        if(task.getTaskUsers() != null && !task.getTaskUsers().isEmpty()) {
            taskDTO.setAssignees(userMapper.usersToUserDTOs(task.findTaskUsersByType(UserType.ASSIGNEE)));
            taskDTO.setWatchers(userMapper.usersToUserDTOs(task.findTaskUsersByType(UserType.WATCHER)));
        }

        if(task.getSubTasks() != null && !task.getSubTasks().isEmpty())
            taskDTO.setSubTasks(taskMapper.tasksToTaskDTOs(Lists.newArrayList(task.getSubTasks())));

        if(task.getRelatedTasks() != null && !task.getRelatedTasks().isEmpty())
            taskDTO.setRelatedTasks(taskMapper.tasksToTaskDTOs(task.getPlainRelatedTask()));

        if(task.getParent() != null)
            taskDTO.setParent(taskMapper.taskToTaskDTO(task.getParent()));

        if(task.getTaskProjects() != null && !task.getTaskProjects().isEmpty())
            taskDTO.setTaskProjects(projectMapper.projectsToProjectDTOs(task.getPlainTaskProject()));

        if(task.getTaskRepeatSchedule() != null)
            taskDTO.setTaskRepeatSchedule(new TaskRepeatScheduleDTO(task.getTaskRepeatSchedule()));
    }

    private BooleanBuilder taskListPredicate(TaskCondition taskCondition) {

        User loginUser = SecurityUtils.getCurrentUser();

        QTask $task = QTask.task;

        BooleanBuilder predicate = new BooleanBuilder();

        if(taskCondition.getFilterType().equalsIgnoreCase(TaskCondition.FILTER_TYPE_ALL)) {
            predicate.and($task.taskUsers.any().user.login.eq(loginUser.getLogin()).or($task.createdBy.eq(loginUser.getLogin())));
        } else if(taskCondition.getFilterType().equalsIgnoreCase(TaskCondition.FILTER_TYPE_ASSIGNED)) {
            predicate.and($task.taskUsers.any().user.login.eq(loginUser.getLogin()).and($task.taskUsers.any().userType.eq(UserType.ASSIGNEE)));
        } else if(taskCondition.getFilterType().equalsIgnoreCase(TaskCondition.FILTER_TYPE_WATCHED)) {
            predicate.and($task.taskUsers.any().user.login.eq(loginUser.getLogin()).and($task.taskUsers.any().userType.eq(UserType.WATCHER)));
        } else if(taskCondition.getFilterType().equalsIgnoreCase(TaskCondition.FILTER_TYPE_REQUESTED)) {
            predicate.and($task.createdBy.eq(loginUser.getLogin()));
        }

        String today = DateUtil.getTodayWithYYYYMMDD();

        switch (taskCondition.getListType()) {
            case TaskCondition.LIST_TYPE_TODAY:

                predicate.and($task.period.startDate.lt(today).or($task.period.endDate.isNull()));
                predicate.and($task.status.isNull().or($task.status.id.eq(1L)));

                break;
            case TaskCondition.LIST_TYPE_SCHEDULED:

                predicate.and($task.period.startDate.gt(today));
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
    public TaskDTO findOneDTO(Long id) {
        log.debug("Request to get Task : {}", id);
        Task task = taskRepository.findOne(id);
        TaskDTO taskDTO = taskMapper.taskToTaskDTO(task);

        this.copyTaskRelationProperties(task, taskDTO);

        if(!task.getTaskAttachedFiles().isEmpty()) {
            taskDTO.setAttachedFiles(Lists.newArrayList(task.getTaskAttachedFiles()));
        }

        return taskDTO;
    }

    public Task findOne(Long id) {
        return taskRepository.findOne(id);
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

    @Transactional
    public TaskDTO create(TaskForm taskForm) {

        Task task = this.taskRepository.findByName(taskForm.getName());

        if(task != null) {
            throw new CommonRuntimeException("error.task.taskNameDuplicate");
        }

        task = taskForm.bind(new Task());

        task = this.taskRepository.save(task);

        return taskMapper.taskToTaskDTO(task);
    }

    @Transactional
    public TaskDTO saveTask(TaskForm taskForm, List<MultipartFile> files) {

        Task origin = taskRepository.findOne(taskForm.getId());

        origin = taskForm.bind(origin);

        for(MultipartFile multipartFile : files) {

            AttachedFile attachedFile = this.attachedFileService.saveFile(multipartFile);

            origin.addAttachedFile(attachedFile);
        }

        origin = taskRepository.save(origin);
//        taskSearchRepository.save(origin);
        TaskDTO result = taskMapper.taskToTaskDTO(origin);

        List<User> notificationTargets = origin.getTaskUsers().stream().map(TaskUser::getUser).collect(Collectors.toList());

        notificationService.sendIssueCreatedNotification(this.findOneDTO(taskForm.getId()), notificationTargets, "04");

        return result;
    }

    @Transactional
    public TaskDTO createSubTask(TaskForm taskForm) {

        Task subTask = taskForm.bindSubTask(new Task());

        subTask = taskRepository.save(subTask);

        TaskDTO result = taskMapper.taskToTaskDTO(subTask);

        return result;
    }

    @Transactional(readOnly = true)
    public List<TaskDTO> findByNameLike(String name) {
        BooleanBuilder predicate = new BooleanBuilder();

        predicate.and(QTask.task.name.contains(name));

        List<Task> tasks = Lists.newArrayList(this.taskRepository.findAll(predicate));

        return taskMapper.tasksToTaskDTOs(tasks);
    }

    @Transactional(readOnly = true)
    public List<TaskDTO> findTasksByProjectIdsAndCondition(List<Long> projectIds, ProjectTaskCondition projectTaskCondition) {

        List<TaskDTO> taskDTOs = Lists.newArrayList();

        QTask $task = QTask.task;

        BooleanBuilder predicate = new BooleanBuilder();

        predicate.and($task.taskProjects.any().project.id.in(projectIds));

        if(projectTaskCondition.getStatusId() != null)
            predicate.and($task.status.id.eq(projectTaskCondition.getStatusId()));

        if(projectTaskCondition.getListType().equalsIgnoreCase(ProjectTaskCondition.LIST_TYPE_WEEK)) {

            Date weekStartDate = DateUtil.getWeekStartDate();
            Date weekEndDate = DateUtil.getWeekEndDate();

            predicate.and($task.period.endDate.goe(DateUtil.convertDateToYYYYMMDD(weekStartDate)));
            predicate.and($task.period.endDate.loe(DateUtil.convertDateToYYYYMMDD(weekEndDate)));

        } else if(projectTaskCondition.getListType().equalsIgnoreCase(ProjectTaskCondition.LIST_TYPE_WEEK)) {

            String today = DateUtil.getTodayWithYYYYMMDD();

            predicate.and($task.period.endDate.gt(today));
        }

        List<Task> tasks = Lists.newArrayList(taskRepository.findAll(predicate));

        for(Task task : tasks) {

            TaskDTO taskDTO = taskMapper.taskToTaskDTO(task);

            this.copyTaskRelationProperties(task, taskDTO);

            String statusGroup = "SCHEDULED";

            if(projectTaskCondition.getListType().equalsIgnoreCase(ProjectTaskCondition.LIST_TYPE_WEEK)
                || projectTaskCondition.getListType().equalsIgnoreCase(ProjectTaskCondition.LIST_TYPE_TOTAL)) {

                if(taskDTO.getStatusId().equals(Task.STATUS_COMPLETE)) {

                    statusGroup = "COMPLETE";

                } else if(taskDTO.getStatusId().equals(Task.STATUS_HOLD)) {

                    statusGroup = "HOLD";

                } else if(!StringUtils.isEmpty(taskDTO.getEndDate())) {

                    String today = DateUtil.getTodayWithYYYYMMDD();

                    if(taskDTO.getEndDate().equals(today)) {
                        statusGroup = "SCHEDULED_TODAY";
                    } else if(DateUtil.convertStrToDate(taskDTO.getEndDate(), "yyyy-MM-dd").getTime() < DateUtil.convertStrToDate(today, "yyyy-MM-dd").getTime()) {
                        statusGroup = "DELAYED";
                    }
                }
            }

            taskDTO.setStatusGroup(statusGroup);

            taskDTOs.add(taskDTO);
        }

        return taskDTOs;
    }

    @Transactional(readOnly = true)
    public List<TaskDTO> findTasksByProjectIds(List<Long> projectIds) {

        QTask $task = QTask.task;

        BooleanBuilder predicate = new BooleanBuilder();

        predicate.and($task.taskProjects.any().project.id.in(projectIds));

        List<Task> tasks = Lists.newArrayList(taskRepository.findAll(predicate));

        List<TaskDTO> taskDTOs = taskMapper.tasksToTaskDTOs(tasks);

        return taskDTOs;
    }

    @Transactional(readOnly = true)
    private void crawlingTasksByProject(Project project, String listType, List<TaskDTO> tasks) {
        for(ProjectRelation projectRelation : project.getProjectChilds()) {

            tasks.addAll(this.findDTOByProject(projectRelation.getChild(), listType));

            this.crawlingTasksByProject(projectRelation.getChild(), listType, tasks);
        }
    }

    @Transactional(readOnly = true)
    public List<Task> findByProject(Project project, String listType) {

        QTask $task = QTask.task;

        BooleanBuilder predicate = new BooleanBuilder();

        predicate.and($task.taskProjects.any().project.id.eq(project.getId()));

        if(listType.equalsIgnoreCase(ProjectTaskCondition.LIST_TYPE_WEEK)) {

            Date weekStartDate = DateUtil.getWeekStartDate();
            Date weekEndDate = DateUtil.getWeekEndDate();

            predicate.and($task.period.endDate.goe(DateUtil.convertDateToYYYYMMDD(weekStartDate)));
            predicate.and($task.period.endDate.loe(DateUtil.convertDateToYYYYMMDD(weekEndDate)));

        } else if(listType.equalsIgnoreCase(ProjectTaskCondition.LIST_TYPE_WEEK)) {

            String today = DateUtil.getTodayWithYYYYMMDD();

            predicate.and($task.period.endDate.gt(today));
        }

        List<Task> tasks = Lists.newArrayList(taskRepository.findAll(predicate));

        return tasks;
    }

    @Transactional(readOnly = true)
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

    @Transactional
    public TaskDTO revertTaskContents(Long id, Long traceLogId) {

        if(id == null)
            throw new CommonRuntimeException("error.task.targetIdIsNull");

        Task task = taskRepository.findOne(id);

        if(task == null)
            throw new CommonRuntimeException("error.task.notFound");

        TraceLog traceLog = traceLogService.findOne(traceLogId);

        task.setContents(traceLog.getNewValue());

        task = taskRepository.save(task);

        return taskMapper.taskToTaskDTO(task);
    }

    @Transactional
    public Task save(Task task) {
        return taskRepository.save(task);
    }
}
