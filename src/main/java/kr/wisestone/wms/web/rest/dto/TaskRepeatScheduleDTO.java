package kr.wisestone.wms.web.rest.dto;

import kr.wisestone.wms.domain.TaskRepeatSchedule;
import lombok.Data;
import org.springframework.util.StringUtils;

@Data
public class TaskRepeatScheduleDTO {

    private Long id;

    private Boolean repeatYn;

    private String repeatType;

    private String weekdays;

    private String monthlyCriteria;

    private String adventDateStartTime;

    private String startDate;

    private String endDate;

    private Boolean permanentYn;

    public TaskRepeatScheduleDTO() {}

    public TaskRepeatScheduleDTO(TaskRepeatSchedule taskRepeatSchedule) {

        this.setId(taskRepeatSchedule.getId());
        this.setRepeatYn(taskRepeatSchedule.getRepeatYn());
        this.setRepeatType(taskRepeatSchedule.getRepeatType());
        this.setWeekdays(taskRepeatSchedule.getWeekdays());
        this.setMonthlyCriteria(taskRepeatSchedule.getMonthlyCriteria());
        this.setAdventDateStartTime(taskRepeatSchedule.getAdventDateStartTime());
        this.setStartDate(taskRepeatSchedule.getStartDate());
        this.setEndDate(taskRepeatSchedule.getEndDate());
        this.setPermanentYn(taskRepeatSchedule.getPermanentYn());
    }
}
