package kr.wisestone.wms.web.rest.dto;

import lombok.Data;

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
}
