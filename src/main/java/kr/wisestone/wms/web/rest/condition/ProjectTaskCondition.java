package kr.wisestone.wms.web.rest.condition;

import lombok.Data;

@Data
public class ProjectTaskCondition {

    public static final String LIST_TYPE_WEEK = "WEEK";
    public static final String LIST_TYPE_DELAYED = "DELAYED";
    public static final String LIST_TYPE_TOTAL = "TOTAL";

    public static final String STATUS_TYPE_ALL = "ALL";
    public static final String STATUS_TYPE_COMPLETE = "COMPLETE";
    public static final String STATUS_TYPE_DELAYED = "DELAYED";
    public static final String STATUS_TYPE_IN_PROGRESS = "IN_PROGRESS";
    public static final String STATUS_TYPE_HOLD = "HOLD";
    public static final String STATUS_TYPE_CANCEL = "CANCEL";

    public static final String ORDER_TYPE_IMPORTANT = "IMPORTANT";
    public static final String ORDER_TYPE_TASK_NAME = "TASK_NAME";

    private Long projectId;

    private String listType = LIST_TYPE_TOTAL;

    private String startDate;

    private String endDate;

    private Boolean importantYn;

    private Long statusId;

    private String orderType;

    private String statusType;

    private String taskName;

    private Long limit;

    private Long offset;
}
