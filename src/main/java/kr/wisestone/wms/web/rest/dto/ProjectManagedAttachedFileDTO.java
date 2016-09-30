package kr.wisestone.wms.web.rest.dto;


import kr.wisestone.wms.domain.*;

import java.time.ZonedDateTime;

public class ProjectManagedAttachedFileDTO {

    public static final String LOCATION_TASK = "TASK";
    public static final String LOCATION_TASK_REPLY = "TASK_REPLY";
    public static final String LOCATION_PROJECT = "PROJECT";
    public static final String LOCATION_PROJECT_SHARED = "PROJECT_SHARED";
    public static final String LOCATION_PROJECT_REPLY = "PROJECT_REPLY";

    private String location;

    private String locationType;

    private Long locationId;

    private AttachedFileDTO attachedFile;

    private String createdBy;

    private ZonedDateTime createdDate;

    private String lastModifiedBy;

    private ZonedDateTime lastModifiedDate;

    public ProjectManagedAttachedFileDTO() {}

    public ProjectManagedAttachedFileDTO(TaskAttachedFile taskAttachedFile) {

        Task task = taskAttachedFile.getTask();

        this.setLocation(task.getName());
        this.setLocationType(LOCATION_TASK);
        this.setLocationId(task.getId());
        this.setAttachedFile(new AttachedFileDTO(taskAttachedFile.getAttachedFile()));
    }

    public ProjectManagedAttachedFileDTO(ProjectAttachedFile projectAttachedFile) {

        Project project = projectAttachedFile.getProject();

        this.setLocation(project.getName());
        this.setLocationType(LOCATION_PROJECT);
        this.setLocationId(project.getId());
        this.setAttachedFile(new AttachedFileDTO(projectAttachedFile.getAttachedFile()));

    }

    public ProjectManagedAttachedFileDTO(ProjectSharedAttachedFile projectSharedAttachedFile) {

        Project project = projectSharedAttachedFile.getProject();

        this.setLocation(project.getName());
        this.setLocationType(LOCATION_PROJECT_SHARED);
        this.setLocationId(project.getId());
        this.setAttachedFile(new AttachedFileDTO(projectSharedAttachedFile.getAttachedFile()));
    }

    public ProjectManagedAttachedFileDTO(Task task, AttachedFileDTO attachedFile) {

        this.setLocation(task.getName());
        this.setLocationType(LOCATION_TASK_REPLY);
        this.setLocationId(task.getId());
        this.setAttachedFile(attachedFile);
    }

    public ProjectManagedAttachedFileDTO(Project project, AttachedFileDTO attachedFile) {

        this.setLocation(project.getName());
        this.setLocationType(LOCATION_PROJECT_REPLY);
        this.setLocationId(project.getId());
        this.setAttachedFile(attachedFile);
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getLocationType() {
        return locationType;
    }

    public void setLocationType(String locationType) {
        this.locationType = locationType;
    }

    public Long getLocationId() {
        return locationId;
    }

    public void setLocationId(Long locationId) {
        this.locationId = locationId;
    }

    public AttachedFileDTO getAttachedFile() {
        return attachedFile;
    }

    public void setAttachedFile(AttachedFileDTO attachedFile) {
        this.attachedFile = attachedFile;
    }

    public ZonedDateTime getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(ZonedDateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
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
}
