package kr.wisestone.wms.web.rest.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class TraceLogListInfoDTO {

    private List<TraceLogDTO> traceLogs = new ArrayList<>();

    private Boolean showMoreYn = Boolean.FALSE;

    public TraceLogListInfoDTO() {
    }

    public TraceLogListInfoDTO(List<TraceLogDTO> traceLogs, Integer traceLogDateCounts) {

        this.setTraceLogs(traceLogs);

        if(traceLogDateCounts != null && traceLogDateCounts > 2) {
            this.setShowMoreYn(Boolean.TRUE);
        }
    }
}
