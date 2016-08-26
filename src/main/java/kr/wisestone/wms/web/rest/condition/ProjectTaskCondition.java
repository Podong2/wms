package kr.wisestone.wms.web.rest.condition;

import lombok.Data;

@Data
public class ProjectTaskCondition {

    public static final String LIST_TYPE_WEEK = "WEEK";
    public static final String LIST_TYPE_DELAYED = "DELAYED";
    public static final String LIST_TYPE_TOTAL = "TOTAL";

    private Long projectId;

    private String listType = LIST_TYPE_TOTAL;

    private String startDate;

    private String endDate;

    private Boolean importantYn;

    private Long statusId;
}
