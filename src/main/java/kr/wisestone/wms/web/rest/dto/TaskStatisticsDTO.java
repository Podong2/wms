package kr.wisestone.wms.web.rest.dto;

import lombok.Data;

@Data
public class TaskStatisticsDTO {

    private Long totalCount;

    private Long templateCount;

    private Long assignedCount;

    private Long assignedCompleteCount;

    private Long createdCount;

    private Long createdCompleteCount;

    private Long watchedCount;

    private Long watchedCompleteCount;
}
