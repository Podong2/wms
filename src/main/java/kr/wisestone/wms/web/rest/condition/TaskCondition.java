package kr.wisestone.wms.web.rest.condition;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class TaskCondition {
    private String name;

    private String dueDateFrom;

    private String dueDateTo;

    private List<Long> severities = new ArrayList<>();

    private String contents;

    private List<Long> assignees = new ArrayList<>();
}
