package kr.wisestone.wms.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.util.ClassUtils;

import javax.persistence.*;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Table(name = "owl_trace_log")
//@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "tracelog")
public class TraceLog extends AbstractAuditingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "traceLogSeqGenerator")
    @TableGenerator(name = "traceLogSeqGenerator"
        , table = "owl_sequence"
        , initialValue = 10000
        , pkColumnValue = "owl_trace_log"
        , pkColumnName = "seq_id"
        , valueColumnName = "seq_value"
        , allocationSize = 1)
    private Long id;

    @Column(name = "entity_id")
    private Long entityId;

    @Column(name = "entity_name")
    private String entityName;

    @Column(name = "entity_field")
    private String entityField;

    @Column(name = "persist_type")
    private String persistType;

    @Column(name = "old_value")
    private String oldValue;

    @Column(name = "new_value")
    private String newValue;

    @Column(name = "etc_value")
    private String etcValue;

    @Column(name = "reply_yn")
    @Type(type="yes_no")
    private Boolean replyYn = Boolean.FALSE;

    @Column(name = "attached_file_id")
    private Long attachedFileId;

    @OneToMany(mappedBy = "traceLog", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<TraceLogAttachedFile> traceLogAttachedFiles = new HashSet<>();

    @Column(name = "task_id")
    private Long taskId;

    @Column(name = "project_id")
    private Long projectId;

    @Transient
    private Traceable entity;

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

    public Set<TraceLogAttachedFile> getTraceLogAttachedFiles() {
        return traceLogAttachedFiles;
    }

    public void setTraceLogAttachedFiles(Set<TraceLogAttachedFile> traceLogAttachedFiles) {
        this.traceLogAttachedFiles = traceLogAttachedFiles;
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

    public Traceable getEntity() {
        return entity;
    }

    public void setEntity(Traceable entity) {
        this.entity = entity;
    }

    public TraceLogAttachedFile addAttachedFile(AttachedFile attachedFile) {

        if(attachedFile == null) {
            return null;
        }

        TraceLogAttachedFile taskAttachedFile = new TraceLogAttachedFile(this, attachedFile);

        this.traceLogAttachedFiles.add(taskAttachedFile);

        return taskAttachedFile;
    }

    public TraceLogAttachedFile findAttachedFile(Long attachedFileId) {
        return this.traceLogAttachedFiles.stream().filter(
            traceLogAttachedFile -> traceLogAttachedFile.getAttachedFile().getId().equals(attachedFileId)
        ).findFirst().get();
    }


    public TraceLog removeAttachedFile(Long attachedFileId) {

        TraceLogAttachedFile traceLogAttachedFile = this.findAttachedFile(attachedFileId);

        if(traceLogAttachedFile != null)
            this.traceLogAttachedFiles.remove(traceLogAttachedFile);

        return this;
    }

    public List<AttachedFile> getPlainAttachedFiles() {
        return traceLogAttachedFiles.stream().map(TraceLogAttachedFile::getAttachedFile).collect(Collectors.toList());
    }

    public static TraceLog builder(Traceable entity, String auditLogType) {

        TraceLog logRecord = new TraceLog();
        logRecord.setEntity(entity);
        logRecord.setEntityId(entity.getId());
        logRecord.setEntityName(ClassUtils.getShortName(entity.getClass()));
        logRecord.setPersistType(auditLogType);

        return logRecord;
    }
}
