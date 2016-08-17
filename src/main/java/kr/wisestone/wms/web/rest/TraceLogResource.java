package kr.wisestone.wms.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.google.common.base.Function;
import com.google.common.collect.Iterables;
import com.google.common.collect.Lists;
import com.mysema.query.BooleanBuilder;
import kr.wisestone.wms.common.exception.CommonRuntimeException;
import kr.wisestone.wms.domain.AttachedFile;
import kr.wisestone.wms.domain.QTraceLog;
import kr.wisestone.wms.domain.TraceLog;
import kr.wisestone.wms.domain.TraceLogAttachedFile;
import kr.wisestone.wms.repository.TraceLogRepository;
import kr.wisestone.wms.service.TraceLogService;
import kr.wisestone.wms.web.rest.dto.AttachedFileDTO;
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

import javax.annotation.Nullable;
import javax.inject.Inject;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;

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
                                                    , @RequestParam(value = "entityName") String entityName)
        throws URISyntaxException {
        log.debug("REST request to get a page of Tasks");

        QTraceLog $traceLog = QTraceLog.traceLog;

        BooleanBuilder predicate = new BooleanBuilder();
        predicate.and($traceLog.entityName.eq(entityName));
        predicate.and($traceLog.entityId.eq(entityId));

        List<TraceLog> traceLogs = Lists.newArrayList(traceLogRepository.findAll(predicate, $traceLog.createdDate.asc()));

        List<TraceLogDTO> traceLogDTOs = Lists.newArrayList();

        for(TraceLog traceLog : traceLogs) {

            TraceLogDTO traceLogDTO = traceLogMapper.traceLogToTraceLogDTO(traceLog);

            List<AttachedFileDTO> attachedFileDTOs = attachedFileMapper.attachedFilesToAttachedFileDTOs(
                    traceLog.getTraceLogAttachedFiles().stream().map(TraceLogAttachedFile::getAttachedFile).collect(Collectors.toList())
            );

            traceLogDTO.setAttachedFiles(attachedFileDTOs);

            traceLogDTOs.add(traceLogDTO);
        }

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
