package kr.wisestone.wms.service;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.mysema.query.BooleanBuilder;
import com.mysema.query.jpa.JPASubQuery;
import com.mysema.query.types.OrderSpecifier;
import kr.wisestone.wms.common.exception.CommonRuntimeException;
import kr.wisestone.wms.common.util.DateUtil;
import kr.wisestone.wms.domain.*;
import kr.wisestone.wms.repository.CodeRepository;
import kr.wisestone.wms.repository.TaskRepository;
import kr.wisestone.wms.repository.dao.TaskDAO;
import kr.wisestone.wms.repository.search.TaskSearchRepository;
import kr.wisestone.wms.security.SecurityUtils;
import kr.wisestone.wms.web.rest.condition.ProjectTaskCondition;
import kr.wisestone.wms.web.rest.condition.TaskCondition;
import kr.wisestone.wms.web.rest.dto.*;
import kr.wisestone.wms.web.rest.form.TaskForm;
import kr.wisestone.wms.web.rest.mapper.TaskMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.inject.Inject;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

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
    private TraceLogService traceLogService;

    @Inject
    private CodeRepository codeRepository;

    @Inject
    private TaskDAO taskDAO;

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

//        List<Task> result = Lists.newArrayList(taskRepository.findAll(predicate, QTask.task.period.endDate.asc()));

        Map<String, Object> condition = Maps.newHashMap();
        condition.put("userId", loginUser.getLogin());
        condition.put("listType", taskCondition.getListType());
        condition.put("filterType", taskCondition.getFilterType());

        List<TaskDTO> taskDTOs = taskDAO.getTasks(condition);
