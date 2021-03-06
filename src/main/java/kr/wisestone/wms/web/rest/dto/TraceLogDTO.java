package kr.wisestone.wms.web.rest.dto;

import kr.wisestone.wms.domain.TraceLog;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class TraceLogDTO {

    private Long id;

    private Long entityId;

    private String entityName;

    private String entityField;

    private String persistType;

    private String oldValue;

    private String newValue;

    private String etcValue;

    private Boolean replyYn = Boolean.FALSE;

    private Long attachedFileId;

    private List<AttachedFileDTO> attachedFiles = new ArrayList<>();

    private String taskName;

    private Long taskId;

    private Long projectId;

    private Long profileImageId;

    private String createdBy;

    private String createdByName;

    private Long createdById;

    private Date createdDate;

    private String lastModifiedBy;

    private Date lastModifiedDate;

    public TraceLogDTO() {

    }

    public TraceLogDTO(TraceLog traceLog) {
        this.setId( traceLog.getId() );
        this.setEntityId( traceLog.getEntityId() );
        this.setEntityName( traceLog.getEntityName() );
        this.setEntityField( traceLog.getEntityField() );
        this.setPersistType( traceLog.getPersistType() );
        this.setOldValue( traceLog.getOldValue() );
        this.setNewValue( traceLog.getNewValue() );
        this.setEtcValue( traceLog.getEtcValue() );
        this.setReplyYn( traceLog.getReplyYn() );
        this.setAttachedFileId( traceLog.getAttachedFileId() );
        this.setTaskId( traceLog.getTaskId() );
        this.setProjectId( traceLog.getProjectId() );
        this.setCreatedBy( traceLog.getCreatedBy() );

        if(traceLog.getCreatedDate() != null)
            this.setCreatedDate( Date.from(traceLog.getCreatedDate().toInstant()) );

        this.setLastModifiedBy( traceLog.getLastModifiedBy() );

        if(traceLog.getLastModifiedDate() != null)
            this.setLastModifiedDate( Date.from(traceLog.getLastModifiedDate().toInstant()) );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEntityId() {
        return entityId;
    }

    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }

    public String getEntityName() {
        return entityName;
    }

    public void setEntityName(String entityName) {
        this.entityName = entityName;
    }

    public String getEntityField() {
        return entityField;
    }

    public void setEntityField(String entityField) {
        this.entityField = entityField;
    }

    public String getPersistType() {
        return persistType;
    }

    public void setPersistType(String persistType) {
        this.persistType = persistType;
    }

    public String getOldValue() {
        return oldValue;
    }

    public void setOldValue(String oldValue) {
        this.oldValue = oldValue;
    }

    public String getNewValue() {
        return newValue;
    }

    public void setNewValue(String newValue) {
        this.newValue = newValue;
    }

    public String getEtcValue() {
        return etcValue;
    }

    public void setEtcValue(String etcValue) {
        this.etcValue = etcValue;
    }

    public Boolean getReplyYn() {
        return replyYn;
    }

    public void setReplyYn(Boolean replyYn) {
        this.replyYn = replyYn;
    }

    public Long getAttachedFileId() {
        return attachedFileId;
    }

    public void setAttachedFileId(Long attachedFileId) {
        this.attachedFileId = attachedFileId;
    }

    public List<AttachedFileDTO> getAttachedFiles() {
        return attachedFiles;
    }

    public void setAttachedFiles(List<AttachedFileDTO> attachedFiles) {
        this.attachedFiles = attachedFiles;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public String getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public Date getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(Date lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public Long getProfileImageId() {
        return profileImageId;
    }

    public void setProfileImageId(Long profileImageId) {
        this.profileImageId = profileImageId;
    }

    public String getCreatedByName() {
        return createdByName;
    }

    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }

    public Long getCreatedById() {
        return createdById;
    }

    public void setCreatedById(Long createdById) {
        this.createdById = createdById;
    }
}
