package kr.wisestone.wms.web.rest.mapper;

import com.google.common.base.Function;
import com.google.common.collect.Iterables;
import kr.wisestone.wms.domain.AttachedFile;
import kr.wisestone.wms.domain.TraceLog;
import kr.wisestone.wms.domain.TraceLogAttachedFile;
import kr.wisestone.wms.web.rest.dto.TraceLogDTO;
import org.mapstruct.Mapper;

import javax.annotation.Nullable;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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
