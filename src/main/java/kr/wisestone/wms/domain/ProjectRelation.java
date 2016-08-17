package kr.wisestone.wms.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.util.ClassUtils;

import javax.persistence.*;

@Entity
@Table(name = "owl_project_relation")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "projectrelation")
public class ProjectRelation extends AbstractAuditingEntity implements Traceable {

    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "projectRelationSeqGenerator")
    @TableGenerator(name = "projectRelationSeqGenerator"
        , table = "owl_sequence"
        , initialValue = 10000
        , pkColumnValue = "owl_project_parent_id"
        , pkColumnName = "seq_id"
        , valueColumnName = "seq_value"
        , allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_id")
    private Project child;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Project parent;

    public ProjectRelation() {}

    public ProjectRelation(Project child, Project parent) {
        this.setChild(child);
        this.setParent(parent);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Project getChild() {
        return child;
    }

    public void setChild(Project child) {
        this.child = child;
    }

    public Project getParent() {
        return parent;
    }

    public void setParent(Project parent) {
        this.parent = parent;
    }

    @Override
    public TraceLog getTraceLog(String persisType) {

        TraceLog logRecord = TraceLog.builder(this, persisType);

        logRecord.setProjectId(this.getChild().getId());
        logRecord.setEntityName(ClassUtils.getShortName(this.getChild().getClass()));
        logRecord.setEntityField("projectRelation");
        logRecord.setEntityId(this.getChild().getId());

        if (Traceable.PERSIST_TYPE_INSERT.equals(persisType)) {
            logRecord.setNewValue(this.getParent().getName());
        } else if (Traceable.PERSIST_TYPE_DELETE.equals(persisType)) {
            logRecord.setOldValue(this.getParent().getName());
        }

        return logRecord;
    }
}
