package kr.wisestone.wms.web.rest.condition;

import lombok.Data;

@Data
public class TraceLogCondition {

    private Long entityId;

    private String entityName;

    private String entityField;

    private Boolean recentYn = Boolean.TRUE;

    private Long offset;

    private Long limit;
}
