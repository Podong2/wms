package kr.wisestone.wms.web.rest.dto;

import kr.wisestone.wms.domain.*;
import lombok.Data;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

public class ProjectDTO implements Serializable {

    private Long id;

    private String name = "";

    private String startDate = "";

    private String endDate = "";

    private String contents = "";

    private Boolean folderYn = Boolean.FALSE;

    private Boolean adminYn = Boolean.FALSE;

    private Long statusId;

    private String statusName;

    private List<ProjectDTO> projectParents = new ArrayList<>();

    private List<ProjectDTO> projectChilds = new ArrayList<>();

    private List<UserDTO> projectAdmins = new ArrayList<>();

    private List<UserDTO> projectMembers = new ArrayList<>();

    private List<UserDTO> projectWatchers = new ArrayList<>();

    private List<AttachedFileDTO> attachedFiles = new ArrayList<>();

    private String createdBy;

    private String createdByName;

    private ZonedDateTime createdDate;

    private String lastModifiedBy;

    private ZonedDateTime lastModifiedDate;

    public ProjectDTO() {}

    public ProjectDTO(Project project) {
        this.setId(project.getId());
        this.setName(project.getName());
        if(project.getPeriod() != null) {
            this.setStartDate(project.getPeriod().getStartDate());
            this.setEndDate(project.getPeriod().getEndDate());
        }
        this.setContents(project.getContents());
        this.setFolderYn(project.getFolderYn());
        if(project.getStatus() != null)
            this.setStatusId(project.getStatus().getId());

        this.setCreatedBy(project.getCreatedBy());
        this.setCreatedDate(project.getCreatedDate());

        this.setLastModifiedBy(project.getLastModifiedBy());
        this.setLastModifiedDate(project.getLastModifiedDate());
    }

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

    public Boolean getFolderYn() {
        return folderYn;
    }

    public void setFolderYn(Boolean folderYn) {
        this.folderYn = folderYn;
    }

    public List<UserDTO> getProjectAdmins() {
        return projectAdmins;
    }

    public void setProjectAdmins(List<UserDTO> projectAdmins) {
        this.projectAdmins = projectAdmins;
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

    public List<ProjectDTO> getProjectParents() {
        return projectParents;
    }

    public void setProjectParents(List<ProjectDTO> projectParents) {
        this.projectParents = projectParents;
    }

    public List<ProjectDTO> getProjectChilds() {
        return projectChilds;
    }

    public void setProjectChilds(List<ProjectDTO> projectChilds) {
        this.projectChilds = projectChilds;
    }

    public List<UserDTO> getProjectMembers() {
        return projectMembers;
    }

    public void setProjectMembers(List<UserDTO> projectMembers) {
        this.projectMembers = projectMembers;
    }

    public List<UserDTO> getProjectWatchers() {
        return projectWatchers;
    }

    public void setProjectWatchers(List<UserDTO> projectWatchers) {
        this.projectWatchers = projectWatchers;
    }

    public List<AttachedFileDTO> getAttachedFiles() {
        return attachedFiles;
    }

    public void setAttachedFiles(List<AttachedFileDTO> attachedFiles) {
        this.attachedFiles = attachedFiles;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public ZonedDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(ZonedDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public String getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public ZonedDateTime getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(ZonedDateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public String getCreatedByName() {
        return createdByName;
    }

    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }

    public Boolean getAdminYn() {
        return adminYn;
    }

    public void setAdminYn(Boolean adminYn) {
        this.adminYn = adminYn;
    }
}
