package kr.wisestone.wms.web.rest.dto;


import kr.wisestone.wms.domain.*;

public class ProjectManagedAttachedFileDTO {

    private static final String LOCATION_TASK = "TASK";
    private static final String LOCATION_PROJECT = "TASK";

    private String location;

    private String locationType;

    private Long locationId;

    private AttachedFileDTO attachedFile;

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

    public ProjectManagedAttachedFileDTO(Task task, AttachedFileDTO attachedFile) {

        this.setLocation(task.getName());
        this.setLocationType(LOCATION_TASK);
        this.setLocationId(task.getId());
        this.setAttachedFile(attachedFile);
    }

    public ProjectManagedAttachedFileDTO(Project project, AttachedFileDTO attachedFile) {

        this.setLocation(project.getName());
        this.setLocationType(LOCATION_PROJECT);
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
}
