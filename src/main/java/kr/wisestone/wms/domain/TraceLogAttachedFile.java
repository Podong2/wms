package kr.wisestone.wms.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.*;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "owl_trace_log_attached_file")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "tracelogattachedfile")
public class TraceLogAttachedFile extends AbstractAuditingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "traceLogAttachedFileSeqGenerator")
    @TableGenerator(name = "traceLogAttachedFileSeqGenerator"
        , table = "owl_sequence"
        , initialValue = 10000
        , pkColumnValue = "owl_trace_log_attached_file_id"
        , pkColumnName = "seq_id"
        , valueColumnName = "seq_value"
        , allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trace_log_id")
    @JsonIgnore
    private TraceLog traceLog;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "attached_file_id")
    private AttachedFile attachedFile;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TraceLog getTraceLog() {
        return traceLog;
    }

    public void setTraceLog(TraceLog traceLog) {
        this.traceLog = traceLog;
    }

    public AttachedFile getAttachedFile() {
        return attachedFile;
    }

    public void setAttachedFile(AttachedFile attachedFile) {
        this.attachedFile = attachedFile;
    }
}
