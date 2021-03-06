package kr.wisestone.wms.service;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.mysema.query.BooleanBuilder;
import com.mysema.query.jpa.JPASubQuery;
import kr.wisestone.wms.common.exception.CommonRuntimeException;
import kr.wisestone.wms.common.util.DateUtil;
import kr.wisestone.wms.domain.*;
import kr.wisestone.wms.repository.TraceLogRepository;
import kr.wisestone.wms.repository.dao.TraceLogDAO;
import kr.wisestone.wms.security.SecurityUtils;
import kr.wisestone.wms.web.rest.condition.TraceLogCondition;
import kr.wisestone.wms.web.rest.dto.AttachedFileDTO;
import kr.wisestone.wms.web.rest.dto.TraceLogDTO;
import kr.wisestone.wms.web.rest.dto.TraceLogListInfoDTO;
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
import org.springframework.web.multipart.MultipartFile;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;
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
    private ProjectService projectService;

    @Inject
    private UserService userService;

    @Inject
    private TraceLogDAO traceLogDAO;

    @Transactional(readOnly = true)
    public TraceLogListInfoDTO findByEntityIdAndEntityName(TraceLogCondition traceLogCondition) {

        Map<String, Object> condition = Maps.newHashMap(ImmutableMap.<String, Object>builder().
            put("entityId", traceLogCondition.getEntityId()).
            put("entityName", traceLogCondition.getEntityName()).
            build());

        if(StringUtils.hasText(traceLogCondition.getEntityField()))
            condition.put("entityField", traceLogCondition.getEntityField());

        condition.put("recentYn", traceLogCondition.getRecentYn());

        if(traceLogCondition.getOffset() != null) {
            condition.put("offset", traceLogCondition.getOffset());
        }

        if(traceLogCondition.getLimit() != null) {
            condition.put("limit", traceLogCondition.getLimit());
        }

        List<TraceLogDTO> traceLogs = traceLogDAO.getTraceLogs(condition);

        Integer dateCount = traceLogDAO.getTraceLogDateCount(condition);

        return new TraceLogListInfoDTO(traceLogs, dateCount);
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

        for(Long fileId : traceLogForm.getContentUploadFiles()) {

            AttachedFile attachedFile = this.attachedFileService.findOne(fileId);

            traceLog.addAttachedFile(attachedFile);
        }

        traceLog = traceLogRepository.save(traceLog);

        if(traceLog.getReplyYn() && traceLog.getEntityName().equals("Task")) {
            taskService.updateLastModifiedDate(traceLog.getTaskId());
        } else if(traceLog.getReplyYn() && traceLog.getEntityName().equals("Project")) {
            projectService.updateLastModifiedDate(traceLog.getProjectId());
        }

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

        for(Long fileId : traceLogForm.getContentUploadFiles()) {

            AttachedFile attachedFile = this.attachedFileService.findOne(fileId);

            origin.addAttachedFile(attachedFile);
        }

        if(!traceLogForm.getRemoveAttachedFileIds().isEmpty()) {

            for(Long targetFileId : traceLogForm.getRemoveAttachedFileIds()) {

                origin.removeAttachedFile(targetFileId);
            }
        }

        if(origin.getReplyYn() && origin.getEntityName().equals("Task")) {
            taskService.updateLastModifiedDate(origin.getTaskId());
        } else if(origin.getReplyYn() && origin.getEntityName().equals("Project")) {
            projectService.updateLastModifiedDate(origin.getProjectId());
        }

        origin = traceLogRepository.save(origin);

        return origin;
    }

    @Transactional(readOnly = true)
    public List<TraceLogDTO> findRecentTraceLog(Pageable pageable) {

        User loginUser = SecurityUtils.getCurrentUser();

        Calendar yesterday = Calendar.getInstance();
        yesterday.add(Calendar.DAY_OF_MONTH, -1);
        yesterday.set(Calendar.HOUR_OF_DAY, 0);
        yesterday.set(Calendar.MINUTE, 0);
        yesterday.set(Calendar.SECOND, 0);

        Map<String, Object> condition = Maps.newHashMap(ImmutableMap.<String, Object>builder().
            put("loginUser", loginUser.getLogin()).
            put("yesterday", DateUtil.convertToZonedDateTime(yesterday.getTime())).
            put("offset", pageable.getOffset()).
            put("limit", pageable.getPageSize()).
            build());

        List<TraceLogDTO> traceLogDTOs = traceLogDAO.getRecentTraceLogs(condition);

        return traceLogDTOs;
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

                traceLogDTO.setCreatedByName(user.getName());
                traceLogDTO.setCreatedById(user.getId());
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
