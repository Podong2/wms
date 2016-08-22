package kr.wisestone.wms.service;

import com.google.common.collect.Lists;
import com.mysema.query.BooleanBuilder;
import kr.wisestone.wms.common.exception.CommonRuntimeException;
import kr.wisestone.wms.domain.AttachedFile;
import kr.wisestone.wms.domain.QTraceLog;
import kr.wisestone.wms.domain.TraceLog;
import kr.wisestone.wms.domain.TraceLogAttachedFile;
import kr.wisestone.wms.repository.TraceLogRepository;
import kr.wisestone.wms.web.rest.dto.AttachedFileDTO;
import kr.wisestone.wms.web.rest.dto.TraceLogDTO;
import kr.wisestone.wms.web.rest.form.TraceLogForm;
import kr.wisestone.wms.web.rest.mapper.AttachedFileMapper;
import kr.wisestone.wms.web.rest.mapper.TraceLogMapper;
import org.flywaydb.core.internal.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("unused")
public class TraceLogService {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private TraceLogRepository traceLogRepository;

    @Inject
    private AttachedFileService attachedFileService;

    @Inject
    private TraceLogMapper traceLogMapper;

    @Inject
    private AttachedFileMapper attachedFileMapper;

    @Transactional(readOnly = true)
    public List<TraceLogDTO> findByEntityIdAndEntityName(Long entityId, String entityName, String entityField) {
        QTraceLog $traceLog = QTraceLog.traceLog;

        BooleanBuilder predicate = new BooleanBuilder();
        predicate.and($traceLog.entityName.eq(entityName));
        predicate.and($traceLog.entityId.eq(entityId));

        if(StringUtils.hasText(entityField)) {
            predicate.and($traceLog.entityField.eq(entityField));
        }

        List<TraceLogDTO> traceLogDTOs = this.findByPredicate($traceLog, predicate);

        return traceLogDTOs;
    }

    public List<TraceLogDTO> findByEntityIdAndEntityNameAndAttachedFileIsNotNull(Long entityId, String entityName) {

        QTraceLog $traceLog = QTraceLog.traceLog;

        BooleanBuilder predicate = new BooleanBuilder();
        predicate.and($traceLog.entityName.eq(entityName));
        predicate.and($traceLog.entityId.eq(entityId));
        predicate.and($traceLog.traceLogAttachedFiles.isNotEmpty());

        List<TraceLogDTO> traceLogDTOs = this.findByPredicate($traceLog, predicate);

        return traceLogDTOs;
    }

    private List<TraceLogDTO> findByPredicate(QTraceLog $traceLog, BooleanBuilder predicate) {
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
        return traceLogDTOs;
    }

    @Transactional
    public void save(TraceLog logRecord) {
        this.entityManager.persist(logRecord);
    }

    @Transactional
    public void remove(TraceLog logRecord) {
        this.entityManager.persist(logRecord);
    }

    @Transactional
    public TraceLog saveTraceLog(TraceLogForm traceLogForm, List<MultipartFile> files) {

        TraceLog traceLog = traceLogForm.bind();

        for(MultipartFile multipartFile : files) {

            AttachedFile attachedFile = this.attachedFileService.saveFile(multipartFile);

            traceLog.addAttachedFile(attachedFile);
        }

        traceLog = traceLogRepository.save(traceLog);

        return traceLog;
    }

    @Transactional
    public TraceLog modifyTraceLog(TraceLogForm traceLogForm, List<MultipartFile> files) {

        TraceLog origin = traceLogRepository.findOne(traceLogForm.getId());

        origin.setNewValue(traceLogForm.getContents());

        for(MultipartFile multipartFile : files) {

            AttachedFile attachedFile = this.attachedFileService.saveFile(multipartFile);

            origin.addAttachedFile(attachedFile);
        }

        if(!traceLogForm.getRemoveAttachedFileIds().isEmpty()) {

            for(Long targetFileId : traceLogForm.getRemoveAttachedFileIds()) {

                origin.removeAttachedFile(targetFileId);
            }
        }

        origin = traceLogRepository.save(origin);

        return origin;
    }

    public TraceLog findOne(Long traceLogId) {

        if(traceLogId == null)
            throw new CommonRuntimeException("error.traceLog.targetIdIsNull");

        return traceLogRepository.findOne(traceLogId);
    }
}
