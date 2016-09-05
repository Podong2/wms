package kr.wisestone.wms.web.rest.condition;

import lombok.Data;

@Data
public class ProjectTaskCondition {

    public static final String LIST_TYPE_WEEK = "WEEK";
    public static final String LIST_TYPE_DELAYED = "DELAYED";
    public static final String LIST_TYPE_TOTAL = "TOTAL";

    public static final String ORDER_TYPE_IMPORTANT = "IMPORTANT";
    public static final String ORDER_TYPE_TASK_NAME = "TASK_NAME";

    private Long projectId;

    private String listType = LIST_TYPE_TOTAL;

    private String startDate;

    private String endDate;

    private Boolean importantYn;

    private Long statusId;

    private String orderType;
}
