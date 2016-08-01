package kr.wisestone.wms.web.rest.dto;

import kr.wisestone.wms.domain.AttachedFile;
import kr.wisestone.wms.domain.Task;
import kr.wisestone.wms.domain.TaskAttachedFile;

import java.io.Serializable;
import java.util.HashSet;
import java.util.List;
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

    private Long statusId;

    private String statusName;

    private Long assigneeId;

    private String assigneeName;

    private List<TaskAttachedFile> attachedFiles;

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

    public Long getStatusId() {
        return statusId;
    }

    public void setStatusId(Long codeId) {
        this.statusId = codeId;
    }

    public Long getAssigneeId() {
        return assigneeId;
    }

    public void setAssigneeId(Long assigneeId) {
        this.assigneeId = assigneeId;
    }

    public String getStatusName() {
        return statusName;
    }

    public void setStatusName(String statusName) {
        this.statusName = statusName;
    }

    public String getAssigneeName() {
        return assigneeName;
    }

    public void setAssigneeName(String assigneeName) {
        this.assigneeName = assigneeName;
    }

    public List<TaskAttachedFile> getAttachedFiles() {
        return attachedFiles;
    }

    public void setAttachedFiles(List<TaskAttachedFile> attachedFiles) {
        this.attachedFiles = attachedFiles;
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
