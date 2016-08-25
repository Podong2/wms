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

    private Long getTaskCompleteCount(List<TaskDTO> tasks) {

        String thisMonth = DateUtil.convertDateToStr(new Date(), "yyyy-MM");

        return tasks.stream().filter(taskDTO -> {

            Date lastModifiedDate = Date.from(taskDTO.getLastModifiedDate().toInstant());
            String lastModifiedMonth = DateUtil.convertDateToStr(lastModifiedDate, "yyyy-MM");

            return lastModifiedMonth.equals(thisMonth) && taskDTO.getStatusId().equals(2L);
        }).count();
    }

    public Long getAssignedTaskCompleteCount() {
        return this.getTaskCompleteCount(this.assignedTasks);
    }

    public Long getWatchedTaskCompleteCount() {
        return this.getTaskCompleteCount(this.watchedTasks);
    }

    public Long getCreatedTaskCompleteCount() {
        return this.getTaskCompleteCount(this.createdTasks);
    }
}