//
//        for(Task task : result) {
//
//            TaskDTO taskDTO = new TaskDTO(task);
//
//            this.copyTaskRelationProperties(task, taskDTO);
//            this.determineStatusGroup(taskDTO, taskCondition.getListType(), loginUser.getLogin());
//
//            taskDTOs.add(taskDTO);
//        }

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

        User loginUser = SecurityUtils.getCurrentUser();

        Map<String, Object> condition = Maps.newHashMap();
        condition.put("userId", loginUser.getLogin());
        condition.put("listType", taskCondition.getListType());
        condition.put("filterType", taskCondition.getFilterType());

        TaskStatisticsDTO taskStatisticsDTO = taskDAO.getTaskCount(condition);

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

            statusGroup = "MY_TASK";

            if(taskDTO.getWatchers() != null && !taskDTO.getWatchers().isEmpty()) {

                Optional<UserDTO> watcher = taskDTO.getWatchers().stream().filter(userDTO -> userDTO.getLogin().equals(login)).findFirst();

                if(watcher.isPresent()) {
                    statusGroup = "WATCHED_TASK";
                }
            }

            if(taskDTO.getCreatedBy().equals(login)) {

                statusGroup = "REQUEST_TASK";

            }

            if(taskDTO.getAssignees() != null && !taskDTO.getAssignees().isEmpty()) {
                Optional<UserDTO> assignee = taskDTO.getAssignees().stream().filter(userDTO -> userDTO.getLogin().equals(login)).findFirst();

                if(assignee.isPresent()) {
                    statusGroup = "MY_TASK";
                }

            }
        }

        taskDTO.setStatusGroup(statusGroup);
    }

    public void copyTaskRelationProperties(Task task, TaskDTO taskDTO) {
        if(task.getTaskUsers() != null && !task.getTaskUsers().isEmpty()) {
            taskDTO.setAssignees(task.findTaskUsersByType(UserType.ASSIGNEE).stream().map(UserDTO::new).collect(Collectors.toList()));
            taskDTO.setWatchers(task.findTaskUsersByType(UserType.WATCHER).stream().map(UserDTO::new).collect(Collectors.toList()));
        }

        if(task.getSubTasks() != null && !task.getSubTasks().isEmpty())
            taskDTO.setSubTasks(task.getSubTasks().stream().map(TaskDTO::new).collect(Collectors.toList()));

        if(task.getRelatedTasks() != null && !task.getRelatedTasks().isEmpty())
            taskDTO.setRelatedTasks(task.getPlainRelatedTask().stream().map(TaskDTO::new).collect(Collectors.toList()));

        if(task.getParent() != null)
            taskDTO.setParent(new TaskDTO(task.getParent()));

        if(task.getTaskProjects() != null && !task.getTaskProjects().isEmpty()) {
            taskDTO.setTaskProjects(task.getPlainTaskProject().stream().map(ProjectDTO::new).collect(Collectors.toList()));
        }

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
            predicate.and($task.id.in(new JPASubQuery()
                .from(QTaskUser.taskUser)
                .where(QTaskUser.taskUser.user.login.eq(loginUser.getLogin()).and(QTaskUser.taskUser.userType.eq(UserType.ASSIGNEE)))
                .list(QTaskUser.taskUser.task.id)));
        } else if(taskCondition.getFilterType().equalsIgnoreCase(TaskCondition.FILTER_TYPE_WATCHED)) {
            predicate.and($task.id.in(new JPASubQuery()
                .from(QTaskUser.taskUser)
                .where(QTaskUser.taskUser.user.login.eq(loginUser.getLogin()).and(QTaskUser.taskUser.userType.eq(UserType.WATCHER)))
                .list(QTaskUser.taskUser.task.id)));
        } else if(taskCondition.getFilterType().equalsIgnoreCase(TaskCondition.FILTER_TYPE_REQUESTED)) {
            predicate.and($task.createdBy.eq(loginUser.getLogin()));
        }

        String today = DateUtil.getTodayWithYYYYMMDD();

        switch (taskCondition.getListType()) {
            case TaskCondition.LIST_TYPE_TODAY:

                predicate.and($task.period.startDate.loe(today).or($task.period.endDate.isNull()));
                predicate.and($task.status.isNull().or($task.status.id.eq(Task.STATUS_ACTIVE)));

                break;
            case TaskCondition.LIST_TYPE_SCHEDULED:

                predicate.and($task.period.startDate.gt(today));
                predicate.and($task.status.id.eq(Task.STATUS_ACTIVE));

                break;
            case TaskCondition.LIST_TYPE_HOLD:

                predicate.and($task.status.id.eq(Task.STATUS_HOLD));

                break;
            case TaskCondition.LIST_TYPE_COMPLETE:

                predicate.and($task.status.id.eq(Task.STATUS_COMPLETE));
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
        TaskDTO taskDTO = new TaskDTO(task);

        User user = userService.findByLogin(task.getCreatedBy());
        taskDTO.setCreatedByName(user.getName());

        this.copyTaskRelationProperties(task, taskDTO);

        if(!task.getTaskAttachedFiles().isEmpty()) {
            taskDTO.setAttachedFiles(task.getPlainTaskAttachedFiles().stream().map(AttachedFileDTO::new).collect(Collectors.toList()));
        }

        return taskDTO;
    }

    public Task findOne(Long id) {

        if(id == null)
            throw new CommonRuntimeException("error.task.targetIdIsNull");

        Task task = taskRepository.findOne(id);

        if(task == null)
            throw new CommonRuntimeException("error.task.notFound");

        return task;
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

        if(origin.getPrivateYn() != null && !origin.getPrivateYn().equals(taskForm.getPrivateYn())) {

            for(Task subTask : origin.getSubTasks()) {

                subTask.setPrivateYn(taskForm.getPrivateYn());

                taskRepository.save(subTask);
            }
        }

        origin = taskForm.bind(origin);

        if(taskForm.getStatusId() != null) {
            origin.setStatus(this.codeRepository.findOne(taskForm.getStatusId()));
        }

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
    public Task updateLastModifiedDate(Long taskId) {

        Task origin = taskRepository.findOne(taskId);

        origin.setLastModifiedDate(ZonedDateTime.now());

        return taskRepository.save(origin);
    }

    @Transactional
    public TaskDTO saveTask(TaskForm taskForm, List<TaskForm> subTasks, List<MultipartFile> files) {

        Task origin = taskForm.bind(new Task());

        if(taskForm.getStatusId() != null) {
            origin.setStatus(this.codeRepository.findOne(taskForm.getStatusId()));
        }

        for(MultipartFile multipartFile : files) {

            AttachedFile attachedFile = this.attachedFileService.saveFile(multipartFile);

            origin.addAttachedFile(attachedFile);
        }

        origin = taskRepository.save(origin);

        if(subTasks != null && !subTasks.isEmpty()) {

            for(TaskForm subTaskForm : subTasks) {
                Task subTask = subTaskForm.bindSubTask(origin);

                taskRepository.save(subTask);
            }
        }

        TaskDTO result = taskMapper.taskToTaskDTO(origin);

        List<User> notificationTargets = origin.getTaskUsers().stream().map(TaskUser::getUser).collect(Collectors.toList());

        notificationService.sendIssueCreatedNotification(this.findOneDTO(origin.getId()), notificationTargets, "04");

        return result;
    }

    @Transactional
    public TaskDTO createSubTask(TaskForm taskForm) {

        Task subTask = taskForm.bindSubTask(new Task());
        Task parentTask = taskRepository.findOne(taskForm.getParentId());
        parentTask.setLastModifiedDate(ZonedDateTime.now());

        subTask = taskRepository.save(subTask);
        taskRepository.save(parentTask);

        TaskDTO result = taskMapper.taskToTaskDTO(subTask);

        return result;
    }

    @Transactional(readOnly = true)
    public List<TaskDTO> findByNameLike(TaskCondition taskCondition, List<Long> excludeIds) {

        User loginUser = SecurityUtils.getCurrentUser();

        QTask $task = QTask.task;

        BooleanBuilder predicate = new BooleanBuilder();

        predicate.and($task.name.containsIgnoreCase(taskCondition.getName()));

        if(taskCondition.getProjectId() != null)
            predicate.and($task.taskProjects.any().project.id.eq(taskCondition.getProjectId()));

        if(StringUtils.hasText(taskCondition.getAssigneeName()) && !taskCondition.getAssigneeSelfYn()) {
            predicate.and($task.id.in(new JPASubQuery()
                .from(QTaskUser.taskUser)
                .where(QTaskUser.taskUser.user.name.containsIgnoreCase(taskCondition.getAssigneeName())
                    .and(QTaskUser.taskUser.userType.eq(UserType.ASSIGNEE)))
                .list(QTaskUser.taskUser.task.id)));

        } else if(taskCondition.getAssigneeSelfYn()) {
            predicate.and($task.id.in(new JPASubQuery()
                .from(QTaskUser.taskUser)
                .where(QTaskUser.taskUser.user.name.containsIgnoreCase(loginUser.getName())
                    .and(QTaskUser.taskUser.userType.eq(UserType.ASSIGNEE)))
                .list(QTaskUser.taskUser.task.id)));
        }

        if(taskCondition.getCreatedBySelfYn()) {
            predicate.and($task.createdBy.eq(loginUser.getLogin()));
        }

        predicate.and($task.privateYn.isFalse());

        if(excludeIds != null && !excludeIds.isEmpty()) {
            predicate.and($task.id.notIn(excludeIds));
        }

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

        } else if(projectTaskCondition.getListType().equalsIgnoreCase(ProjectTaskCondition.LIST_TYPE_DELAYED)) {

            String today = DateUtil.getTodayWithYYYYMMDD();

            predicate.and($task.period.endDate.isNotEmpty());
            predicate.and($task.period.endDate.lt(today));
            predicate.and($task.status.id.eq(Task.STATUS_ACTIVE));
        }

        List<OrderSpecifier> orderSpecifiers = Lists.newArrayList();

        if(StringUtils.isEmpty(projectTaskCondition.getOrderType())) {
            orderSpecifiers.add(QTask.task.period.endDate.asc());
        } else {
            if(ProjectTaskCondition.ORDER_TYPE_IMPORTANT.equalsIgnoreCase(projectTaskCondition.getOrderType())) {
                orderSpecifiers.add(QTask.task.importantYn.desc());
            } else if(ProjectTaskCondition.ORDER_TYPE_TASK_NAME.equalsIgnoreCase(projectTaskCondition.getOrderType())) {
                orderSpecifiers.add(QTask.task.name.asc());
            }
        }

        List<Task> tasks = Lists.newArrayList(taskRepository.findAll(predicate, orderSpecifiers.toArray(new OrderSpecifier[orderSpecifiers.size()])));

        for(Task task : tasks) {

            TaskDTO taskDTO = taskMapper.taskToTaskDTO(task);

            this.copyTaskRelationProperties(task, taskDTO);

            String statusGroup = "IN_PROGRESS";

            if(projectTaskCondition.getListType().equalsIgnoreCase(ProjectTaskCondition.LIST_TYPE_WEEK)
                || projectTaskCondition.getListType().equalsIgnoreCase(ProjectTaskCondition.LIST_TYPE_TOTAL)) {

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
            } else {
                String today = DateUtil.getTodayWithYYYYMMDD();

                if(DateUtil.convertStrToDate(taskDTO.getEndDate(), "yyyy-MM-dd").getTime() < DateUtil.convertStrToDate(today, "yyyy-MM-dd").getTime()) {
                    statusGroup = "DELAYED";
                }
            }

            if(taskDTO.getStatusId().equals(Task.STATUS_COMPLETE)) {
                statusGroup = "COMPLETE";
            } else if(taskDTO.getStatusId().equals(Task.STATUS_HOLD)) {
                statusGroup = "HOLD";
            } else if(taskDTO.getStatusId().equals(Task.STATUS_CANCEL)) {
                statusGroup = "CANCEL";
            }

            taskDTO.setStatusGroup(statusGroup);

            taskDTOs.add(taskDTO);
        }

        return taskDTOs;
    }

    @Transactional(readOnly = true)
    public List<TaskDTO> findHistoryTasksByProjectIds(List<Long> projectIds) {

        List<TaskDTO> taskDTOs = Lists.newArrayList();

        QTask $task = QTask.task;

        BooleanBuilder predicate = new BooleanBuilder();

        predicate.and($task.taskProjects.any().project.id.in(projectIds));

        List<OrderSpecifier> orderSpecifiers = Lists.newArrayList();

        orderSpecifiers.add(QTask.task.lastModifiedDate.desc());

        List<Task> tasks = Lists.newArrayList(taskRepository.findAll(predicate, orderSpecifiers.toArray(new OrderSpecifier[orderSpecifiers.size()])));

        for(Task task : tasks) {

            TaskDTO taskDTO = taskMapper.taskToTaskDTO(task);

            this.copyTaskRelationProperties(task, taskDTO);

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

    @Transactional(readOnly = true)
    public TaskProgressStatusDTO getTaskProgressStatus(Long id) {

        if(id == null)
            throw new CommonRuntimeException("error.task.targetIdIsNull");

        Task task = taskRepository.findOne(id);

        if(task == null)
            throw new CommonRuntimeException("error.task.notFound");

        TaskDTO taskDTO = this.taskMapper.taskToTaskDTO(task);
        this.copyTaskRelationProperties(task, taskDTO);

        List<TaskDTO> taskDTOs = Lists.newArrayList();
        taskDTOs.add(taskDTO);

        this.getSubTasksHierarchy(taskDTO, Lists.newArrayList(task.getSubTasks()), taskDTOs);

        Long completeCount = taskDTOs.stream().filter(subTask -> subTask.getStatusId().equals(Task.STATUS_COMPLETE)).count();

        return new TaskProgressStatusDTO(taskDTO, (long) taskDTOs.size(), completeCount);
    }

    private void getSubTasksHierarchy(TaskDTO taskDTO, List<Task> subTasks, List<TaskDTO> taskDTOs) {

        List<TaskDTO> subTaskDTOs = Lists.newArrayList();

        for(Task subTask : subTasks) {
            TaskDTO subTaskDTO = this.taskMapper.taskToTaskDTO(subTask);
            this.copyTaskRelationProperties(subTask, subTaskDTO);

            this.getSubTasksHierarchy(subTaskDTO, Lists.newArrayList(subTask.getSubTasks()), taskDTOs);

            subTaskDTOs.add(subTaskDTO);

            taskDTOs.add(subTaskDTO);
        }

        taskDTO.setSubTasks(subTaskDTOs);
    }

    @Transactional
    public TaskDTO modifySubTask(TaskForm taskForm) {

        Task origin = this.taskRepository.findOne(taskForm.getId());

        origin = taskForm.updateSubTask(origin);

        origin = taskRepository.save(origin);
//        taskSearchRepository.save(origin);
        TaskDTO result = taskMapper.taskToTaskDTO(origin);

        return result;
    }

    @Transactional
    public TaskDTO uploadFile(Long id, List<MultipartFile> files) {

        Task origin = taskRepository.findOne(id);

        for(MultipartFile multipartFile : files) {

            AttachedFile attachedFile = this.attachedFileService.saveFile(multipartFile);

            origin.addAttachedFile(attachedFile);
        }

        origin.setLastModifiedDate(ZonedDateTime.now());

        origin = taskRepository.save(origin);
        TaskDTO result = taskMapper.taskToTaskDTO(origin);

        if(!origin.getTaskAttachedFiles().isEmpty()) {
            result.setAttachedFiles(origin.getPlainTaskAttachedFiles().stream().map(AttachedFileDTO::new).collect(Collectors.toList()));
        }

        return result;
    }

    @Transactional
    public TaskDTO removeFile(Long taskId, Long attachedFileId) {

        Task origin = taskRepository.findOne(taskId);

        origin.removeAttachedFile(attachedFileId);
        origin.setLastModifiedDate(ZonedDateTime.now());

        origin = taskRepository.save(origin);
        TaskDTO result = taskMapper.taskToTaskDTO(origin);

        if(!origin.getTaskAttachedFiles().isEmpty()) {
            result.setAttachedFiles(origin.getPlainTaskAttachedFiles().stream().map(AttachedFileDTO::new).collect(Collectors.toList()));
        }

        return result;
    }

    @Transactional(readOnly = true)
    public List<TaskDTO> findRelatedTask(Long taskId, String relatedType) {

        Task task = taskRepository.findOne(taskId);

        List<TaskDTO> relatedTasks = Lists.newArrayList();

        if(relatedType.equalsIgnoreCase("SUB_TASK") && (task.getSubTasks() != null && !task.getSubTasks().isEmpty())) {
            relatedTasks = task.getSubTasks().stream().map(TaskDTO::new).collect(Collectors.toList());
        } else if(relatedType.equalsIgnoreCase("RELATED_TASK") && (task.getRelatedTasks() != null && !task.getRelatedTasks().isEmpty())) {
            relatedTasks = task.getSubTasks().stream().map(TaskDTO::new).collect(Collectors.toList());
        }

        return relatedTasks;
    }
}
