package kr.wisestone.wms.service;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.mysema.query.BooleanBuilder;
import com.mysema.query.jpa.JPASubQuery;
import com.mysema.query.jpa.JPQLQuery;
import com.mysema.query.jpa.JPQLSubQuery;
import kr.wisestone.wms.common.constant.NotificationConfig;
import kr.wisestone.wms.common.util.WebAppUtil;
import kr.wisestone.wms.domain.*;
import kr.wisestone.wms.repository.NotificationRepository;
import kr.wisestone.wms.repository.search.NotificationSearchRepository;
import kr.wisestone.wms.security.SecurityUtils;
import kr.wisestone.wms.service.dto.NotificationParameterDTO;
import kr.wisestone.wms.web.rest.dto.NotificationDTO;
import kr.wisestone.wms.web.rest.dto.ProjectDTO;
import kr.wisestone.wms.web.rest.dto.TaskDTO;
import kr.wisestone.wms.web.rest.mapper.NotificationMapper;
import kr.wisestone.wms.web.rest.mapper.TraceLogMapper;
import kr.wisestone.wms.web.rest.mapper.UserMapper;
import kr.wisestone.wms.web.rest.util.PaginationUtil;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Async;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.*;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Notification.
 */
@Service
@Transactional
public class NotificationService {

    private final Logger log = LoggerFactory.getLogger(NotificationService.class);

    @Inject
    private NotificationRepository notificationRepository;

    @Inject
    private NotificationMapper notificationMapper;

    @Inject
    private NotificationSearchRepository notificationSearchRepository;

    @Inject
    private UserService userService;

    @Inject
    private UserMapper userMapper;

    @Inject
    private PushService pushService;

    @Inject
    private TaskService taskService;

    @Inject
    private ProjectService projectService;

    @Inject
    private MailService mailService;

    @Inject
    private MessageSource messageSource;

    @Inject
    private TraceLogMapper traceLogMapper;

    /**
     * Save a notification.
     *
     * @param notificationDTO the entity to save
     * @return the persisted entity
     */
    public NotificationDTO save(NotificationDTO notificationDTO) {
        log.debug("Request to save Notification : {}", notificationDTO);
        Notification notification = notificationMapper.notificationDTOToNotification(notificationDTO);
        notification = notificationRepository.save(notification);
        NotificationDTO result = notificationMapper.notificationToNotificationDTO(notification);
        notificationSearchRepository.save(notification);
        return result;
    }

