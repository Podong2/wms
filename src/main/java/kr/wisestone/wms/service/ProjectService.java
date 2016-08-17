package kr.wisestone.wms.service;

import com.google.common.collect.Lists;
import com.mysema.query.BooleanBuilder;
import kr.wisestone.wms.common.exception.CommonRuntimeException;
import kr.wisestone.wms.domain.*;
import kr.wisestone.wms.repository.ProjectRepository;
import kr.wisestone.wms.security.SecurityUtils;
import kr.wisestone.wms.web.rest.dto.*;
import kr.wisestone.wms.web.rest.form.ProjectForm;
import kr.wisestone.wms.web.rest.mapper.ProjectMapper;
import kr.wisestone.wms.web.rest.mapper.UserMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ClassUtils;
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

    @Transactional
    public ProjectDTO save(ProjectForm projectForm) {
        log.debug("Request to save Project : {}", projectForm);

        Project project = projectForm.bind(new Project());

        if(project.getAdmin() == null) {
            User user = SecurityUtils.getCurrentUser();

            project.setAdmin(user);
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

        if(project.getProjectUsers() != null && !project.getProjectUsers().isEmpty()) {
            projectDTO.setProjectUsers(userMapper.usersToUserDTOs(project.getPlainProjectUsers()));
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

    public List<ProjectDTO> findByNameLike(String name) {
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
        predicate.and($project.projectUsers.any().user.login.eq(login).or($project.admin.login.eq(login)));

        predicate.and($project.projectParents.isEmpty()
                    .or($project.projectParents.any().parent.projectUsers.any().user.login.ne(login)
                        .and($project.projectParents.any().parent.admin.login.ne(login))
                    )
                );

        List<Project> projects = Lists.newArrayList(projectRepository.findAll(predicate));

        List<ProjectDTO> projectDTOs = Lists.newArrayList();

        for(Project project : projects) {

            ProjectDTO projectDTO = projectMapper.projectToProjectDTO(project);

            this.bindChildProjects(projectDTO, project.getProjectChilds());

            projectDTOs.add(projectDTO);
        }

        return projectMapper.projectsToProjectDTOs(projects);
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
    public List<TaskDTO> findAllTasks(Long id) {

        Project project = projectRepository.findOne(id);

        if(project == null)
            throw new CommonRuntimeException("error.project.notFound");

        return taskService.findAllTaskByProjectHierarchy(project);
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

        List<TraceLogDTO> traceLogDTOs
            = traceLogService.findByEntityIdAndEntityNameAndAttachedFileIsNotNull(project.getId(), ClassUtils.getShortName(project.getClass()));

        for(TraceLogDTO traceLogDTO : traceLogDTOs) {
            projectManagedAttachedFileDTOs.addAll(
                traceLogDTO.getAttachedFiles().stream().map(
                    attachedFileDTO -> new ProjectManagedAttachedFileDTO(project, attachedFileDTO)
                ).collect(Collectors.toList())
            );
        }

        List<Task> tasks = taskService.findByProject(project);

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
}
