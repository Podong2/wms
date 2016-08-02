package kr.wisestone.wms.web.rest.form;

import kr.wisestone.wms.domain.Code;
import kr.wisestone.wms.domain.Task;
import kr.wisestone.wms.domain.TaskUserType;
import kr.wisestone.wms.domain.User;
import lombok.Data;
import org.flywaydb.core.internal.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

@Data
public class TaskForm {

    private Long id;

    private String name;

    private String startDate;

    private String endDate;

    private String contents;

    private Long parentId;

    private Long statusId;

    private Long assigneeId;

    private Boolean importantYn = Boolean.FALSE;

    private List<Long> assigneeIds = new ArrayList<>();

    private List<Long> watcherIds = new ArrayList<>();

    private List<Long> removeTargetFiles = new ArrayList<>();

    private List<Long> relatedTaskIds = new ArrayList<>();

    public Task bind(Task task) {

        task.setName(this.name);

        if(StringUtils.hasText(this.startDate))
            task.setStartDate(this.startDate);

        if(StringUtils.hasText(this.endDate))
            task.setEndDate(this.endDate);

        if(StringUtils.hasText(this.contents))
            task.setContents(this.contents);

        task.setImportantYn(importantYn);

        if(this.statusId != null) {
            Code status = new Code();
            status.setId(this.statusId);
            task.setStatus(status);
        }

        for(Long id : getAssigneeIds()) {
            User user = new User();
            user.setId(id);

            task.addTaskUser(user, TaskUserType.ASSIGNEE);
        }

        for(Long id : getWatcherIds()) {
            User user = new User();
            user.setId(id);

            task.addTaskUser(user, TaskUserType.WATCHER);
        }

        for(Long id : getRelatedTaskIds()) {
            Task relatedTask = new Task();
            relatedTask.setId(id);

            task.addRelatedTask(task);
        }

        return task;
    }

    public Task bindSubTask(Task subTask) {

        subTask.setName(this.getName());

        Task parent = new Task();
        parent.setId(this.getParentId());
        subTask.setParent(parent);

        User assignee = new User();
        assignee.setId(this.getAssigneeId());
        subTask.addTaskUser(assignee, TaskUserType.ASSIGNEE);

        return subTask;
    }
}
