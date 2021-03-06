package kr.wisestone.wms.web.rest.dto;

import kr.wisestone.wms.domain.Task;

import java.util.ArrayList;
import java.util.List;

public class ProjectTaskManageDTO {

    private List<TaskDTO> tasks = new ArrayList<>();

    private ProjectDTO project = new ProjectDTO();

    private Long completeCount;

    private Long inProgressCount;

    private Long delayedCount;

    private Long holdCount;

    private Long cancelCount;

    private Integer progressRate;

    public ProjectTaskManageDTO() {
    }

    public ProjectTaskManageDTO(ProjectDTO projectDTO, List<TaskDTO> tasks, int progressRate) {
        this.tasks = tasks;
        this.project = projectDTO;

        Long completeCount = tasks.stream().filter(
            taskDTO
                -> taskDTO.getStatusId().equals(Task.STATUS_COMPLETE)
        ).count();

        Long holdCount = tasks.stream().filter(
            taskDTO
                -> taskDTO.getStatusId().equals(Task.STATUS_HOLD)
        ).count();

        Long cancelCount = tasks.stream().filter(
            taskDTO
                -> taskDTO.getStatusId().equals(Task.STATUS_CANCEL)
        ).count();

        Long delayedCount = tasks.stream().filter(
            taskDTO
                -> !taskDTO.getStatusId().equals(Task.STATUS_CANCEL) && !taskDTO.getStatusId().equals(Task.STATUS_HOLD)
                    && !taskDTO.getStatusId().equals(Task.STATUS_COMPLETE) && taskDTO.getDelayYn()
        ).count();

        Long totalCount = (long) tasks.size();

        Long inProgressCount = totalCount - (completeCount + holdCount + delayedCount + cancelCount);

        this.completeCount = completeCount;
        this.holdCount = holdCount;
        this.delayedCount = delayedCount;
        this.cancelCount = cancelCount;
        this.inProgressCount = inProgressCount;

        this.progressRate = progressRate;
    }

    public List<TaskDTO> getTasks() {
        return tasks;
    }

    public void setTasks(List<TaskDTO> tasks) {
        this.tasks = tasks;
    }

    public ProjectDTO getProject() {
        return project;
    }

    public void setProject(ProjectDTO projectDTO) {
        this.project = projectDTO;
    }

    public Long getCompleteCount() {
        return completeCount;
    }

    public void setCompleteCount(Long completeCount) {
        this.completeCount = completeCount;
    }

    public Long getInProgressCount() {
        return inProgressCount;
    }

    public void setInProgressCount(Long inProgressCount) {
        this.inProgressCount = inProgressCount;
    }

    public Long getDelayedCount() {
        return delayedCount;
    }

    public void setDelayedCount(Long delayedCount) {
        this.delayedCount = delayedCount;
    }

    public Long getHoldCount() {
        return holdCount;
    }

    public void setHoldCount(Long holdCount) {
        this.holdCount = holdCount;
    }

    public Long getCancelCount() {
        return cancelCount;
    }

    public void setCancelCount(Long cancelCount) {
        this.cancelCount = cancelCount;
    }

    public Integer getProgressRate() {
        return progressRate;
    }

    public void setProgressRate(Integer progressRate) {
        this.progressRate = progressRate;
    }
}
