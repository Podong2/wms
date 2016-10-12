package kr.wisestone.wms.service;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import kr.wisestone.wms.common.exception.CommonRuntimeException;
import kr.wisestone.wms.common.util.WebAppUtil;
import kr.wisestone.wms.domain.*;
import kr.wisestone.wms.repository.CodeRepository;
import kr.wisestone.wms.repository.TaskRepository;
import kr.wisestone.wms.repository.dao.TaskDAO;
import kr.wisestone.wms.repository.search.TaskSearchRepository;
import kr.wisestone.wms.security.SecurityUtils;
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
import java.util.List;
import java.util.Map;
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
    public List<TaskDTO> findAll(TaskCondition taskCondition, Pageable pageable) {
        log.debug("Request to get all Tasks by condition");

        User loginUser = SecurityUtils.getCurrentUser();

        Map<String, Object> condition = Maps.newHashMap(ImmutableMap.<String, Object>builder().
            put("userId", loginUser.getLogin()).
            put("listType", taskCondition.getListType()).
            put("filterType", taskCondition.getFilterType()).
            put("offset", pageable.getOffset()).
            put("limit", pageable.getPageSize()).
        build());

        List<TaskDTO> taskDTOs = taskDAO.getMyTasks(condition);

        return taskDTOs;
    }

    /**
     *  Get all the tasks.
     *
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Long getTodayTaskCount(TaskCondition taskCondition) {

        User loginUser = SecurityUtils.getCurrentUser();


        Map<String, Object> condition = Maps.newHashMap(ImmutableMap.<String, Object>builder().
            put("userId", loginUser.getLogin()).
            put("listType", taskCondition.getListType()).
            put("filterType", taskCondition.getFilterType()).
        build());

        TaskStatisticsDTO taskStatisticsDTO = taskDAO.getTaskCount(condition);

        return taskStatisticsDTO.getTotalCount();
    }

    /**
     *  Get all the tasks.
     *
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public TaskStatisticsDTO getMyTaskStatistics(TaskCondition taskCondition) {

        User loginUser = SecurityUtils.getCurrentUser();

        Map<String, Object> condition = Maps.newHashMap(ImmutableMap.<String, Object>builder().
            put("userId", loginUser.getLogin()).
            put("listType", taskCondition.getListType()).
            put("filterType", taskCondition.getFilterType()).
        build());

        TaskStatisticsDTO taskStatisticsDTO = taskDAO.getTaskCount(condition);

        return taskStatisticsDTO;
    }


    public void copyTaskRelationProperties(Task task, TaskDTO taskDTO) {
        if(task.getTaskUsers() != null && !task.getTaskUsers().isEmpty()) {
            taskDTO.setAssignees(task.findTaskUsersByType(UserType.ASSIGNEE).stream().map(UserDTO::new).collect(Collectors.toList()));
            taskDTO.setWatchers(task.findTaskUsersByType(UserType.SHARER).stream().map(UserDTO::new).collect(Collectors.toList()));
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

    /**
     *  Get one task by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Transactional(readOnly = true)
    public TaskDTO findOneDTO(Long id) {
        log.debug("Request to get Task : {}", id);

        User loginUser = SecurityUtils.getCurrentUser();

        TaskDTO taskDTO = taskDAO.getTask(id);

        this.bindModifyPermission(loginUser, taskDTO);

        return taskDTO;
    }

    private void bindModifyPermission(User loginUser, TaskDTO taskDTO) {
        if(taskDTO.getCreatedBy().equals(loginUser.getLogin())) {
            taskDTO.setModifyYn(Boolean.TRUE);
        }

        for(UserDTO assignee : taskDTO.getAssignees()) {
            if(assignee.getLogin().equals(loginUser.getLogin())) {
                taskDTO.setModifyYn(Boolean.TRUE);
            }
        }

        for(TaskDTO subTask : taskDTO.getSubTasks()) {

            if(subTask.getCreatedBy().equals(loginUser.getLogin())) {
                subTask.setModifyYn(Boolean.TRUE);
            }

            for(UserDTO assignee : subTask.getAssignees()) {
                if(assignee.getLogin().equals(loginUser.getLogin())) {
                    subTask.setModifyYn(Boolean.TRUE);
                }
            }
        }
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
    public TaskDTO saveTask(TaskForm taskForm, List<TaskForm> subTasks, List<MultipartFile> files) {

        Task origin = taskForm.bind(new Task());

        if(taskForm.getStatusId() != null) {
            origin.setStatus(this.codeRepository.findOne(taskForm.getStatusId()));
        }

        if(files != null && !files.isEmpty()) {

            for(MultipartFile multipartFile : files) {

                AttachedFile attachedFile = this.attachedFileService.saveFile(multipartFile);

                origin.addAttachedFile(attachedFile);
            }
        }

        origin = taskRepository.save(origin);

        if(subTasks != null && !subTasks.isEmpty()) {

            for(TaskForm subTaskForm : subTasks) {
                Task subTask = subTaskForm.bindSubTask(origin);

                taskRepository.save(subTask);
            }
        }

        TaskDTO result = taskMapper.taskToTaskDTO(origin);

        this.copyTaskRelationProperties(origin, result);

        List<User> notificationTargets = origin.getTaskUsers().stream().map(TaskUser::getUser).collect(Collectors.toList());

        notificationService.sendIssueCreatedNotification(result, notificationTargets, "04");

        return result;
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

        Task savedTask = taskRepository.save(origin);

        TaskDTO result = new TaskDTO(savedTask);

        this.copyTaskRelationProperties(savedTask, result);

        return result;
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

    @Transactional
    public Task updateLastModifiedDate(Long taskId) {

        Task origin = taskRepository.findOne(taskId);

        origin.setLastModifiedDate(ZonedDateTime.now());

        return taskRepository.save(origin);
    }

    @Transactional
    public TaskDTO createSubTask(TaskForm taskForm) {

        Task parentTask = taskRepository.findOne(taskForm.getParentId());

        Task subTask = taskForm.bindSubTask(parentTask);

        subTask = taskRepository.save(subTask);

        parentTask.setLastModifiedDate(ZonedDateTime.now());
        taskRepository.save(parentTask);

        TaskDTO result = taskMapper.taskToTaskDTO(subTask);

        return result;
    }

    @Transactional(readOnly = true)
    public List<TaskDTO> findByCondition(TaskCondition taskCondition, List<Long> excludeIds) {

        User loginUser = SecurityUtils.getCurrentUser();

        Map<String, Object> condition = Maps.newHashMap();

        condition.put("name", taskCondition.getName());

        if(taskCondition.getProjectId() != null)
            condition.put("name", taskCondition.getProjectId());

        if(StringUtils.hasText(taskCondition.getAssigneeName()) && (taskCondition.getAssigneeSelfYn() != null && !taskCondition.getAssigneeSelfYn())) {

            condition.put("assigneeSelfYn", Boolean.FALSE);
            condition.put("assignee", taskCondition.getAssigneeName());

        } else if(taskCondition.getAssigneeSelfYn() != null && taskCondition.getAssigneeSelfYn()) {

            condition.put("assigneeSelfYn", Boolean.TRUE);
            condition.put("assignee", loginUser.getLogin());
        }

        if(taskCondition.getCreatedBySelfYn() != null && taskCondition.getCreatedBySelfYn()) {
            condition.put("createdBy", loginUser.getLogin());
        }

        condition.put("excludeIds", excludeIds);

        return taskDAO.getTasksByCondition(condition);
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
