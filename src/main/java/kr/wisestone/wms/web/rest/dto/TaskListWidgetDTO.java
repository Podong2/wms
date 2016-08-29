package kr.wisestone.wms.web.rest.dto;

import kr.wisestone.wms.common.util.DateUtil;
import lombok.Data;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
public class TaskListWidgetDTO {

    private List<TaskDTO> repeatScheduledTasks = new ArrayList<>();

    private List<TaskDTO> assignedTasks = new ArrayList<>();

    private List<TaskDTO> createdTasks = new ArrayList<>();

    private List<TaskDTO> watchedTasks = new ArrayList<>();

    public void addRepeatScheduledTasks(TaskDTO taskDTO) {
        this.repeatScheduledTasks.add(taskDTO);
    }

    public void addAssignedTasks(TaskDTO taskDTO) {
        this.assignedTasks.add(taskDTO);
    }

    public void addCreatedTasks(TaskDTO taskDTO) {
        this.createdTasks.add(taskDTO);
    }

    public void addWatchedTasks(TaskDTO taskDTO) {
        this.watchedTasks.add(taskDTO);
    }
}
