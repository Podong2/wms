package kr.wisestone.wms.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.util.ClassUtils;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "owl_trace_log")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "tracelog")
@Data
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
            traceLogAttachedFile -> traceLogAttachedFile.getId().equals(attachedFileId)
        ).findFirst().get();
    }


    public TraceLog removeAttachedFile(Long attachedFileId) {

        TraceLogAttachedFile traceLogAttachedFile = this.findAttachedFile(attachedFileId);

        if(traceLogAttachedFile != null)
            this.traceLogAttachedFiles.remove(traceLogAttachedFile);

        return this;
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
