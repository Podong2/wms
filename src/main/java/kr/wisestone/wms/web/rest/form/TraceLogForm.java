package kr.wisestone.wms.web.rest.form;

import kr.wisestone.wms.domain.TraceLog;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class TraceLogForm {

    private Long id;

    private Long taskId;

    private String contents;

    private List<Long> mentionIds = new ArrayList<>();

    public TraceLog bind() {
        TraceLog traceLog = new TraceLog();

        traceLog.setEntityName("Task");
        traceLog.setEntityField("reply");
        traceLog.setEntityId(this.getTaskId());
        traceLog.setNewValue(this.getContents());
        traceLog.setPersistType("INSERT");
        traceLog.setReplyYn(Boolean.TRUE);

        return traceLog;
    }
}
