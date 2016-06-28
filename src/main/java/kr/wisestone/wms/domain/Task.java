package kr.wisestone.wms.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A Task.
 */
@Entity
@Table(name = "owl_task")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "task")
public class Task extends AbstractAuditingEntity implements Serializable, Traceable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "taskSeqGenerator")
    @TableGenerator(name = "taskSeqGenerator"
        , table = "owl_sequence"
        , initialValue = 10000
        , pkColumnValue = "owl_task_id"
        , pkColumnName = "seq_id"
        , valueColumnName = "seq_value"
        , allocationSize = 1)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "due_date")
    private String dueDate;

    @Column(name = "contents")
    private String contents;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "severity_id")
    private Code severity;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<TaskAttachedFile> taskAttachedFiles = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "assignee_id")
    private User assignee;

    @Override
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

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public String getContents() {
        return contents;
    }

    public void setContents(String contents) {
        this.contents = contents;
    }

    public Code getSeverity() {
        return severity;
    }

    public void setSeverity(Code code) {
        this.severity = code;
    }

    public Set<TaskAttachedFile> getTaskAttachedFiles() {
        return taskAttachedFiles;
    }

    public void setTaskAttachedFiles(Set<TaskAttachedFile> taskAttachedFiles) {
        this.taskAttachedFiles = taskAttachedFiles;
    }

    public User getAssignee() {
        return assignee;
    }

    public void setAssignee(User assignee) {
        this.assignee = assignee;
    }

    @Override
    public TraceLog getTraceLog(String persisType) {

        TraceLog logRecord = TraceLog.builder(this, persisType);

        if (Traceable.PERSIST_TYPE_INSERT.equals(persisType)) {
            logRecord.setNewValue(this.getName());
        } else if (Traceable.PERSIST_TYPE_DELETE.equals(persisType)) {
            logRecord.setOldValue(this.getName());
        }

        return logRecord;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Task task = (Task) o;
        if(task.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, task.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Task{" +
            "id=" + id +
            ", name='" + name + "'" +
            ", dueDate='" + dueDate + "'" +
            ", contents='" + contents + "'" +
            '}';
    }

    public TaskAttachedFile addAttachedFile(AttachedFile attachedFile) {

        if(attachedFile == null) {
            return null;
        }

        TaskAttachedFile taskAttachedFile = new TaskAttachedFile(this, attachedFile);

        this.taskAttachedFiles.add(taskAttachedFile);

        return taskAttachedFile;
    }
}
