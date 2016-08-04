package kr.wisestone.wms.domain;

import org.hibernate.annotations.*;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.util.ClassUtils;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "owl_related_task")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "relatedTask")
public class RelatedTask extends AbstractAuditingEntity implements Traceable {

    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "taskUserSeqGenerator")
    @TableGenerator(name = "taskUserSeqGenerator"
        , table = "owl_sequence"
        , initialValue = 10000
        , pkColumnValue = "owl_task_user_id"
        , pkColumnName = "seq_id"
        , valueColumnName = "seq_value"
        , allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "related_task_id")
    private Task relatedTask;

    public RelatedTask() {}

    public RelatedTask(Task task, Task relatedTask) {
        this.setTask(task);
        this.setRelatedTask(relatedTask);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public Task getRelatedTask() {
        return relatedTask;
    }

    public void setRelatedTask(Task relatedTask) {
        this.relatedTask = relatedTask;
    }

    @Override
    public TraceLog getTraceLog(String persisType) {

        TraceLog logRecord = TraceLog.builder(this, persisType);

        logRecord.setTaskId(this.getTask().getId());
        logRecord.setEntityName(ClassUtils.getShortName(this.getTask().getClass()));
        logRecord.setEntityField("relatedTasks");
        logRecord.setEntityId(this.getTask().getId());

        if (Traceable.PERSIST_TYPE_INSERT.equals(persisType)) {
            logRecord.setNewValue(this.getRelatedTask().getName());
        } else if (Traceable.PERSIST_TYPE_DELETE.equals(persisType)) {
            logRecord.setOldValue(this.getRelatedTask().getName());
        }

        return logRecord;
    }
}
