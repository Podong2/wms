package kr.wisestone.wms.web.rest.dto;

import kr.wisestone.wms.domain.*;
import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class ProjectDTO implements Serializable {

    private Long id;

    private String name;

    private String startDate;

    private String endDate;

    private String contents;

    private Boolean folderYn = Boolean.FALSE;

    private Long statusId;

    private String statusName;

    private Long adminId;

    private String adminName;

    private List<ProjectDTO> projectParents = new ArrayList<>();

    private List<UserDTO> projectUsers = new ArrayList<>();

    private List<ProjectAttachedFile> projectAttachedFiles = new ArrayList<>();

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

    public Long getAdminId() {
        return adminId;
    }

    public void setAdminId(Long adminId) {
        this.adminId = adminId;
    }

    public String getAdminName() {
        return adminName;
    }

    public void setAdminName(String adminName) {
        this.adminName = adminName;
    }

    public List<ProjectDTO> getProjectParents() {
        return projectParents;
    }

    public void setProjectParents(List<ProjectDTO> projectParents) {
        this.projectParents = projectParents;
    }

    public List<UserDTO> getProjectUsers() {
        return projectUsers;
    }

    public void setProjectUsers(List<UserDTO> projectUsers) {
        this.projectUsers = projectUsers;
    }

    public List<ProjectAttachedFile> getProjectAttachedFiles() {
        return projectAttachedFiles;
    }

    public void setProjectAttachedFiles(List<ProjectAttachedFile> projectAttachedFiles) {
        this.projectAttachedFiles = projectAttachedFiles;
    }
}
