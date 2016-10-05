package kr.wisestone.wms.service;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.mysema.query.BooleanBuilder;
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
import kr.wisestone.wms.web.rest.mapper.UserMapper;
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
    private UserService userService;

    @Inject
    private UserMapper userMapper;

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

        Map<String, Object> condition = Maps.newHashMap(ImmutableMap.<String, Object>builder().
            put("id", id).
            build());

        ProjectDTO projectDTO = projectDAO.getProject(condition);
//
//        User user = userService.findByLogin(project.getCreatedBy());
//        projectDTO.setCreatedByName(user.getName());
//
//        this.copyProjectRelationProperties(project, projectDTO);
//
//        if(!project.getProjectAttachedFiles().isEmpty()) {
//            projectDTO.setAttachedFiles(project.getPlainProjectAttachedFiles().stream().map(AttachedFileDTO::new).collect(Collectors.toList()));
//        }

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

        if(StringUtils.isEmpty(name)) {

            BooleanBuilder predicate = new BooleanBuilder();
            predicate.and(QProject.project.projectUsers.any().user.login.eq(login));

            if(excludeIds != null && !excludeIds.isEmpty()) {
                predicate.and(QProject.project.id.notIn(excludeIds));
            }

            Pageable pageable = new PageRequest(0, 3, Sort.Direction.DESC, "createdDate");

            List<Project> projects = Lists.newArrayList(this.projectRepository.findAll(predicate, pageable));

            List<ProjectDTO> projectDTOs = Lists.newArrayList();

            for(Project project : projects) {
                ProjectDTO projectDTO = projectMapper.projectToProjectDTO(project);

                this.copyProjectRelationProperties(project, projectDTO);

                projectDTOs.add(projectDTO);
            }

            return projectDTOs;
        }

        BooleanBuilder predicate = new BooleanBuilder();

        predicate.and(QProject.project.name.containsIgnoreCase(name));
        predicate.and(QProject.project.projectUsers.any().user.login.eq(login));

        if(excludeIds != null && !excludeIds.isEmpty()) {
            predicate.and(QProject.project.id.notIn(excludeIds));
        }

        List<Project> projects = Lists.newArrayList(this.projectRepository.findAll(predicate));

        List<ProjectDTO> projectDTOs = Lists.newArrayList();

        for(Project project : projects) {
            ProjectDTO projectDTO = projectMapper.projectToProjectDTO(project);

            this.copyProjectRelationProperties(project, projectDTO);

            projectDTOs.add(projectDTO);
        }

        return projectDTOs;
    }

    @Transactional(readOnly = true)
    public List<ProjectDTO> findActiveProjects() {

        String login = SecurityUtils.getCurrentUserLogin();

        QProject $project = QProject.project;

        BooleanBuilder predicate = new BooleanBuilder();
        predicate.and($project.status.id.eq(Project.STATUS_ACTIVE));
        predicate.and($project.projectUsers.any().user.login.eq(login));

        predicate.and($project.projectParents.isEmpty()
                    .or($project.projectParents.any().parent.projectUsers.any().user.login.ne(login))
        );

        List<Project> projects = Lists.newArrayList(projectRepository.findAll(predicate));

        List<ProjectDTO> projectDTOs = Lists.newArrayList();

        for(Project project : projects) {

            if(isParentRelatedToLoginUser(project)) continue;

            ProjectDTO projectDTO = projectMapper.projectToProjectDTO(project);

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

            ProjectDTO projectDTO = projectMapper.projectToProjectDTO(projectRelation.getChild());

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

        condition.put("listType", projectTaskCondition.getListType());

        if(projectTaskCondition.getListType().equalsIgnoreCase(ProjectTaskCondition.LIST_TYPE_WEEK)) {

            condition.put("weekStartDate", DateUtil.getWeekStartDate());
            condition.put("weekEndDate", DateUtil.getWeekEndDate());

        } else if(projectTaskCondition.getListType().equalsIgnoreCase(ProjectTaskCondition.LIST_TYPE_DELAYED)) {

            String today = DateUtil.getTodayWithYYYYMMDD();
            condition.put("today", today);
        }

        List<TaskDTO> taskDTOs = this.taskDAO.getProjectManagedTasks(condition);

        return taskDTOs;
    }

    @Transactional(readOnly = true)
    public List<TaskDTO> findHistoryTasks(Long projectId) {

        Project project = projectRepository.findOne(projectId);

        if(project == null)
            throw new CommonRuntimeException("error.project.notFound");

        List<Long> projectIds = getChildProjectIds(project);

        Map<String, Object> condition = Maps.newHashMap();
        condition.put("projectIds", projectIds);
        condition.put("projectHistoryYn", Boolean.TRUE);

        List<TaskDTO> taskDTOs = taskDAO.getProjectTasks(condition);

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

    @Transactional(readOnly = true)
    public List<ProjectStatisticsDTO> getProjectStatistics(String listType) {

        String login = SecurityUtils.getCurrentUserLogin();

        QProject $project = QProject.project;

        BooleanBuilder predicate = new BooleanBuilder();

        if("IN_PROGRESS".equalsIgnoreCase(listType)) {
            predicate.and($project.status.id.eq(Project.STATUS_ACTIVE));
        } else if("COMPLETION".equalsIgnoreCase(listType)) {
            predicate.and($project.status.id.eq(Project.STATUS_COMPLETE));
        }

        predicate.and($project.projectUsers.any().user.login.eq(login));

        predicate.and(
            $project.projectParents.isEmpty()
                .or($project.projectParents.any().parent.projectUsers.isEmpty()
                    .or($project.projectParents.any().parent.projectUsers.any().user.login.ne(login)))
        );

        List<Project> projects = Lists.newArrayList(projectRepository.findAll(predicate));

        List<ProjectStatisticsDTO> projectStatisticsDTOs = Lists.newArrayList();

        for(Project project : projects) {

            ProjectDTO projectDTO = this.projectMapper.projectToProjectDTO(project);

            this.copyProjectRelationProperties(project, projectDTO);

            List<Project> childProjects = Lists.newArrayList();
            this.getChildProjectList(project.getProjectChilds(), childProjects);

            Long childProjectCount = childProjects.stream().filter(childProject -> childProject.getFolderYn() == Boolean.FALSE).count();
            Long childFolderCount = childProjects.stream().filter(childProject -> childProject.getFolderYn() == Boolean.TRUE).count();

            List<TaskDTO> taskDTOs = this.findTasksByProjectIds(getChildProjectIds(project));

            Long taskCompleteCount = taskDTOs.stream().filter(taskDTO -> taskDTO.getStatusId().equals(Task.STATUS_COMPLETE)).count();
            Long taskTotalCount = taskDTOs.stream().count();

            ProjectStatisticsDTO projectStatisticsDTO = new ProjectStatisticsDTO(projectDTO, childProjectCount, childFolderCount, taskCompleteCount, taskTotalCount);

            projectStatisticsDTOs.add(projectStatisticsDTO);
        }

        return projectStatisticsDTOs;
    }

    private List<TaskDTO> findTasksByProjectIds(List<Long> projectIds) {

        Map<String, Object> condition = Maps.newHashMap();
        condition.put("projectIds", projectIds);

        List<TaskDTO> taskDTOs = taskDAO.getProjectTasks(condition);

        return taskDTOs;
    }

    private void getChildProjectList(Set<ProjectRelation> projectChilds, List<Project> childProjects) {

        for(ProjectRelation projectRelation : projectChilds) {

            this.getChildProjectList(projectRelation.getChild().getProjectChilds(), childProjects);

            childProjects.add(projectRelation.getChild());
        }
    }
}
