package kr.wisestone.wms.web.rest.form;

import kr.wisestone.wms.domain.*;
import kr.wisestone.wms.web.rest.dto.TaskRepeatScheduleDTO;
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

    private Long projectId;

    private Long statusId;

    private Long assigneeId;

    private Boolean importantYn = Boolean.FALSE;

    private List<Long> projectIds = new ArrayList<>();

    private List<Long> assigneeIds = new ArrayList<>();

    private List<Long> watcherIds = new ArrayList<>();

    private List<Long> relatedTaskIds = new ArrayList<>();

    private List<Long> removeProjectIds = new ArrayList<>();

    private List<Long> removeAssigneeIds = new ArrayList<>();

    private List<Long> removeWatcherIds = new ArrayList<>();

    private List<Long> removeRelatedTaskIds = new ArrayList<>();

    private List<Long> removeTargetFiles = new ArrayList<>();

    private TaskRepeatScheduleDTO taskRepeatSchedule;

    public Task bind(Task task) {

        if(StringUtils.hasText(this.name))
            task.setName(this.name);

        Period period = task.getPeriod();

        if("null".equalsIgnoreCase(this.startDate)) {
            this.startDate = "";
        }

        if("null".equalsIgnoreCase(this.endDate)) {
            this.endDate = "";
        }

        if(period == null) {
            period = new Period(this.startDate, this.endDate);
        } else {
            period.setStartDate(this.startDate);
            period.setEndDate(this.endDate);
        }

        task.setPeriod(period);

        if(StringUtils.hasText(this.contents))
            task.setContents(this.contents);

        task.setImportantYn(importantYn);

        if(this.statusId != null) {
            Code status = new Code();
            status.setId(this.statusId);
            task.setStatus(status);
        } else {
            Code status = new Code();
            status.setId(Task.STATUS_ACTIVE);
            task.setStatus(status);
        }

        if(this.projectId != null) {
            Project project = new Project();
            project.setId(this.projectId);

            task.addTaskProject(project);
        }

        for(Long id : getProjectIds()) {
            Project project = new Project();
            project.setId(id);

            task.addTaskProject(project);
        }

        for(Long id : getRemoveProjectIds()) {
            Project project = new Project();
            project.setId(id);

            task.removeTaskProject(project);
        }

        for(Long id : getAssigneeIds()) {
            User user = new User();
            user.setId(id);

            task.addTaskUser(user, UserType.ASSIGNEE);
        }

        for(Long id : getRemoveAssigneeIds()) {
            User user = new User();
            user.setId(id);

            task.removeTaskUser(user, UserType.ASSIGNEE);
        }

        for(Long id : getWatcherIds()) {
            User user = new User();
            user.setId(id);

            task.addTaskUser(user, UserType.WATCHER);
        }


        for(Long id : getRemoveWatcherIds()) {
            User user = new User();
            user.setId(id);

            task.removeTaskUser(user, UserType.WATCHER);
        }

        for(Long id : getRelatedTaskIds()) {
            Task relatedTask = new Task();
            relatedTask.setId(id);

            task.addRelatedTask(relatedTask);
        }

        for(Long id : getRemoveRelatedTaskIds()) {
            Task relatedTask = new Task();
            relatedTask.setId(id);

            task.removeRelatedTask(relatedTask);
        }


        if(this.taskRepeatSchedule != null) {

            TaskRepeatSchedule taskRepeatSchedule = task.getTaskRepeatSchedule();

            if(taskRepeatSchedule == null) {
                taskRepeatSchedule = new TaskRepeatSchedule(task, this.taskRepeatSchedule);
            } else {
                taskRepeatSchedule.update(this.taskRepeatSchedule);
            }

            task.setTaskRepeatSchedule(taskRepeatSchedule);
        }

        return task;
    }

    public Task bindSubTask(Task subTask) {

        if(StringUtils.hasText(this.getName()))
            subTask.setName(this.getName());

        Period period = subTask.getPeriod();

        if("null".equalsIgnoreCase(this.startDate)) {
            this.startDate = "";
        }

        if("null".equalsIgnoreCase(this.endDate)) {
            this.endDate = "";
        }

        if(period == null) {
            period = new Period(this.startDate, this.endDate);
        } else {
            period.setStartDate(this.startDate);
            period.setEndDate(this.endDate);
        }

        subTask.setPeriod(period);

        Code status = new Code();
        status.setId(Task.STATUS_ACTIVE);
        subTask.setStatus(status);

        Task parent = new Task();
        parent.setId(this.getParentId());
        subTask.setParent(parent);

        if(this.getAssigneeId() != null) {
            User assignee = new User();
            assignee.setId(this.getAssigneeId());
            subTask.addTaskUser(assignee, UserType.ASSIGNEE);
        }

        for(Long id : getAssigneeIds()) {
            User user = new User();
            user.setId(id);

            subTask.addTaskUser(user, UserType.ASSIGNEE);
        }

        return subTask;
    }
}
