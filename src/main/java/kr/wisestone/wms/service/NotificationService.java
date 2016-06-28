package kr.wisestone.wms.service;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Maps;
import kr.wisestone.wms.common.constant.NotificationConfig;
import kr.wisestone.wms.common.util.WebAppUtil;
import kr.wisestone.wms.domain.Notification;
import kr.wisestone.wms.domain.User;
import kr.wisestone.wms.repository.NotificationRepository;
import kr.wisestone.wms.repository.search.NotificationSearchRepository;
import kr.wisestone.wms.service.dto.NotificationParameterDTO;
import kr.wisestone.wms.web.rest.dto.NotificationDTO;
import kr.wisestone.wms.web.rest.dto.TaskDTO;
import kr.wisestone.wms.web.rest.mapper.NotificationMapper;
import kr.wisestone.wms.web.rest.mapper.UserMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

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
    private MailService mailService;

    @Inject
    private MessageSource messageSource;

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
    public Page<Notification> findAll(Pageable pageable) {
        log.debug("Request to get all Notifications");
        Page<Notification> result = notificationRepository.findAll(pageable);
        return result;
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
        return notificationDTO;
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

    private String getNotificationTitle(NotificationConfig notification) {
        return messageSource.getMessage(notification.getTitle(), null, Locale.KOREA);
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
