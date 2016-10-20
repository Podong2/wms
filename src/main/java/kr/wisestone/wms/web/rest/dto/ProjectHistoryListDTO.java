package kr.wisestone.wms.web.rest.dto;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

public class ProjectHistoryListDTO implements Serializable {

    private Long id;

    private Long taskId;

    private String name = "";

    private String startDate = "";

    private String endDate = "";

    private String contents = "";

    private Long statusId;

    private String statusName;

    private List<UserDTO> assignees;

    private Long parentId;

    private List<ProjectDTO> taskProjects = new ArrayList<>();

    private ZonedDateTime createdDate;

    private String createdBy;

    private String createdByName;

    private Long createdByImageId;

    private ZonedDateTime lastModifiedDate;

    private String lastModifiedBy;

    private Long sharedAttachedFileId;

    private String sharedAttachedFileName;

    private String sharedAttachedFileContentType;

    private Long sharedAttachedFileSize;

    private String historyType;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
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

    public String getStatusName() {
        return statusName;
    }

    public void setStatusName(String statusName) {
        this.statusName = statusName;
    }

    public List<UserDTO> getAssignees() {
        return assignees;
    }

    public void setAssignees(List<UserDTO> assignees) {
        this.assignees = assignees;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public List<ProjectDTO> getTaskProjects() {
        return taskProjects;
    }

    public void setTaskProjects(List<ProjectDTO> taskProjects) {
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

    public String getCreatedByName() {
        return createdByName;
    }

    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }

    public Long getCreatedByImageId() {
        return createdByImageId;
    }

    public void setCreatedByImageId(Long createdByImageId) {
        this.createdByImageId = createdByImageId;
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

    public Long getSharedAttachedFileId() {
        return sharedAttachedFileId;
    }

    public void setSharedAttachedFileId(Long sharedAttachedFileId) {
        this.sharedAttachedFileId = sharedAttachedFileId;
    }

    public String getSharedAttachedFileName() {
        return sharedAttachedFileName;
    }

    public void setSharedAttachedFileName(String sharedAttachedFileName) {
        this.sharedAttachedFileName = sharedAttachedFileName;
    }

    public String getSharedAttachedFileContentType() {
        return sharedAttachedFileContentType;
    }

    public void setSharedAttachedFileContentType(String sharedAttachedFileContentType) {
        this.sharedAttachedFileContentType = sharedAttachedFileContentType;
    }

    public Long getSharedAttachedFileSize() {
        return sharedAttachedFileSize;
    }

    public void setSharedAttachedFileSize(Long sharedAttachedFileSize) {
        this.sharedAttachedFileSize = sharedAttachedFileSize;
    }

    public String getHistoryType() {
        return historyType;
    }

    public void setHistoryType(String historyType) {
        this.historyType = historyType;
    }
}
