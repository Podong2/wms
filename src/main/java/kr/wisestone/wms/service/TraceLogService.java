package kr.wisestone.wms.service;

import kr.wisestone.wms.domain.AttachedFile;
import kr.wisestone.wms.domain.Task;
import kr.wisestone.wms.domain.TraceLog;
import kr.wisestone.wms.repository.TraceLogRepository;
import kr.wisestone.wms.web.rest.form.TraceLogForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Service
@SuppressWarnings("unused")
public class TraceLogService {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private TraceLogRepository traceLogRepository;

    @Inject
    private AttachedFileService attachedFileService;

    @Transactional
    public void save(TraceLog logRecord) {
        this.entityManager.persist(logRecord);
    }

    @Transactional
    public void remove(TraceLog logRecord) {
        this.entityManager.persist(logRecord);
    }

    public TraceLog saveTraceLog(TraceLogForm traceLogForm, List<MultipartFile> files) {

        TraceLog traceLog = traceLogForm.bind();

        for(MultipartFile multipartFile : files) {

            AttachedFile attachedFile = this.attachedFileService.saveFile(multipartFile);

            traceLog.addAttachedFile(attachedFile);
        }

        traceLog = traceLogRepository.save(traceLog);

        return traceLog;
    }

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
}
