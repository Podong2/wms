package kr.wisestone.wms.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.google.common.collect.Lists;
import com.mysema.query.BooleanBuilder;
import kr.wisestone.wms.domain.QTraceLog;
import kr.wisestone.wms.domain.Task;
import kr.wisestone.wms.domain.TraceLog;
import kr.wisestone.wms.repository.TraceLogRepository;
import kr.wisestone.wms.web.rest.condition.TaskCondition;
import kr.wisestone.wms.web.rest.dto.TaskDTO;
import kr.wisestone.wms.web.rest.util.PaginationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class TraceLogResource {

    private final Logger log = LoggerFactory.getLogger(TaskResource.class);

    @Inject
    private TraceLogRepository traceLogRepository;

    /**
     * GET  /tasks : get all the tasks.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of tasks in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/trace-log/findByTask",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<List<TraceLog>> getTraceLog(@RequestParam(value = "entityId") Long entityId
                                                    , @RequestParam(value = "entityName") String entityName)
        throws URISyntaxException {
        log.debug("REST request to get a page of Tasks");

        QTraceLog $traceLog = QTraceLog.traceLog;

        BooleanBuilder predicate = new BooleanBuilder();
        predicate.and($traceLog.entityName.eq(entityName));
        predicate.and($traceLog.entityId.eq(entityId));

        List<TraceLog> traceLogs = Lists.newArrayList(traceLogRepository.findAll(predicate, $traceLog.createdDate.asc()));

        return new ResponseEntity<>(traceLogs, HttpStatus.OK);
    }
}
