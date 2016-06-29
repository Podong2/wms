package kr.wisestone.wms.web.rest.form;

import kr.wisestone.wms.domain.Code;
import kr.wisestone.wms.domain.Task;
import kr.wisestone.wms.domain.User;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class TaskForm {

    private Long id;

    private String name;

    private String dueDate;

    private String contents;

    private Long severityId;

    private Long assigneeId;

    private List<Long> removeTargetFiles = new ArrayList<>();

    public Task bind(Task task) {

        task.setName(this.name);
        task.setDueDate(this.dueDate);
        task.setContents(this.contents);

        Code severity = new Code();
        severity.setId(this.severityId);
        task.setSeverity(severity);

        User assignee = new User();
        assignee.setId(this.assigneeId);
        task.setAssignee(assignee);

        return task;
    }
}
