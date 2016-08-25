package kr.wisestone.wms.web.rest.dto;

import lombok.Data;

import java.util.List;

@Data
public class TaskListWidgetDTO {

    private List<TaskDTO> repeatScheduled;

    private List<TaskDTO> assigned;

    private List<TaskDTO> created;

    private List<TaskDTO> watched;
}
