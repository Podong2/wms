package kr.wisestone.wms.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A ProjectAttachedFile.
 */
@Entity
@Table(name = "owl_project_attached_file")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "projectattachedfile")
public class ProjectAttachedFile extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "projectAttachedFileSeqGenerator")
    @TableGenerator(name = "projectAttachedFileSeqGenerator"
        , table = "owl_sequence"
        , initialValue = 10000
        , pkColumnValue = "owl_project_attached_file_id"
        , pkColumnName = "seq_id"
        , valueColumnName = "seq_value"
        , allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    @JsonIgnore
    private Project project;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "attached_file_id")
    private AttachedFile attachedFile;

    public ProjectAttachedFile() {

    }

    public ProjectAttachedFile(Project project, AttachedFile attachedFile) {
        this.setProject(project);
        this.setAttachedFile(attachedFile);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
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
        ProjectAttachedFile projectAttachedFile = (ProjectAttachedFile) o;
        if(projectAttachedFile.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, projectAttachedFile.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "ProjectAttachedFile{" +
            "id=" + id +
            '}';
    }
}
