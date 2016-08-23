package kr.wisestone.wms.web.rest.dto;

import kr.wisestone.wms.domain.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class TaskSnapshotDTO {

    private Boolean importantYn;

    private String name;

    private String contents;

    private Long parentId;

    private List<Long> projectIds = new ArrayList<>();

    private List<Long> assigneeIds = new ArrayList<>();

    private List<Long> watcherIds = new ArrayList<>();

    private List<Long> attachedFileIds = new ArrayList<>();

    private List<Long> relatedTaskIds = new ArrayList<>();


    public TaskSnapshotDTO() {}

    public TaskSnapshotDTO(Task task) {

        this.setImportantYn(task.getImportantYn());
        this.setName(task.getName());
        this.setContents(task.getContents());

        if(task.getParent() != null) {
            this.setParentId(task.getParent().getId());
        }

        if(task.getTaskProjects() != null && !task.getTaskProjects().isEmpty()) {
            List<Long> projectIds = task.getPlainTaskProject().stream().map(Project::getId).collect(Collectors.toList());
            this.setProjectIds(projectIds);
        }

        List<User> assignees = task.findTaskUsersByType(UserType.ASSIGNEE);
        List<User> watchers = task.findTaskUsersByType(UserType.WATCHER);

        if(assignees != null && !assignees.isEmpty()) {
            List<Long> assigneeIds = assignees.stream().map(User::getId).collect(Collectors.toList());
            this.setAssigneeIds(assigneeIds);
        }

        if(watchers != null && !watchers.isEmpty()) {
            List<Long> watcherIds = watchers.stream().map(User::getId).collect(Collectors.toList());
            this.setWatcherIds(watcherIds);
        }

        List<AttachedFile> taskAttachedFiles = task.getPlainTaskAttachedFiles();

        if(taskAttachedFiles != null && !taskAttachedFiles.isEmpty()) {
            List<Long> attachedFileIds = taskAttachedFiles.stream().map(AttachedFile::getId).collect(Collectors.toList());
            this.setAssigneeIds(attachedFileIds);
        }

        List<Task> relatedTasks = task.getPlainRelatedTask();

        if(relatedTasks != null && !relatedTasks.isEmpty()) {
            List<Long> relatedTaskIds = relatedTasks.stream().map(Task::getId).collect(Collectors.toList());
            this.setRelatedTaskIds(relatedTaskIds);
        }
    }
}
