package kr.wisestone.wms.web.rest.dto;

import kr.wisestone.wms.domain.Project;
import kr.wisestone.wms.domain.Task;
import kr.wisestone.wms.domain.TaskAttachedFile;
import kr.wisestone.wms.domain.UserType;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;


/**
 * A DTO for the Task entity.
 */
public class TaskListDTO implements Serializable {

    private Long id;

    private String name;

    private String startDate;

    private String endDate;

    private String contents;

    private Long statusId;

    private Long assigneesCount = 0L;

    private Long watchersCount = 0L;

    private Boolean importantYn;

    private Boolean templateYn;

    private String statusGroup;

    private Boolean attachedFilesYn;

    private Boolean parentYn;

    private Long subTasksCount = 0L;

    private Long relatedTasksCount = 0L;

    private List<String> taskProjects = new ArrayList<>();

    private ZonedDateTime createdDate;

    private String createdBy;

    private ZonedDateTime lastModifiedDate;

    private String lastModifiedBy;

    private Boolean scheduledYn;

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

    public String getContents() {
        return contents;
    }

    public void setContents(String contents) {
        this.contents = contents;
    }

    public Long getStatusId() {
        return statusId;
    }

    public void setStatusId(Long statusId) {
        this.statusId = statusId;
    }

    public Long getAssigneesCount() {
        return assigneesCount;
    }

    public void setAssigneesCount(Long assigneesCount) {
        this.assigneesCount = assigneesCount;
    }

    public Long getWatchersCount() {
        return watchersCount;
    }

    public void setWatchersCount(Long watchersCount) {
        this.watchersCount = watchersCount;
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

    public String getStatusGroup() {
        return statusGroup;
    }

    public void setStatusGroup(String statusGroup) {
        this.statusGroup = statusGroup;
    }

    public Boolean getAttachedFilesYn() {
        return attachedFilesYn;
    }

    public void setAttachedFilesYn(Boolean attachedFilesYn) {
        this.attachedFilesYn = attachedFilesYn;
    }

    public Boolean getParentYn() {
        return parentYn;
    }

    public void setParentYn(Boolean parentYn) {
        this.parentYn = parentYn;
    }

    public Long getSubTasksCount() {
        return subTasksCount;
    }

    public void setSubTasksCount(Long subTasksCount) {
        this.subTasksCount = subTasksCount;
    }

    public Long getRelatedTasksCount() {
        return relatedTasksCount;
    }

    public void setRelatedTasksCount(Long relatedTasksCount) {
        this.relatedTasksCount = relatedTasksCount;
    }

    public List<String> getTaskProjects() {
        return taskProjects;
    }

    public void setTaskProjects(List<String> taskProjects) {
        this.taskProjects = taskProjects;
    }

    public ZonedDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(ZonedDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public ZonedDateTime getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(ZonedDateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public String getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public Boolean getScheduledYn() {
        return scheduledYn;
    }

    public void setScheduledYn(Boolean scheduledYn) {
        this.scheduledYn = scheduledYn;
    }

    public TaskListDTO() {}

    public TaskListDTO(Task task, String statusGroup) {

        setId(task.getId());
        setName(task.getName());

        if(task.getPeriod() != null) {
            setStartDate(task.getPeriod().getStartDate());
            setEndDate(task.getPeriod().getEndDate());
        }
        setContents(task.getContents());

        if(task.getStatus() != null)
            setStatusId(task.getStatus().getId());

        setAssigneesCount((long) task.findTaskUsersByType(UserType.ASSIGNEE).size());
        setWatchersCount((long) task.findTaskUsersByType(UserType.SHARER).size());
        setImportantYn(task.getImportantYn());
        setTemplateYn(task.getTemplateYn());
        setStatusGroup(statusGroup);
        setAttachedFilesYn(!task.getTaskAttachedFiles().isEmpty());
        setParentYn(task.getParent() != null);
        setSubTasksCount((long) task.getSubTasks().size());
        setRelatedTasksCount((long) task.getRelatedTasks().size());

        if(!task.getTaskProjects().isEmpty())
            setTaskProjects(task.getPlainTaskProject().stream().map(Project::getName).collect(Collectors.toList()));

        setCreatedDate(task.getCreatedDate());
        setCreatedBy(task.getCreatedBy());
        setLastModifiedDate(task.getLastModifiedDate());
        setLastModifiedBy(task.getLastModifiedBy());
        setScheduledYn(task.getTaskRepeatSchedule() != null);
    }
}
