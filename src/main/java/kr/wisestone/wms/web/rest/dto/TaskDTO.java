package kr.wisestone.wms.web.rest.dto;

import kr.wisestone.wms.domain.TaskAttachedFile;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;


/**
 * A DTO for the Task entity.
 */
public class TaskDTO implements Serializable {

    private Long id;

    private String name;

    private String startDate;

    private String endDate;

    private String contents;

    private Long statusId;

    private String statusName;

    private List<UserDTO> assignees;

    private List<UserDTO> watchers;

    private Boolean importantYn;

    private Boolean templateYn;

    private String statusGroup;

    private List<TaskAttachedFile> attachedFiles;

    private TaskDTO parent;

    private List<TaskDTO> subTasks = new ArrayList<>();

    private List<TaskDTO> relatedTasks = new ArrayList<>();

    private List<ProjectDTO> taskProjects = new ArrayList<>();

    private List<String> taskProjectHierarchy = new ArrayList<>();

    private ZonedDateTime createdDate;

    private String createdBy;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContents() {
        return contents;
    }

    public void setContents(String contents) {
        this.contents = contents;
    }

    public Long getStatusId() {
        return statusId;
    }

    public void setStatusId(Long codeId) {
        this.statusId = codeId;
    }

    public String getStatusName() {
        return statusName;
    }

    public void setStatusName(String statusName) {
        this.statusName = statusName;
    }

    public List<TaskAttachedFile> getAttachedFiles() {
        return attachedFiles;
    }

    public void setAttachedFiles(List<TaskAttachedFile> attachedFiles) {
        this.attachedFiles = attachedFiles;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public List<UserDTO> getAssignees() {
        return assignees;
    }

    public void setAssignees(List<UserDTO> assignees) {
        this.assignees = assignees;
    }

    public List<UserDTO> getWatchers() {
        return watchers;
    }

    public void setWatchers(List<UserDTO> watchers) {
        this.watchers = watchers;
    }

    public Boolean getImportantYn() {
        return importantYn;
    }

    public void setImportantYn(Boolean importantYn) {
        this.importantYn = importantYn;
    }

    public Boolean getTemplateYn() {
        return templateYn;
    }

    public void setTemplateYn(Boolean templateYn) {
        this.templateYn = templateYn;
    }

    public void setStatusGroup(String statusGroup) {
        this.statusGroup = statusGroup;
    }

    public List<TaskDTO> getSubTasks() {
        return subTasks;
    }

    public void setSubTasks(List<TaskDTO> subTasks) {
        this.subTasks = subTasks;
    }

    public List<TaskDTO> getRelatedTasks() {
        return relatedTasks;
    }

    public void setRelatedTasks(List<TaskDTO> relatedTasks) {
        this.relatedTasks = relatedTasks;
    }

    public TaskDTO getParent() {
        return parent;
    }

    public void setParent(TaskDTO parent) {
        this.parent = parent;
    }

    public ZonedDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(ZonedDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public String getStatusGroup() {
        return statusGroup;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public List<String> getTaskProjectHierarchy() {
        return taskProjectHierarchy;
    }

    public void setTaskProjectHierarchy(List<String> taskProjectHierarchy) {
        this.taskProjectHierarchy = taskProjectHierarchy;
    }

    public List<ProjectDTO> getTaskProjects() {
        return taskProjects;
    }

    public void setTaskProjects(List<ProjectDTO> taskProjects) {
        this.taskProjects = taskProjects;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        TaskDTO taskDTO = (TaskDTO) o;

        if ( ! Objects.equals(id, taskDTO.id)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {

        return "TaskDTO{" +
            "id=" + id +
            ", name='" + name + '\'' +
            ", startDate='" + startDate + '\'' +
            ", endDate='" + endDate + '\'' +
            ", contents='" + contents + '\'' +
            ", statusId=" + statusId +
            ", statusName='" + statusName + '\'' +
            ", assignees=" + assignees +
            ", watchers=" + watchers +
            ", importantYn=" + importantYn +
            ", templateYn=" + templateYn +
            ", statusGroup='" + statusGroup + '\'' +
            ", attachedFiles=" + attachedFiles +
            '}';
    }
}
