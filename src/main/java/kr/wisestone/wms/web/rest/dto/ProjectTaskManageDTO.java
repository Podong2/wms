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

    public ProjectTaskManageDTO() {
    }

    public ProjectTaskManageDTO(ProjectDTO projectDTO, List<TaskDTO> tasks) {
        this.tasks = tasks;
        this.project = projectDTO;

        /*

        String statusGroup = "IN_PROGRESS";

        if(projectTaskCondition.getListType().equalsIgnoreCase(ProjectTaskCondition.LIST_TYPE_WEEK)
            || projectTaskCondition.getListType().equalsIgnoreCase(ProjectTaskCondition.LIST_TYPE_TOTAL)) {

            if(StringUtils.isEmpty(taskDTO.getEndDate())) {
                statusGroup = "NONE_SCHEDULED";
            } else {
                String today = DateUtil.getTodayWithYYYYMMDD();
                String createdDate = DateUtil.convertDateToYYYYMMDD(Date.from(taskDTO.getCreatedDate().toInstant()));

                if(taskDTO.getEndDate().equals(today)) {
                    statusGroup = "SCHEDULED_TODAY";
                } else if(DateUtil.convertStrToDate(taskDTO.getEndDate(), "yyyy-MM-dd").getTime() < DateUtil.convertStrToDate(today, "yyyy-MM-dd").getTime()) {
                    statusGroup = "DELAYED";
                }

                if(createdDate.equals(today)) {
                    statusGroup = "REGISTERED_TODAY";
                }
            }
        }

         */

        Long completeCount = tasks.stream().filter(
            taskDTO
                -> taskDTO.getStatusId().equals(Task.STATUS_COMPLETE)
        ).count();

        Long holdCount = tasks.stream().filter(
            taskDTO
                -> taskDTO.getStatusId().equals(Task.STATUS_HOLD)
        ).count();

        Long delayedCount = tasks.stream().filter(
            taskDTO
                -> taskDTO.getStatusGroup().equals("DELAYED")
        ).count();

        Long inProgressCount = tasks.stream().filter(
            taskDTO
                -> taskDTO.getStatusGroup().equals("REGISTERED_TODAY")
                || taskDTO.getStatusGroup().equals("SCHEDULED_TODAY")
                || taskDTO.getStatusGroup().equals("IN_PROGRESS")
                || taskDTO.getStatusGroup().equals("NONE_SCHEDULED")
        ).count();

        this.completeCount = completeCount;
        this.holdCount = holdCount;
        this.delayedCount = delayedCount;
        this.inProgressCount = inProgressCount;
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
}
