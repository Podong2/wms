package kr.wisestone.wms.web.rest.form;

import kr.wisestone.wms.domain.TraceLog;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class TraceLogForm {

    private Long id;

    private String entityName;

    private Long entityId;

    private String contents;

    private List<Long> mentionIds = new ArrayList<>();

    private List<Long> removeAttachedFileIds = new ArrayList<>();

    public TraceLog bind() {
        TraceLog traceLog = new TraceLog();

        traceLog.setEntityName(this.getEntityName());
        traceLog.setEntityField("reply");
        traceLog.setEntityId(this.getEntityId());
        traceLog.setNewValue(this.getContents());
        traceLog.setPersistType("INSERT");
        traceLog.setReplyYn(Boolean.TRUE);

        if("Task".equalsIgnoreCase(this.getEntityName()))
            traceLog.setTaskId(this.getEntityId());
        else if("Project".equalsIgnoreCase(this.getEntityName()))
            traceLog.setProjectId(this.getEntityId());

        return traceLog;
    }
}
