package kr.wisestone.wms.service;

import com.google.common.collect.Lists;
import com.mysema.query.BooleanBuilder;
import kr.wisestone.wms.common.exception.CommonRuntimeException;
import kr.wisestone.wms.domain.*;
import kr.wisestone.wms.repository.ProjectRepository;
import kr.wisestone.wms.security.SecurityUtils;
import kr.wisestone.wms.web.rest.condition.ProjectTaskCondition;
import kr.wisestone.wms.web.rest.dto.*;
import kr.wisestone.wms.web.rest.form.ProjectForm;
import kr.wisestone.wms.web.rest.mapper.AttachedFileMapper;
import kr.wisestone.wms.web.rest.mapper.ProjectMapper;
import kr.wisestone.wms.web.rest.mapper.UserMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ClassUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.inject.Inject;
import java.util.List;
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
        Project project = projectRepository.findOne(id);
        ProjectDTO projectDTO = projectMapper.projectToProjectDTO(project);

        this.copyProjectRelationProperties(project, projectDTO);

        if(!project.getProjectAttachedFiles().isEmpty()) {
            projectDTO.setProjectAttachedFiles(Lists.newArrayList(project.getProjectAttachedFiles()));
        }

        return projectDTO;
    }

    private void copyProjectRelationProperties(Project project, ProjectDTO projectDTO) {

        List<User> projectAdmins = project.getPlainProjectUsers(UserType.ADMIN);

        if(projectAdmins != null && !projectAdmins.isEmpty()) {
            projectDTO.setProjectAdmins(userMapper.usersToUserDTOs(projectAdmins));
        }

        List<User> projectUsers = project.getPlainProjectUsers(UserType.SHARER);

        if(projectUsers != null && !projectUsers.isEmpty()) {
            projectDTO.setProjectUsers(userMapper.usersToUserDTOs(projectUsers));
        }

        if(project.getProjectParents() != null && !project.getProjectParents().isEmpty()) {
            projectDTO.setProjectParents(projectMapper.projectsToProjectDTOs(project.getPlainProjectParent()));
        }
    }

    @Transactional
    public ProjectDTO update(ProjectForm projectForm, List<MultipartFile> files) {

        Project origin = projectRepository.findOne(projectForm.getId());

        origin = projectForm.bind(origin);

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

    @Transactional(readOnly = true)
    public List<ProjectDTO> findByNameLike(String name) {

        if(StringUtils.isEmpty(name)) {
            return projectMapper.projectsToProjectDTOs(this.projectRepository.findTop3ByOrderByCreatedDateDesc());
        }

        BooleanBuilder predicate = new BooleanBuilder();

        predicate.and(QProject.project.name.contains(name));

        List<Project> projects = Lists.newArrayList(this.projectRepository.findAll(predicate));

        return projectMapper.projectsToProjectDTOs(projects);
    }

    @Transactional(readOnly = true)
    public List<ProjectDTO> findActiveProjects() {

        String login = SecurityUtils.getCurrentUserLogin();

        QProject $project = QProject.project;

        BooleanBuilder predicate = new BooleanBuilder();
        predicate.and($project.status.id.eq(1L));
        predicate.and($project.projectUsers.any().user.login.eq(login));

        predicate.and(
                $project.projectParents.isEmpty()
                .or($project.projectParents.any().parent.projectUsers.isEmpty()
                    .or($project.projectParents.any().parent.projectUsers.any().user.login.ne(login)))
                );

        List<Project> projects = Lists.newArrayList(projectRepository.findAll(predicate));

        List<ProjectDTO> projectDTOs = Lists.newArrayList();

        for(Project project : projects) {

            ProjectDTO projectDTO = projectMapper.projectToProjectDTO(project);

            this.bindChildProjects(projectDTO, project.getProjectChilds());

            projectDTOs.add(projectDTO);
        }

        return projectDTOs;
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
    public List<TaskDTO> findAllTasks(ProjectTaskCondition projectTaskCondition) {

        Project project = projectRepository.findOne(projectTaskCondition.getProjectId());

        if(project == null)
            throw new CommonRuntimeException("error.project.notFound");

        List<Long> projectIds = getChildProjectIds(project);

        List<TaskDTO> taskDTOs = taskService.findTasksByProjectIdsAndCondition(projectIds, projectTaskCondition);

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

        List<ProjectManagedAttachedFileDTO> projectManagedAttachedFileDTOs = Lists.newArrayList();

        this.getProjectManagedAttachedFiles(project, projectManagedAttachedFileDTOs);

        this.getProjectChildManagedAttachedFiles(project.getProjectChilds(), projectManagedAttachedFileDTOs);

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

    private void getProjectChildManagedAttachedFiles(Set<ProjectRelation> projectChilds, List<ProjectManagedAttachedFileDTO> projectManagedAttachedFileDTOs) {

        for(ProjectRelation projectRelation : projectChilds) {

            this.getProjectManagedAttachedFiles(projectRelation.getChild(), projectManagedAttachedFileDTOs);

            this.getProjectChildManagedAttachedFiles(projectRelation.getChild().getProjectChilds(), projectManagedAttachedFileDTOs);
        }
    }

    private void getProjectManagedAttachedFiles(Project project, List<ProjectManagedAttachedFileDTO> projectManagedAttachedFileDTOs) {
        projectManagedAttachedFileDTOs.addAll(
            project.getProjectAttachedFiles().stream().map(ProjectManagedAttachedFileDTO::new).collect(Collectors.toList())
        );

        projectManagedAttachedFileDTOs.addAll(
            project.getProjectSharedAttachedFiles().stream().map(ProjectManagedAttachedFileDTO::new).collect(Collectors.toList())
        );

        List<TraceLogDTO> traceLogDTOs
            = traceLogService.findByEntityIdAndEntityNameAndAttachedFileIsNotNull(project.getId(), ClassUtils.getShortName(project.getClass()));

        for(TraceLogDTO traceLogDTO : traceLogDTOs) {
            projectManagedAttachedFileDTOs.addAll(
                traceLogDTO.getAttachedFiles().stream().map(
                    attachedFileDTO -> new ProjectManagedAttachedFileDTO(project, attachedFileDTO)
                ).collect(Collectors.toList())
            );
        }

        List<Task> tasks = taskService.findByProject(project, ProjectTaskCondition.LIST_TYPE_TOTAL);

        for(Task task : tasks) {
            projectManagedAttachedFileDTOs.addAll(
                task.getTaskAttachedFiles().stream().map(ProjectManagedAttachedFileDTO::new).collect(Collectors.toList())
            );

            List<TraceLogDTO> taskTraceLogDTOs
                = traceLogService.findByEntityIdAndEntityNameAndAttachedFileIsNotNull(task.getId(), ClassUtils.getShortName(task.getClass()));

            for(TraceLogDTO traceLogDTO : taskTraceLogDTOs) {
                projectManagedAttachedFileDTOs.addAll(
                    traceLogDTO.getAttachedFiles().stream().map(
                        attachedFileDTO -> new ProjectManagedAttachedFileDTO(task, attachedFileDTO)
                    ).collect(Collectors.toList())
                );
            }
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
            predicate.and($project.status.id.eq(1L));
        } else if("COMPLETION".equalsIgnoreCase(listType)) {
            predicate.and($project.status.id.eq(2L));
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

            List<Project> childProjects = Lists.newArrayList();
            this.getChildProjectList(project.getProjectChilds(), childProjects);

            Long childProjectCount = childProjects.stream().filter(childProject -> childProject.getFolderYn() == Boolean.FALSE).count();
            Long childFolderCount = childProjects.stream().filter(childProject -> childProject.getFolderYn() == Boolean.TRUE).count();

            List<TaskDTO> taskDTOs = taskService.findTasksByProjectIds(getChildProjectIds(project));

            Long taskCompleteCount = taskDTOs.stream().filter(taskDTO -> taskDTO.getStatusId().equals(2L)).count();
            Long taskTotalCount = taskDTOs.stream().count();

            ProjectStatisticsDTO projectStatisticsDTO = new ProjectStatisticsDTO(projectDTO, childProjectCount, childFolderCount, taskCompleteCount, taskTotalCount);

            projectStatisticsDTOs.add(projectStatisticsDTO);
        }

        return projectStatisticsDTOs;
    }

    private void getChildProjectList(Set<ProjectRelation> projectChilds, List<Project> childProjects) {

        for(ProjectRelation projectRelation : projectChilds) {

            this.getChildProjectList(projectRelation.getChild().getProjectChilds(), childProjects);

            childProjects.add(projectRelation.getChild());
        }
    }
}
