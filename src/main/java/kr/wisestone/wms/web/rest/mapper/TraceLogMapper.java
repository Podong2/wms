package kr.wisestone.wms.web.rest.mapper;

import kr.wisestone.wms.domain.TraceLog;
import kr.wisestone.wms.web.rest.dto.TraceLogDTO;
import org.mapstruct.Mapper;

import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;

/**
 * Mapper for the entity Task and its DTO TaskDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface TraceLogMapper {

    TraceLogDTO traceLogToTraceLogDTO(TraceLog traceLog);

    List<TraceLogDTO> traceLogsToTraceLogDTOs(List<TraceLog> traceLogs);

    TraceLog traceLogDTOToTraceLog(TraceLogDTO traceLogDTO);

    List<TraceLog> traceLogDTOsToTraceLogs(List<TraceLogDTO> traceLogDTOs);

    default Date zonedDateTimeToDate(ZonedDateTime dateTime) {

        if (dateTime == null) {
            return null;
        }

        return Date.from(dateTime.toInstant());
    }
}
