package kr.wisestone.wms.web.rest.condition;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class TaskCondition {

    public static final String LIST_TYPE_TODAY = "TODAY";
    public static final String LIST_TYPE_SCHEDULED = "SCHEDULED";
    public static final String LIST_TYPE_HOLD = "HOLD";
    public static final String LIST_TYPE_COMPLETE = "COMPLETE";


    private String name;

    private String endDateFrom;

    private String endDateTo;

    private List<Long> severities = new ArrayList<>();

    private String contents;

    private List<Long> assignees = new ArrayList<>();

    private String listType = LIST_TYPE_TODAY;
}
