package kr.wisestone.wms.web.rest.dto;

import lombok.Data;

@Data
public class TaskProgressWidgetDTO {

    private Long assignedTaskTotalCount = 0L;

    private Long createdTaskTotalCount = 0L;

    private Long watchedTaskTotalCount = 0L;

    private Long assignedTaskCompleteCount = 0L;

    private Long createdTaskCompleteCount = 0L;

    private Long watchedTaskCompleteCount = 0L;
}
