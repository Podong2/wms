package kr.wisestone.wms.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A TaskAttachedFile.
 */
@Entity
@Table(name = "owl_task_attached_file")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "taskattachedfile")
public class TaskAttachedFile extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "taskAttachedFileSeqGenerator")
    @TableGenerator(name = "taskAttachedFileSeqGenerator"
        , table = "owl_sequence"
        , initialValue = 10000
        , pkColumnValue = "owl_task_attached_file_id"
        , pkColumnName = "seq_id"
        , valueColumnName = "seq_value"
        , allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "task_id")
    @JsonIgnore
    private Task task;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "attached_file_id")
    private AttachedFile attachedFile;

    public TaskAttachedFile() {

    }

    public TaskAttachedFile(Task task, AttachedFile attachedFile) {
        this.setTask(task);
        this.setAttachedFile(attachedFile);
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

    public AttachedFile getAttachedFile() {
        return attachedFile;
    }

    public void setAttachedFile(AttachedFile attachedFile) {
        this.attachedFile = attachedFile;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        TaskAttachedFile taskAttachedFile = (TaskAttachedFile) o;
        if(taskAttachedFile.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, taskAttachedFile.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "TaskAttachedFile{" +
            "id=" + id +
            '}';
    }
}
