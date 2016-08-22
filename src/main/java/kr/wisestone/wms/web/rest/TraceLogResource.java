package kr.wisestone.wms.web.rest;

import com.codahale.metrics.annotation.Timed;
import kr.wisestone.wms.common.exception.CommonRuntimeException;
import kr.wisestone.wms.domain.TraceLog;
import kr.wisestone.wms.repository.TraceLogRepository;
import kr.wisestone.wms.service.TraceLogService;
import kr.wisestone.wms.web.rest.dto.TraceLogDTO;
import kr.wisestone.wms.web.rest.form.TraceLogForm;
import kr.wisestone.wms.web.rest.mapper.AttachedFileMapper;
import kr.wisestone.wms.web.rest.mapper.TraceLogMapper;
import kr.wisestone.wms.web.rest.util.HeaderUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.inject.Inject;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class TraceLogResource {

    private final Logger log = LoggerFactory.getLogger(TaskResource.class);

    @Inject
    private TraceLogRepository traceLogRepository;

    @Inject
    private TraceLogService traceLogService;

    @Inject
    private TraceLogMapper traceLogMapper;

    @Inject
    private AttachedFileMapper attachedFileMapper;

    /**
     * GET  /tasks : get all the tasks.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of tasks in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/trace-log",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<List<TraceLogDTO>> getTraceLog(@RequestParam(value = "entityId") Long entityId
                                                    , @RequestParam(value = "entityName") String entityName
                                                    , @RequestParam(value = "entityField", required = false) String entityField)
        throws URISyntaxException {
        log.debug("REST request to get a page of Tasks");

        List<TraceLogDTO> traceLogDTOs = traceLogService.findByEntityIdAndEntityName(entityId, entityName, entityField);

        return new ResponseEntity<>(traceLogDTOs, HttpStatus.OK);
    }

    @RequestMapping(value = "/trace-log",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<TraceLog> addTraceLog(TraceLogForm traceLogForm, MultipartHttpServletRequest request) throws URISyntaxException, IOException {
        log.debug("REST request to update TraceLog : {}", traceLogForm);

        List<MultipartFile> files = request.getFiles("file");

        TraceLog result = traceLogService.saveTraceLog(traceLogForm, files);

        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("task", result.getId().toString()))
            .body(result);
    }

    @RequestMapping(value = "/trace-log/update",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<TraceLog> updateTraceLog(TraceLogForm traceLogForm, MultipartHttpServletRequest request) throws URISyntaxException, IOException {
        log.debug("REST request to update TraceLog : {}", traceLogForm);

        List<MultipartFile> files = request.getFiles("file");

        TraceLog result = traceLogService.modifyTraceLog(traceLogForm, files);

        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("task", result.getId().toString()))
            .body(result);
    }

    @RequestMapping(value = "/trace-log/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteTraceLog(@PathVariable(value = "id") Long id) throws URISyntaxException, IOException {

        TraceLog origin = traceLogRepository.findOne(id);

        if(origin == null)
            throw new CommonRuntimeException("error.traceLog.notFound");

        traceLogRepository.delete(origin);

        return ResponseEntity.ok().headers(HeaderUtil.createEntitySingleDeletionAlert("traceLog", id.toString())).build();
    }
}
