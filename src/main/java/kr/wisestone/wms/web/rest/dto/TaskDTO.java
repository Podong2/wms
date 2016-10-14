package kr.wisestone.wms.web.rest.dto;

import kr.wisestone.wms.common.util.DateUtil;
import kr.wisestone.wms.domain.Task;
import kr.wisestone.wms.domain.TaskAttachedFile;
import kr.wisestone.wms.domain.TaskRepeatSchedule;
import kr.wisestone.wms.domain.UserType;
import org.flywaydb.core.internal.util.StringUtils;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;


/**
 * A DTO for the Task entity.
 */
public class TaskDTO implements Serializable {

    private Long id;

    private String name = "";

    private String startDate = "";

    private String endDate = "";

    private String contents = "";

    private Long statusId;

    private String statusName;

    private List<UserDTO> assignees;

    private List<UserDTO> watchers;

    private Boolean importantYn = Boolean.FALSE;

    private Boolean templateYn = Boolean.FALSE;

    private String statusGroup;

    private List<AttachedFileDTO> attachedFiles;

    private TaskDTO parent;

    private Long parentId;

    private List<TaskDTO> subTasks = new ArrayList<>();

    private Long subTaskCount;

    private List<TaskDTO> relatedTasks = new ArrayList<>();

    private Long relatedTaskCount;

    private List<ProjectDTO> taskProjects = new ArrayList<>();

    private List<String> taskProjectHierarchy = new ArrayList<>();

    private ZonedDateTime createdDate;

    private String createdBy;

    private String createdByName;

    private ZonedDateTime lastModifiedDate;

    private String lastModifiedBy;

    private TaskRepeatScheduleDTO taskRepeatSchedule;

    private Boolean attachedFileExistYn = Boolean.FALSE;

    private Boolean privateYn = Boolean.FALSE;

    private Boolean modifyYn = Boolean.FALSE;

    public TaskDTO(Task task) {
        this.setId(task.getId());
        this.setName(task.getName());
        if(task.getPeriod() != null) {
            this.setStartDate(task.getPeriod().getStartDate());
            this.setEndDate(task.getPeriod().getEndDate());
        }
        this.setContents(task.getContents());
        if(task.getStatus() != null)
            this.setStatusId(task.getStatus().getId());

        if(task.getTaskUsers() != null && !task.getTaskUsers().isEmpty()) {
            this.setAssignees(task.findTaskUsersByType(UserType.ASSIGNEE).stream().map(UserDTO::new).collect(Collectors.toList()));
        }

        this.setCreatedBy(task.getCreatedBy());
        this.setCreatedDate(task.getCreatedDate());

        this.setLastModifiedBy(task.getLastModifiedBy());
        this.setLastModifiedDate(task.getLastModifiedDate());

        this.setImportantYn(task.getImportantYn());
        this.setPrivateYn(task.getPrivateYn());

        if(task.getTaskAttachedFiles() != null && !task.getTaskAttachedFiles().isEmpty()) {
            this.setAttachedFileExistYn(Boolean.TRUE);
        }
    }

    public TaskDTO() {}

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

    public TaskRepeatScheduleDTO getTaskRepeatSchedule() {
        return taskRepeatSchedule;
    }

    public void setTaskRepeatSchedule(TaskRepeatScheduleDTO taskRepeatSchedule) {
        this.taskRepeatSchedule = taskRepeatSchedule;
    }

    public List<AttachedFileDTO> getAttachedFiles() {
        return attachedFiles;
    }

    public void setAttachedFiles(List<AttachedFileDTO> attachedFiles) {
        this.attachedFiles = attachedFiles;
    }

    public String getCreatedByName() {
        return createdByName;
    }

    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }

    public Boolean getAttachedFileExistYn() {
        return attachedFileExistYn;
    }

    public void setAttachedFileExistYn(Boolean attachedFileExistYn) {
        this.attachedFileExistYn = attachedFileExistYn;
    }

    public Long getSubTaskCount() {
        return subTaskCount;
    }

    public void setSubTaskCount(Long subTaskCount) {
        this.subTaskCount = subTaskCount;
    }

    public Long getRelatedTaskCount() {
        return relatedTaskCount;
    }

    public void setRelatedTaskCount(Long relatedTaskCount) {
        this.relatedTaskCount = relatedTaskCount;
    }

    public Boolean getDelayYn() {

        if(StringUtils.hasText(this.endDate)) {
            String today = DateUtil.getTodayWithYYYYMMDD();

            Long endDate = DateUtil.convertStrToDate(this.endDate, "yyyy-MM-dd").getTime();

            Long now = DateUtil.convertStrToDate(today, "yyyy-MM-dd").getTime();

            if(endDate < now) {
                return Boolean.TRUE;
            }
        }

        return Boolean.FALSE;
    }

    public Boolean getPrivateYn() {
        return privateYn;
    }

    public void setPrivateYn(Boolean privateYn) {
        this.privateYn = privateYn;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public Boolean getModifyYn() {
        return modifyYn;
    }

    public void setModifyYn(Boolean modifyYn) {
        this.modifyYn = modifyYn;
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
