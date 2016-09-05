package kr.wisestone.wms.service;

import com.google.common.collect.Lists;
import com.mysema.query.BooleanBuilder;
import com.mysema.query.jpa.JPASubQuery;
import kr.wisestone.wms.common.exception.CommonRuntimeException;
import kr.wisestone.wms.common.util.DateUtil;
import kr.wisestone.wms.domain.*;
import kr.wisestone.wms.repository.TraceLogRepository;
import kr.wisestone.wms.security.SecurityUtils;
import kr.wisestone.wms.web.rest.dto.AttachedFileDTO;
import kr.wisestone.wms.web.rest.dto.TraceLogDTO;
import kr.wisestone.wms.web.rest.form.TraceLogForm;
import kr.wisestone.wms.web.rest.mapper.AttachedFileMapper;
import kr.wisestone.wms.web.rest.mapper.TraceLogMapper;
import kr.wisestone.wms.web.rest.util.PaginationUtil;
import org.flywaydb.core.internal.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.Date;
import java.util.List;
import java.util.Optional;
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

    @Inject
    private TaskService taskService;

    @Inject
    private UserService userService;

    @Transactional(readOnly = true)
    public List<TraceLogDTO> findByEntityIdAndEntityName(Long entityId, String entityName, String entityField) {
        QTraceLog $traceLog = QTraceLog.traceLog;

        BooleanBuilder predicate = new BooleanBuilder();
        predicate.and($traceLog.entityName.eq(entityName));

        if("Task".equalsIgnoreCase(entityName)) {
            predicate.and($traceLog.taskId.eq(entityId));
        } else if("Project".equalsIgnoreCase(entityName)) {
            predicate.and($traceLog.projectId.eq(entityId));
        } else {
            predicate.and($traceLog.entityId.eq(entityId));
        }

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

        if("Task".equalsIgnoreCase(entityName)) {
            predicate.and($traceLog.taskId.eq(entityId));
        } else if("Project".equalsIgnoreCase(entityName)) {
            predicate.and($traceLog.projectId.eq(entityId));
        } else {
            predicate.and($traceLog.entityId.eq(entityId));
        }

        predicate.and($traceLog.traceLogAttachedFiles.isNotEmpty());

        List<TraceLogDTO> traceLogDTOs = this.findByPredicate($traceLog, predicate);

        return traceLogDTOs;
    }

    public TraceLog removeAttachedFileByEntityIdAndEntityNameAndAttachedFileId(Long entityId, String entityName, Long attachedFileId) {

        QTraceLog $traceLog = QTraceLog.traceLog;

        BooleanBuilder predicate = new BooleanBuilder();
        predicate.and($traceLog.entityName.eq(entityName));

        if("Task".equalsIgnoreCase(entityName)) {
            predicate.and($traceLog.taskId.eq(entityId));
        } else if("Project".equalsIgnoreCase(entityName)) {
            predicate.and($traceLog.projectId.eq(entityId));
        } else {
            predicate.and($traceLog.entityId.eq(entityId));
        }

        predicate.and($traceLog.traceLogAttachedFiles.any().attachedFile.id.eq(attachedFileId));

        TraceLog traceLog = this.traceLogRepository.findOne(predicate);

        traceLog.removeAttachedFile(attachedFileId);

        return this.traceLogRepository.save(traceLog);
    }

    private List<TraceLogDTO> findByPredicate(QTraceLog $traceLog, BooleanBuilder predicate) {
        List<TraceLog> traceLogs = Lists.newArrayList(traceLogRepository.findAll(predicate, $traceLog.createdDate.asc()));

        return this.convertTraceLogToDTO(traceLogs);
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

    @Transactional(readOnly = true)
    public Page<TraceLogDTO> findRecentTraceLog(Pageable pageable) {

        User loginUser = SecurityUtils.getCurrentUser();

        QTraceLog $traceLog = QTraceLog.traceLog;
        QTask $task = QTask.task;

        Date yesterday = DateUtil.addDays(new Date(), -1);

        BooleanBuilder predicate = new BooleanBuilder();

        predicate.and($traceLog.entityName.eq("Task"));
        predicate.and($traceLog.taskId.in(new JPASubQuery()
                    .from($task)
                    .where($task.taskUsers.any().user.login.eq(loginUser.getLogin()).or($task.createdBy.eq(loginUser.getLogin())))
                    .list($task.id)));

        predicate.and($traceLog.createdDate.goe(DateUtil.convertToZonedDateTime(yesterday)));

        Page<TraceLog> result = traceLogRepository.findAll(predicate, PaginationUtil.applySort(pageable, Sort.Direction.DESC, "createdDate"));

        List<TraceLogDTO> traceLogDTOs = convertTraceLogToDTO(result.getContent());

        return new PageImpl<>(traceLogDTOs, pageable, result.getTotalElements());
    }

    private List<TraceLogDTO> convertTraceLogToDTO(List<TraceLog> traceLogs) {
        List<TraceLogDTO> traceLogDTOs = Lists.newArrayList();

        for(TraceLog traceLog : traceLogs) {

            TraceLogDTO traceLogDTO = new TraceLogDTO(traceLog);

            if("Task".equals(traceLog.getEntityName())) {
                Task task = taskService.findOne(traceLog.getTaskId());

                traceLogDTO.setTaskName(task.getName());
            }

            User user = userService.findByLogin(traceLog.getCreatedBy());

            if(user != null) {
                if(user.getProfileImage() != null)
                    traceLogDTO.setProfileImageId(user.getProfileImage().getId());
            }

            if(traceLog.getPlainAttachedFiles() != null && !traceLog.getPlainAttachedFiles().isEmpty())
                traceLogDTO.setAttachedFiles(traceLog.getPlainAttachedFiles().stream().map(AttachedFileDTO::new).collect(Collectors.toList()));

            traceLogDTOs.add(traceLogDTO);
        }

        return traceLogDTOs;
    }

    public TraceLog findOne(Long traceLogId) {

        if(traceLogId == null)
            throw new CommonRuntimeException("error.traceLog.targetIdIsNull");

        return traceLogRepository.findOne(traceLogId);
    }
}
