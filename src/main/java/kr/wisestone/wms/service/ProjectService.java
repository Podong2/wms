package kr.wisestone.wms.service;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.mysema.query.BooleanBuilder;
import com.mysema.query.types.OrderSpecifier;
import kr.wisestone.wms.common.exception.CommonRuntimeException;
import kr.wisestone.wms.common.util.DateUtil;
import kr.wisestone.wms.domain.*;
import kr.wisestone.wms.repository.CodeRepository;
import kr.wisestone.wms.repository.ProjectRepository;
import kr.wisestone.wms.repository.dao.ProjectDAO;
import kr.wisestone.wms.repository.dao.TaskDAO;
import kr.wisestone.wms.security.SecurityUtils;
import kr.wisestone.wms.web.rest.condition.ProjectTaskCondition;
import kr.wisestone.wms.web.rest.dto.*;
import kr.wisestone.wms.web.rest.form.ProjectForm;
import kr.wisestone.wms.web.rest.mapper.AttachedFileMapper;
import kr.wisestone.wms.web.rest.mapper.ProjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.inject.Inject;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjectService {

    private final Logger log = LoggerFactory.getLogger(ProjectService.class);

    @Inject
    private ProjectRepository projectRepository;

    @Inject
    private ProjectMapper projectMapper;

    @Inject
    private AttachedFileService attachedFileService;

    @Inject
    private TaskService taskService;

    @Inject
    private TraceLogService traceLogService;

    @Inject
    private AttachedFileMapper attachedFileMapper;

    @Inject
    private CodeRepository codeRepository;

    @Inject
    private ProjectDAO projectDAO;

    @Inject
    private TaskDAO taskDAO;

    @Transactional
    public ProjectDTO save(ProjectForm projectForm) {
        log.debug("Request to save Project : {}", projectForm);

        Project project = projectForm.bind(new Project());

        List<User> originProjectAdmins = project.getPlainProjectUsers(UserType.ADMIN);

        if(originProjectAdmins == null || originProjectAdmins.isEmpty()) {
            User user = SecurityUtils.getCurrentUser();

            project.addProjectUser(user, UserType.ADMIN);
        }

        project = projectRepository.save(project);

        ProjectDTO result = projectMapper.projectToProjectDTO(project);

        return result;
    }

    @Transactional(readOnly = true)
    public ProjectDTO findOne(Long id) {
        log.debug("Request to get Project : {}", id);

        User loginUser = SecurityUtils.getCurrentUser();

        ProjectDTO projectDTO = projectDAO.getProject(id);

        for(UserDTO admin : projectDTO.getProjectAdmins()) {
            if(admin.getLogin().equals(loginUser.getLogin())) {
                projectDTO.setAdminYn(Boolean.TRUE);
            }
        }

        return projectDTO;
    }

    private void copyProjectRelationProperties(Project project, ProjectDTO projectDTO) {

        List<User> projectAdmins = project.getPlainProjectUsers(UserType.ADMIN);

        if(projectAdmins != null && !projectAdmins.isEmpty()) {
            projectDTO.setProjectAdmins(projectAdmins.stream().map(UserDTO::new).collect(Collectors.toList()));
        }

        List<User> projectWatchers = project.getPlainProjectUsers(UserType.WATCHER);

        if(projectWatchers != null && !projectWatchers.isEmpty()) {
            projectDTO.setProjectWatchers(projectWatchers.stream().map(UserDTO::new).collect(Collectors.toList()));
        }

        List<User> projectMembers = project.getPlainProjectUsers(UserType.MEMBER);

        if(projectMembers != null && !projectMembers.isEmpty()) {
            projectDTO.setProjectWatchers(projectMembers.stream().map(UserDTO::new).collect(Collectors.toList()));
        }

        if(project.getProjectParents() != null && !project.getProjectParents().isEmpty()) {
            projectDTO.setProjectParents(project.getPlainProjectParent().stream().map(ProjectDTO::new).collect(Collectors.toList()));
        }
    }

    @Transactional
    public ProjectDTO update(ProjectForm projectForm, List<MultipartFile> files) {

        Project origin = projectRepository.findOne(projectForm.getId());

        origin = projectForm.bind(origin);

        if(projectForm.getStatusId() != null) {
            origin.setStatus(this.codeRepository.findOne(projectForm.getStatusId()));
        }

        for(MultipartFile multipartFile : files) {

            AttachedFile attachedFile = this.attachedFileService.saveFile(multipartFile);

            origin.addAttachedFile(attachedFile);
        }

        if(!projectForm.getRemoveTargetFiles().isEmpty()) {

            for(Long targetFileId : projectForm.getRemoveTargetFiles()) {

                origin.removeAttachedFile(targetFileId);
            }
        }

        origin = projectRepository.save(origin);
//        projectSearchRepository.save(origin);
        ProjectDTO result = projectMapper.projectToProjectDTO(origin);

        return result;
    }

    @Transactional
    public Project updateLastModifiedDate(Long projectId) {

        Project origin = projectRepository.findOne(projectId);

        origin.setLastModifiedDate(ZonedDateTime.now());

        return projectRepository.save(origin);
    }

    @Transactional
    public ProjectDTO uploadFile(Long id, List<MultipartFile> files) {

        Project origin = projectRepository.findOne(id);

        for(MultipartFile multipartFile : files) {

            AttachedFile attachedFile = this.attachedFileService.saveFile(multipartFile);

            origin.addAttachedFile(attachedFile);
        }

        origin.setLastModifiedDate(ZonedDateTime.now());

        origin = projectRepository.save(origin);
        ProjectDTO result = projectMapper.projectToProjectDTO(origin);

        if(!origin.getProjectAttachedFiles().isEmpty()) {
            result.setAttachedFiles(origin.getPlainProjectAttachedFiles().stream().map(AttachedFileDTO::new).collect(Collectors.toList()));
        }

        return result;
    }

    @Transactional
    public ProjectDTO removeFile(Long projectId, Long attachedFileId) {

        Project origin = projectRepository.findOne(projectId);

        origin.removeAttachedFile(attachedFileId);
        origin.setLastModifiedDate(ZonedDateTime.now());

        origin = projectRepository.save(origin);
        ProjectDTO result = projectMapper.projectToProjectDTO(origin);

        if(!origin.getProjectAttachedFiles().isEmpty()) {
            result.setAttachedFiles(origin.getPlainProjectAttachedFiles().stream().map(AttachedFileDTO::new).collect(Collectors.toList()));
        }

        return result;
    }

    @Transactional(readOnly = true)
    public List<ProjectDTO> findByNameLike(String name, List<Long> excludeIds) {

        String login = SecurityUtils.getCurrentUserLogin();

        Map<String, Object> condition = Maps.newHashMap(ImmutableMap.<String, Object>builder().
            put("userId", login).
        build());

        if(excludeIds != null && !excludeIds.isEmpty()) {
            condition.put("excludeIds", excludeIds);
        }

        if(StringUtils.hasText(name)) {
            condition.put("name", name);
        }

        List<ProjectDTO> projectDTOs = this.projectDAO.getProjectByName(condition);

        return projectDTOs;
    }

    @Transactional(readOnly = true)
    public List<ProjectStatisticsDTO> getProjectStatusList(Long statusId, String orderType) {

        String login = SecurityUtils.getCurrentUserLogin();

        QProject $project = QProject.project;

        BooleanBuilder predicate = new BooleanBuilder();

        if(statusId != null)
            predicate.and($project.status.id.eq(statusId));

        predicate.and($project.projectUsers.any().user.login.eq(login));

        predicate.and($project.projectParents.isEmpty()
            .or($project.projectParents.any().parent.projectUsers.any().user.login.ne(login))
        );

        List<OrderSpecifier> orderSpecifiers = Lists.newArrayList();

        if(StringUtils.hasText(orderType)) {

            if(orderType.equals("MODIFIED_DATE")) {
                orderSpecifiers.add(QProject.project.lastModifiedDate.desc());
            } else if(orderType.equals("TEXT_ASC")) {

                orderSpecifiers.add(QProject.project.name.asc());
            } else if(orderType.equals("TEXT_DESC")) {

                orderSpecifiers.add(QProject.project.name.desc());
            }
        }

        List<Project> projects = null;

        if(orderSpecifiers.isEmpty()) {
            projects = Lists.newArrayList(projectRepository.findAll(predicate));
        } else {
            projects = Lists.newArrayList(projectRepository.findAll(predicate, orderSpecifiers.toArray(new OrderSpecifier[orderSpecifiers.size()])));
        }

        List<ProjectStatisticsDTO> projectDTOs = Lists.newArrayList();

        for(Project project : projects) {

            if(isParentRelatedToLoginUser(project)) continue;

            ProjectDTO projectDTO = this.findOne(project.getId());

            List<TaskDTO> taskDTOs = this.findTasksByProjectIdsIncludePrivate(Lists.newArrayList(project.getId()));

            Long taskCompleteCount = taskDTOs.stream().filter(taskDTO -> taskDTO.getStatusId().equals(Task.STATUS_COMPLETE)).count();
            Long taskTotalCount = taskDTOs.stream().count();

            ProjectStatisticsDTO projectStatisticsDTO = new ProjectStatisticsDTO(projectDTO, 0L, 0L, taskCompleteCount, taskTotalCount, login);

            this.getChildProjectWithStatistics(projectStatisticsDTO, project.getProjectChilds(), orderType);

            projectDTOs.add(projectStatisticsDTO);
        }

        return projectDTOs;
    }

    private void getChildProjectWithStatistics(ProjectStatisticsDTO parent, Set<ProjectRelation> projectChilds, String orderType) {

        String login = SecurityUtils.getCurrentUserLogin();

        List<ProjectStatisticsDTO> childProjectDTOs = Lists.newArrayList();

        for(ProjectRelation projectRelation : projectChilds) {

            ProjectDTO projectDTO = this.findOne(projectRelation.getChild().getId());

            List<TaskDTO> taskDTOs = this.findTasksByProjectIdsIncludePrivate(Lists.newArrayList(projectDTO.getId()));

            Long taskCompleteCount = taskDTOs.stream().filter(taskDTO -> taskDTO.getStatusId().equals(Task.STATUS_COMPLETE)).count();
            Long taskTotalCount = taskDTOs.stream().count();

            ProjectStatisticsDTO projectStatisticsDTO = new ProjectStatisticsDTO(projectDTO, 0L, 0L, taskCompleteCount, taskTotalCount, login);

            this.getChildProjectWithStatistics(projectStatisticsDTO, projectRelation.getChild().getProjectChilds(), orderType);

            childProjectDTOs.add(projectStatisticsDTO);
        }

        if(StringUtils.hasText(orderType)) {

            if(orderType.equals("MODIFIED_DATE")) {
                Collections.sort(childProjectDTOs, (p1, p2) -> {

                    Long p1Time = DateUtil.convertFromZonedDateTime(p1.getProject().getLastModifiedDate()).getTime();
                    Long p2Time = DateUtil.convertFromZonedDateTime(p2.getProject().getLastModifiedDate()).getTime();

                    return (int)(p2Time - p1Time);
                });
            } else if(orderType.equals("TEXT_ASC")) {

                Collections.sort(childProjectDTOs, (p1, p2) -> p2.getProject().getName().compareTo(p1.getProject().getName()));
            } else if(orderType.equals("TEXT_DESC")) {

                Collections.sort(childProjectDTOs, (p1, p2) -> p1.getProject().getName().compareTo(p2.getProject().getName()));
            }
        }

        parent.setProjectStatisticsChilds(childProjectDTOs);
    }

    @Transactional(readOnly = true)
    public List<ProjectDTO> findActiveProjects() {

        String login = SecurityUtils.getCurrentUserLogin();

        QProject $project = QProject.project;

        BooleanBuilder predicate = new BooleanBuilder();
//        predicate.and($project.status.id.eq(Project.STATUS_ACTIVE));
        predicate.and($project.projectUsers.any().user.login.eq(login));

        predicate.and($project.projectParents.isEmpty()
                    .or($project.projectParents.any().parent.projectUsers.any().user.login.ne(login))
        );

        List<Project> projects = Lists.newArrayList(projectRepository.findAll(predicate, QProject.project.id.asc()));

        List<ProjectDTO> projectDTOs = Lists.newArrayList();

        for(Project project : projects) {

            if(isParentRelatedToLoginUser(project)) continue;

            ProjectDTO projectDTO = new ProjectDTO(project);

            this.bindChildProjects(projectDTO, project.getProjectChilds());

            projectDTOs.add(projectDTO);
        }

        return projectDTOs;
    }

    private Boolean isParentRelatedToLoginUser(Project project) {

        String login = SecurityUtils.getCurrentUserLogin();

        List<Project> parentProjects = project.getPlainProjectParent();

        List<Project> filteredProjects = parentProjects.stream().filter(
            projectParent -> {
                List<ProjectUser> projectUsers = projectParent.getProjectUsers().stream().filter(
                    projectUser
                        -> projectUser.getUser().getLogin().equals(login)
                ).collect(Collectors.toList());

                return projectUsers != null && !projectUsers.isEmpty();
            }
        ).collect(Collectors.toList());

        return filteredProjects != null && !filteredProjects.isEmpty();
    }

    private void bindChildProjects(ProjectDTO parent, Set<ProjectRelation> projectChilds) {

        List<ProjectDTO> childProjectDTOs = Lists.newArrayList();

        for(ProjectRelation projectRelation : projectChilds) {

            ProjectDTO projectDTO = new ProjectDTO(projectRelation.getChild());

            this.bindChildProjects(projectDTO, projectRelation.getChild().getProjectChilds());

            childProjectDTOs.add(projectDTO);
        }

        parent.setProjectChilds(childProjectDTOs);
    }

    @Transactional(readOnly = true)
    public List<TaskDTO> findAllTasks(ProjectTaskCondition projectTaskCondition, Pageable pageable) {

        Project project = projectRepository.findOne(projectTaskCondition.getProjectId());

        if(project == null)
            throw new CommonRuntimeException("error.project.notFound");

        List<Long> projectIds = getChildProjectIds(project);

        Map<String, Object> condition = Maps.newHashMap(ImmutableMap.<String, Object>builder().
            put("projectIds", projectIds).
            put("offset", pageable.getOffset()).
            put("limit", pageable.getPageSize()).
            build());

        if(projectTaskCondition.getStatusId() != null)
            condition.put("statusId", projectTaskCondition.getStatusId());

        if(StringUtils.hasText(projectTaskCondition.getTaskName()))
            condition.put("taskName", projectTaskCondition.getTaskName());

        condition.put("listType", projectTaskCondition.getListType());
        condition.put("statusType", projectTaskCondition.getStatusType());

        if(projectTaskCondition.getListType().equalsIgnoreCase(ProjectTaskCondition.LIST_TYPE_WEEK)) {
            condition.put("weekStartDate", DateUtil.getWeekStartDate());
            condition.put("weekEndDate", DateUtil.getWeekEndDate());
        }

        List<TaskDTO> taskDTOs = this.taskDAO.getProjectManagedTasks(condition);

        return taskDTOs;
    }

    @Transactional(readOnly = true)
    public ProjectTaskManageDTO getProjectStatistics(ProjectTaskCondition projectTaskCondition) {

        ProjectDTO projectDTO = this.findOne(projectTaskCondition.getProjectId());

        Project project = projectRepository.findOne(projectTaskCondition.getProjectId());

        if(project == null)
            throw new CommonRuntimeException("error.project.notFound");

        List<Long> projectIds = getChildProjectIds(project);

        Map<String, Object> condition = Maps.newHashMap(ImmutableMap.<String, Object>builder().
            put("projectIds", projectIds).
            build());

        if(projectTaskCondition.getStatusId() != null)
            condition.put("statusId", projectTaskCondition.getStatusId());

        if(StringUtils.hasText(projectTaskCondition.getTaskName()))
            condition.put("taskName", projectTaskCondition.getTaskName());

        condition.put("listType", projectTaskCondition.getListType());
        condition.put("statusType", projectTaskCondition.getStatusType());

        if(projectTaskCondition.getListType().equalsIgnoreCase(ProjectTaskCondition.LIST_TYPE_WEEK)) {
            condition.put("weekStartDate", DateUtil.getWeekStartDate());
            condition.put("weekEndDate", DateUtil.getWeekEndDate());
        }

        List<TaskDTO> taskDTOs = this.taskDAO.getProjectManagedTasks(condition);

        return new ProjectTaskManageDTO(projectDTO, taskDTOs);
    }

    @Transactional(readOnly = true)
    public List<ProjectHistoryListDTO> findHistoryTasks(Long projectId) {

        Project project = projectRepository.findOne(projectId);

        if(project == null)
            throw new CommonRuntimeException("error.project.notFound");

        List<Long> projectIds = getChildProjectIds(project);

        Map<String, Object> condition = Maps.newHashMap();
        condition.put("projectIds", projectIds);
        condition.put("projectId", projectId);

        List<ProjectHistoryListDTO> taskDTOs = projectDAO.getProjectHistoryLists(condition);

        return taskDTOs;
    }

    private List<Long> getChildProjectIds(Project project) {
        List<Long> projectIds = Lists.newArrayList();

        projectIds.add(project.getId());
        this.crawlingChildProjectIds(project.getProjectChilds(), projectIds);
        return projectIds;
    }

    private void crawlingChildProjectIds(Set<ProjectRelation> childProjects, List<Long> projectIds) {

        for(ProjectRelation projectRelation : childProjects) {

            projectIds.add(projectRelation.getChild().getId());

            this.crawlingChildProjectIds(projectRelation.getChild().getProjectChilds(), projectIds);
        }
    }

    @Transactional(readOnly = true)
    public List<ProjectManagedAttachedFileDTO> findAllProjectFiles(Long id) {

        Project project = projectRepository.findOne(id);

        if(project == null)
            throw new CommonRuntimeException("error.project.notFound");

        List<Long> projectIds = getChildProjectIds(project);

        Map<String, Object> condition = Maps.newHashMap(ImmutableMap.<String, Object>builder().
            put("projectIds", projectIds).
            build());

        List<ProjectManagedAttachedFileDTO> projectManagedAttachedFileDTOs = this.projectDAO.getProjectManagedAttachedFile(condition);

        return projectManagedAttachedFileDTOs;
    }

    @Transactional
    public void removeProjectFile(String entityName, Long entityId, Long attachedFileId) {

        if(entityName.equalsIgnoreCase(ProjectManagedAttachedFileDTO.LOCATION_TASK)) {

            Task task = taskService.findOne(entityId);

            TaskAttachedFile taskAttachedFile = task.findAttachedFile(attachedFileId);

            if(taskAttachedFile != null) {
                task.removeAttachedFile(attachedFileId);
            }

            taskService.save(task);

        } else if(entityName.equalsIgnoreCase(ProjectManagedAttachedFileDTO.LOCATION_PROJECT)) {

            Project project = projectRepository.findOne(entityId);

            ProjectAttachedFile projectAttachedFile = project.findAttachedFile(attachedFileId);

            if(projectAttachedFile != null) {
                project.removeAttachedFile(attachedFileId);
            }

            projectRepository.save(project);

        } else if(entityName.equalsIgnoreCase(ProjectManagedAttachedFileDTO.LOCATION_PROJECT_SHARED)) {

            Project project = projectRepository.findOne(entityId);

            ProjectSharedAttachedFile projectAttachedFile = project.findSharedAttachedFile(attachedFileId);

            if(projectAttachedFile != null) {
                project.removeSharedAttachedFile(attachedFileId);
            }

            projectRepository.save(project);

        } else if(entityName.equalsIgnoreCase(ProjectManagedAttachedFileDTO.LOCATION_TASK_REPLY)) {

            this.traceLogService.removeAttachedFileByEntityIdAndEntityNameAndAttachedFileId(entityId, "Task", attachedFileId);

        } else if(entityName.equalsIgnoreCase(ProjectManagedAttachedFileDTO.LOCATION_PROJECT_REPLY)) {

            this.traceLogService.removeAttachedFileByEntityIdAndEntityNameAndAttachedFileId(entityId, "Project", attachedFileId);
        }
    }

    @Transactional
    public List<AttachedFileDTO> addProjectSharedAttachedFile(Long projectId, List<MultipartFile> files) {

        Project project = this.projectRepository.findOne(projectId);

        for(MultipartFile multipartFile : files) {

            AttachedFile attachedFile = this.attachedFileService.saveFile(multipartFile);

            project.addSharedAttachedFile(attachedFile);
        }

        project = this.projectRepository.save(project);

        return this.attachedFileMapper.attachedFilesToAttachedFileDTOs(project.getPlainProjectSharedAttachedFiles());
    }

    private List<TaskDTO> findTasksByProjectIdsIncludePrivate(List<Long> projectIds) {

        Map<String, Object> condition = Maps.newHashMap();
        condition.put("projectIds", projectIds);

        List<TaskDTO> taskDTOs = taskDAO.getProjectTasksByIncludePrivate(condition);

        return taskDTOs;
    }

    @Transactional
    public ProjectDTO revertProjectContents(Long id, Long traceLogId) {

        if(id == null)
            throw new CommonRuntimeException("error.project.targetIdIsNull");

        Project project = projectRepository.findOne(id);

        if(project == null)
            throw new CommonRuntimeException("error.project.notFound");

        TraceLog traceLog = traceLogService.findOne(traceLogId);

        project.setContents(traceLog.getNewValue());

        project = projectRepository.save(project);

        return projectMapper.projectToProjectDTO(project);
    }
}
