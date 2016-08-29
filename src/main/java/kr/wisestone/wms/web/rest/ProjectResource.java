package kr.wisestone.wms.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.google.common.collect.Lists;
import kr.wisestone.wms.service.ProjectService;
import kr.wisestone.wms.service.TaskService;
import kr.wisestone.wms.web.rest.condition.ProjectTaskCondition;
import kr.wisestone.wms.web.rest.condition.TaskCondition;
import kr.wisestone.wms.web.rest.dto.*;
import kr.wisestone.wms.web.rest.form.ProjectForm;
import kr.wisestone.wms.web.rest.form.TaskForm;
import kr.wisestone.wms.web.rest.mapper.ProjectMapper;
import kr.wisestone.wms.web.rest.util.HeaderUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.inject.Inject;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Project.
 */
@RestController
@RequestMapping("/api/")
public class ProjectResource {

    private final Logger log = LoggerFactory.getLogger(TaskResource.class);

    @Inject
    private ProjectService projectService;

    @Inject
    private ProjectMapper projectMapper;

    @RequestMapping(value = "/projects",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<ProjectDTO> createProject(@RequestBody ProjectForm projectForm) throws URISyntaxException {
        log.debug("REST request to save Project : {}", projectForm);
        if (projectForm.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("project", "idexists", "A new project cannot already have an ID")).body(null);
        }

        ProjectDTO result = projectService.save(projectForm);
        return ResponseEntity.created(new URI("/api/projects/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("project", result.getId().toString()))
            .body(result);
    }

    @RequestMapping(value = "/projects/update",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<ProjectDTO> updateProject(ProjectForm projectForm, MultipartHttpServletRequest request) throws URISyntaxException, IOException {
        log.debug("REST request to update Project : {}", projectForm);
        if (projectForm.getId() == null) {
            return createProject(projectForm);
        }

        List<MultipartFile> files = request.getFiles("file");

        ProjectDTO result = projectService.update(projectForm, files);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("project", projectForm.getId().toString()))
            .body(result);
    }

    @RequestMapping(value = "/projects",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<ProjectDTO> updateProject(ProjectForm projectForm) throws URISyntaxException {
        log.debug("REST request to update Project : {}", projectForm);

        ProjectDTO result = projectService.update(projectForm, Lists.newArrayList());
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("project", projectForm.getId().toString()))
            .body(result);
    }

    @RequestMapping(value = "/projects",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<List<ProjectDTO>> getAllProjects()
        throws URISyntaxException {
        log.debug("REST request to get a page of Projects");

        List<ProjectDTO> result = projectService.findActiveProjects();
//        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/projects");
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value = "/projects/findByName",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<ProjectDTO>> findByName(@RequestParam(value = "name", required = false) String name) {
        log.debug("REST request to get Project name : {}", name);

        List<ProjectDTO> projectDTOs = projectService.findByNameLike(name);

        return new ResponseEntity<>(projectDTOs, HttpStatus.OK);
    }

    @RequestMapping(value = "/projects/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<ProjectDTO> getProject(@PathVariable Long id) {
        log.debug("REST request to get Project : {}", id);
        ProjectDTO projectDTO = projectService.findOne(id);
        return Optional.ofNullable(projectDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @RequestMapping(value = "/projects/findTasks",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<TaskDTO>> findProjectTasks(@ModelAttribute ProjectTaskCondition projectTaskCondition) {
        log.debug("REST request to get Project : {}", projectTaskCondition.getProjectId());
        List<TaskDTO> taskDTOs = projectService.findAllTasks(projectTaskCondition);

        return Optional.ofNullable(taskDTOs)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @RequestMapping(value = "/projects/findManagedTasks",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<ProjectTaskManageDTO> findManagedProjectTasks(@ModelAttribute ProjectTaskCondition projectTaskCondition) {
        log.debug("REST request to get Project : {}", projectTaskCondition.getProjectId());

        ProjectDTO projectDTO = projectService.findOne(projectTaskCondition.getProjectId());

        List<TaskDTO> taskDTOs = projectService.findAllTasks(projectTaskCondition);

        return new ResponseEntity<>(
                new ProjectTaskManageDTO(projectDTO, taskDTOs),
                HttpStatus.OK);
    }

    @RequestMapping(value = "/projects/findManagedAttachedFiles/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<ProjectManagedAttachedFileDTO>> findManagedAttachedFiles(@PathVariable Long id) {
        log.debug("REST request to get Project : {}", id);
        List<ProjectManagedAttachedFileDTO> projectFiles = projectService.findAllProjectFiles(id);

        return Optional.ofNullable(projectFiles)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @RequestMapping(value = "/projects/removeManagedAttachedFiles",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> removeManagedAttachedFiles(
            @RequestParam(name = "entityName") String entityName
        , @RequestParam(name = "entityId") Long entityId
        , @RequestParam(name = "attachedFileId") Long attachedFileId) {

        log.debug("REST request to delete Project file : {}");

        projectService.removeProjectFile(entityName, entityId, attachedFileId);

        return ResponseEntity.ok().headers(HeaderUtil.createEntitySingleDeletionAlert("attachedFile", attachedFileId.toString())).build();
    }

    @RequestMapping(value = "/projects/addProjectSharedAttachedFile",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<AttachedFileDTO>> addProjectSharedAttachedFile(@RequestParam(name = "projectId") Long projectId, MultipartHttpServletRequest request) throws URISyntaxException, IOException {
        log.debug("REST request to update Project : {}", projectId);

        List<MultipartFile> files = request.getFiles("file");

        List<AttachedFileDTO> projectSharedAttachedFiles = projectService.addProjectSharedAttachedFile(projectId, files);

        return Optional.ofNullable(projectSharedAttachedFiles)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @RequestMapping(value = "/projects/statistics",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<ProjectStatisticsDTO>> getProjectStatistics(@RequestParam(name = "listType") String listType) {
        log.debug("REST request to get Project dashboard : {}", listType);

        List<ProjectStatisticsDTO> projectStatisticsDTOs = projectService.getProjectStatistics(listType);

        return Optional.ofNullable(projectStatisticsDTOs)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}
