package kr.wisestone.wms.web.rest.dto;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;


/**
 * A DTO for the Task entity.
 */
public class TaskDTO implements Serializable {

    private Long id;

    private String name;

    private String dueDate;

    private String contents;


    private Long severityId;
    
    private Long taskAttachedFilesId;
    
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

    public Long getSeverityId() {
        return severityId;
    }

    public void setSeverityId(Long codeId) {
        this.severityId = codeId;
    }

    public Long getTaskAttachedFilesId() {
        return taskAttachedFilesId;
    }

    public void setTaskAttachedFilesId(Long taskAttachedFileId) {
        this.taskAttachedFilesId = taskAttachedFileId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        TaskDTO taskDTO = (TaskDTO) o;

        if ( ! Objects.equals(id, taskDTO.id)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "TaskDTO{" +
            "id=" + id +
            ", name='" + name + "'" +
            ", dueDate='" + dueDate + "'" +
            ", contents='" + contents + "'" +
            '}';
    }
}