    /**
     *  Get all the notifications.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<NotificationDTO> findAll(String listType, Pageable pageable) {

        User loginUser = SecurityUtils.getCurrentUser();

        QNotification $notification = QNotification.notification;
        QNotificationRecipient $notificationRecipient = QNotificationRecipient.notificationRecipient;

        BooleanBuilder predicate = new BooleanBuilder();
        BooleanBuilder readStatusPredicate = new BooleanBuilder();

        if("UN_READ".equals(listType)) {
            readStatusPredicate.and($notificationRecipient.confirmYn.isFalse());
        } else {
            readStatusPredicate.and($notificationRecipient.confirmYn.isTrue());
        }

        predicate.and($notification.id.in(new JPASubQuery()
            .from($notificationRecipient)
            .where($notificationRecipient.recipient.eq(loginUser.getId()).and(readStatusPredicate))
            .list($notificationRecipient.notification.id)));

        log.debug("Request to get all Notifications");
        Page<Notification> result = notificationRepository.findAll(predicate, PaginationUtil.applySort(pageable, Sort.Direction.DESC, "createdDate"));

        List<NotificationDTO> notificationDTOs = Lists.newArrayList();

        for(Notification notification : result.getContent()) {

            NotificationDTO notificationDTO = notificationMapper.notificationToNotificationDTO(notification);

            if(notification.getSender() != null) {
                User sender = this.userService.findOne(notification.getSender());
                notificationDTO.setSender(this.userMapper.userToUserDTO(sender));
            }

            if("Task".equalsIgnoreCase(notificationDTO.getEntityName())) {
                notificationDTO.setTaskDTO(taskService.findOneDTO(notificationDTO.getEntityId()));
            } else if("Project".equalsIgnoreCase(notificationDTO.getEntityName())) {
                notificationDTO.setProjectDTO(projectService.findOne(notificationDTO.getEntityId()));
            }

            notificationDTO.setReadYn(notification.checkReadYn(loginUser.getId()));

            notificationDTOs.add(notificationDTO);
        }

        return new PageImpl<>(notificationDTOs, pageable, result.getTotalElements());
    }

    /**
     *  Get one notification by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Transactional(readOnly = true)
    public NotificationDTO findOne(Long id) {
        log.debug("Request to get Notification : {}", id);
        Notification notification = notificationRepository.findOne(id);
        NotificationDTO notificationDTO = notificationMapper.notificationToNotificationDTO(notification);

        if("Task".equalsIgnoreCase(notificationDTO.getEntityName())) {
            notificationDTO.setTaskDTO(taskService.findOneDTO(notificationDTO.getEntityId()));
        } else if("Project".equalsIgnoreCase(notificationDTO.getEntityName())) {
            notificationDTO.setProjectDTO(projectService.findOne(notificationDTO.getEntityId()));
        }

        return notificationDTO;
    }

    @Transactional(readOnly = true)
    public Long unreadNotificationCounts() {
        User loginUser = SecurityUtils.getCurrentUser();

        QNotification $notification = QNotification.notification;
        QNotificationRecipient $notificationRecipient = QNotificationRecipient.notificationRecipient;

        BooleanBuilder predicate = new BooleanBuilder();

        predicate.and($notification.id.in(new JPASubQuery()
            .from($notificationRecipient)
            .where($notificationRecipient.recipient.eq(loginUser.getId()).and($notificationRecipient.confirmYn.isFalse()))
            .list($notificationRecipient.notification.id)));

        Long count = notificationRepository.count(predicate);

        return count;
    }

    @Transactional
    public NotificationDTO checkNotification(Long id, String checkType) {

        User loginUser = SecurityUtils.getCurrentUser();

        Notification notification = notificationRepository.findOne(id);

        NotificationRecipient notificationRecipient = notification.findNotificationRecipient(loginUser.getId());

        if("read".equalsIgnoreCase(checkType)) {
            notificationRecipient.setReadYn(Boolean.TRUE);
        } else if("confirm".equalsIgnoreCase(checkType)) {
            notificationRecipient.setReadYn(Boolean.TRUE);
            notificationRecipient.setConfirmYn(Boolean.TRUE);
        }

        notificationRepository.save(notification);

        return notificationMapper.notificationToNotificationDTO(notification);
    }

    /**
     *  Delete the  notification by id.
     *
     *  @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Notification : {}", id);
        notificationRepository.delete(id);
        notificationSearchRepository.delete(id);
    }

    /**
     * Search for the notification corresponding to the query.
     *
     *  @param query the query of the search
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<Notification> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Notifications for query {}", query);
        return notificationSearchRepository.search(queryStringQuery(query), pageable);
    }

    @Transactional
    public void sendIssueCreatedNotification(TaskDTO createdTaskDTO, List<User> toUsers, String notifyMethod) {
        NotificationConfig notificationConfig = NotificationConfig.TASK_CREATED;

        User loginUser = SecurityUtils.getCurrentUser();

        Map<String, Object> contents = Maps.newHashMap(ImmutableMap.<String, Object>builder().
            put("task", createdTaskDTO).
            put("baseUrl", WebAppUtil.getBaseUrl()).
            build());

        String title = this.getTaskNotificationTitle(createdTaskDTO);

        NotificationParameterDTO notificationParameterVo = new NotificationParameterDTO(
            notificationConfig, notifyMethod, title, contents, userMapper.userToUserDTO(loginUser), toUsers, createdTaskDTO);

        this.saveAndSendNotification(notificationParameterVo);
    }

    @Transactional
    public void sendIssueRemovedNotification(TaskDTO createdTaskDTO, List<User> toUsers, String notifyMethod) {
        NotificationConfig notificationConfig = NotificationConfig.TASK_REMOVED;

        Map<String, Object> contents = Maps.newHashMap(ImmutableMap.<String, Object>builder().
            put("task", createdTaskDTO).
            put("baseUrl", WebAppUtil.getBaseUrl()).
            build());

        String title = this.getNotificationTitle(notificationConfig);

        NotificationParameterDTO notificationParameterVo = new NotificationParameterDTO(
            notificationConfig, notifyMethod, title, contents, toUsers);

        this.saveAndSendNotification(notificationParameterVo);
    }

    @Transactional
    public void sendTaskUpdateNotification(TraceLog traceLog, String notifyMethod) {
        NotificationConfig notificationConfig = NotificationConfig.TASK_MODIFIED;

        User loginUser = SecurityUtils.getCurrentUser();

        TaskDTO task = taskService.findOneDTO(traceLog.getTaskId());

        Map<String, Object> contents = Maps.newHashMap(ImmutableMap.<String, Object>builder().
            put("task", task).
            put("traceLog", traceLogMapper.traceLogToTraceLogDTO(traceLog)).
            put("baseUrl", WebAppUtil.getBaseUrl()).
            build());

        String title = this.getTaskNotificationTitle(task);

        List<User> toUsers = Lists.newArrayList();

        if(task.getAssignees() != null)
            toUsers.addAll(userMapper.userDTOsToUsers(task.getAssignees()));

        if(task.getWatchers() != null)
            toUsers.addAll(userMapper.userDTOsToUsers(task.getWatchers()));

        if(!toUsers.isEmpty()) {
            NotificationParameterDTO notificationParameterVo = new NotificationParameterDTO(
                notificationConfig, notifyMethod, title, contents, userMapper.userToUserDTO(loginUser), toUsers, traceLog);

            this.saveAndSendNotification(notificationParameterVo);
        }
    }

    private String getNotificationTitle(NotificationConfig notification) {
        return messageSource.getMessage(notification.getTitle(), null, Locale.KOREA);
    }

    private String getTaskNotificationTitle(TaskDTO task) {

        String taskName = task.getName();

        List<ProjectDTO> projectDTOs = task.getTaskProjects();

        if(projectDTOs != null && !projectDTOs.isEmpty()) {
            String projectNames = StringUtils.join(projectDTOs.stream().map(ProjectDTO::getName).toArray(), ",");

            taskName = projectNames + " " + taskName;
        }

        return taskName;
    }

    @Async
    @Transactional
    private Notification saveAndSendNotification(NotificationParameterDTO notificationParameterDTO) {

        Notification notification = this.saveNotification(notificationParameterDTO);

        notificationParameterDTO.setId(notification.getId());

        this.sendNotification(notificationParameterDTO);

        return notification;
    }

    @Transactional
    private Notification saveNotification(NotificationParameterDTO notificationParameterDTO) {

        this.bindDefaultNotificationInfo(notificationParameterDTO);

        Notification notification = this.notificationRepository.save(notificationParameterDTO.populate());
        this.notificationSearchRepository.save(notification);

        return notification;
    }

    private void bindDefaultNotificationInfo(NotificationParameterDTO notificationParameterDTO) {
//        if(notificationParameterDTO.getNotificationLevel() == null) {
//            NotificationLevel defaultNotificationLevel = this.notificationLevelService.findByDefaultYn(Boolean.TRUE);
//
//            if(defaultNotificationLevel != null) {
//                notificationParameterDTO.setNotificationLevel(defaultNotificationLevel);
//            }
//        }

        if(notificationParameterDTO.getFromUser() == null)
            notificationParameterDTO.setFromUser(this.userMapper.userToUserDTO(this.userService.getUserWithAuthorities(1L)));
    }

    @Transactional
    private Notification saveNotificationReceive(NotificationParameterDTO notificationParameterDTO) {

        Notification notification = this.notificationRepository.save(notificationParameterDTO.populate());
        this.notificationSearchRepository.save(notification);

        return notification;
    }

    @Async
    private void sendNotification(NotificationParameterDTO notificationParameterDTO) {

        switch (notificationParameterDTO.getNotificationMethod()) {
            case Notification.METHOD_EMAIL :

                this.mailService.sendEmail(notificationParameterDTO);

                break;

            case Notification.METHOD_PUSH :

                this.pushService.sendPush(notificationParameterDTO);

                break;

            case Notification.METHOD_EMAIL_AND_PUSH:

                this.mailService.sendEmail(notificationParameterDTO);
                this.pushService.sendPush(notificationParameterDTO);

                break;
            default :
                break;
        }
    }
}
