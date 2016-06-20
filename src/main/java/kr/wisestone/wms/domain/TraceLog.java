package kr.wisestone.wms.domain;

import lombok.Data;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.util.ClassUtils;

import javax.persistence.*;

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

    @Transient
    private Traceable entity;

    public static TraceLog builder(Traceable entity, String auditLogType) {

        TraceLog logRecord = new TraceLog();
        logRecord.setEntity(entity);
        logRecord.setEntityId(entity.getId());
        logRecord.setEntityName(ClassUtils.getShortName(entity.getClass()));
        logRecord.setEntityField("");
        logRecord.setPersistType(auditLogType);
        logRecord.setOldValue("");
        logRecord.setNewValue("");

        return logRecord;
    }
}
