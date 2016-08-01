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

    private String startDate;

    private String endDate;

    private String contents;

    private Long statusId;

    private Long assigneeId;

    private List<Long> removeTargetFiles = new ArrayList<>();

    public Task bind(Task task) {

        task.setName(this.name);
        task.setStartDate(this.startDate);
        task.setEndDate(this.endDate);
        task.setContents(this.contents);

        Code status = new Code();
        status.setId(this.statusId);
        task.setStatus(status);

        User assignee = new User();
        assignee.setId(this.assigneeId);
        task.setAssignee(assignee);

        return task;
    }
}
