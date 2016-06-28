package kr.wisestone.wms.web.rest;

import kr.wisestone.wms.WmsApp;
import kr.wisestone.wms.domain.Notification;
import kr.wisestone.wms.repository.NotificationRepository;
import kr.wisestone.wms.service.NotificationService;
import kr.wisestone.wms.repository.search.NotificationSearchRepository;
import kr.wisestone.wms.web.rest.dto.NotificationDTO;
import kr.wisestone.wms.web.rest.mapper.NotificationMapper;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.hamcrest.Matchers.hasItem;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


/**
 * Test class for the NotificationResource REST controller.
 *
 * @see NotificationResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = WmsApp.class)
@WebAppConfiguration
@IntegrationTest
public class NotificationResourceIntTest {

    private static final String DEFAULT_NOTIFICATION_METHOD = "AAAAA";
    private static final String UPDATED_NOTIFICATION_METHOD = "BBBBB";
    private static final String DEFAULT_NOTIFICATION_CONFIG = "AAAAA";
    private static final String UPDATED_NOTIFICATION_CONFIG = "BBBBB";
    private static final String DEFAULT_NOTIFICATION_TYPE = "AAAAA";
    private static final String UPDATED_NOTIFICATION_TYPE = "BBBBB";
    private static final String DEFAULT_NOTIFICATION_LEVEL_NAME = "AAAAA";
    private static final String UPDATED_NOTIFICATION_LEVEL_NAME = "BBBBB";

    private static final Integer DEFAULT_NOTIFICATION_LEVEL_DISPLAY_TIME = 1;
    private static final Integer UPDATED_NOTIFICATION_LEVEL_DISPLAY_TIME = 2;
    private static final String DEFAULT_NOTIFICATION_LEVEL_COLOR = "AAAAA";
    private static final String UPDATED_NOTIFICATION_LEVEL_COLOR = "BBBBB";
    private static final String DEFAULT_NOTIFICATION_TITLE = "AAAAA";
    private static final String UPDATED_NOTIFICATION_TITLE = "BBBBB";
    private static final String DEFAULT_NOTIFICATION_CONTENTS = "AAAAA";
    private static final String UPDATED_NOTIFICATION_CONTENTS = "BBBBB";

    @Inject
    private NotificationRepository notificationRepository;

    @Inject
    private NotificationMapper notificationMapper;

    @Inject
    private NotificationService notificationService;

    @Inject
    private NotificationSearchRepository notificationSearchRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restNotificationMockMvc;

    private Notification notification;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        NotificationResource notificationResource = new NotificationResource();
        ReflectionTestUtils.setField(notificationResource, "notificationService", notificationService);
        ReflectionTestUtils.setField(notificationResource, "notificationMapper", notificationMapper);
        this.restNotificationMockMvc = MockMvcBuilders.standaloneSetup(notificationResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        notificationSearchRepository.deleteAll();
        notification = new Notification();
        notification.setNotificationMethod(DEFAULT_NOTIFICATION_METHOD);
        notification.setNotificationType(DEFAULT_NOTIFICATION_TYPE);
        notification.setNotificationLevelName(DEFAULT_NOTIFICATION_LEVEL_NAME);
        notification.setNotificationLevelDisplayTime(DEFAULT_NOTIFICATION_LEVEL_DISPLAY_TIME);
        notification.setNotificationLevelColor(DEFAULT_NOTIFICATION_LEVEL_COLOR);
        notification.setTitle(DEFAULT_NOTIFICATION_TITLE);
        notification.setContents(DEFAULT_NOTIFICATION_CONTENTS);
    }

    @Test
    @Transactional
    public void getAllNotifications() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get all the notifications
        restNotificationMockMvc.perform(get("/api/notifications?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(notification.getId().intValue())))
                .andExpect(jsonPath("$.[*].notificationMethod").value(hasItem(DEFAULT_NOTIFICATION_METHOD.toString())))
                .andExpect(jsonPath("$.[*].notificationConfig").value(hasItem(DEFAULT_NOTIFICATION_CONFIG.toString())))
                .andExpect(jsonPath("$.[*].notificationType").value(hasItem(DEFAULT_NOTIFICATION_TYPE.toString())))
                .andExpect(jsonPath("$.[*].notificationLevelName").value(hasItem(DEFAULT_NOTIFICATION_LEVEL_NAME.toString())))
                .andExpect(jsonPath("$.[*].notificationLevelDisplayTime").value(hasItem(DEFAULT_NOTIFICATION_LEVEL_DISPLAY_TIME)))
                .andExpect(jsonPath("$.[*].notificationLevelColor").value(hasItem(DEFAULT_NOTIFICATION_LEVEL_COLOR.toString())))
                .andExpect(jsonPath("$.[*].notificationTitle").value(hasItem(DEFAULT_NOTIFICATION_TITLE.toString())))
                .andExpect(jsonPath("$.[*].notificationContents").value(hasItem(DEFAULT_NOTIFICATION_CONTENTS.toString())));
    }

    @Test
    @Transactional
    public void getNotification() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);

        // Get the notification
        restNotificationMockMvc.perform(get("/api/notifications/{id}", notification.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(notification.getId().intValue()))
            .andExpect(jsonPath("$.notificationMethod").value(DEFAULT_NOTIFICATION_METHOD.toString()))
            .andExpect(jsonPath("$.notificationConfig").value(DEFAULT_NOTIFICATION_CONFIG.toString()))
            .andExpect(jsonPath("$.notificationType").value(DEFAULT_NOTIFICATION_TYPE.toString()))
            .andExpect(jsonPath("$.notificationLevelName").value(DEFAULT_NOTIFICATION_LEVEL_NAME.toString()))
            .andExpect(jsonPath("$.notificationLevelDisplayTime").value(DEFAULT_NOTIFICATION_LEVEL_DISPLAY_TIME))
            .andExpect(jsonPath("$.notificationLevelColor").value(DEFAULT_NOTIFICATION_LEVEL_COLOR.toString()))
            .andExpect(jsonPath("$.notificationTitle").value(DEFAULT_NOTIFICATION_TITLE.toString()))
            .andExpect(jsonPath("$.notificationContents").value(DEFAULT_NOTIFICATION_CONTENTS.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingNotification() throws Exception {
        // Get the notification
        restNotificationMockMvc.perform(get("/api/notifications/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void deleteNotification() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);
        notificationSearchRepository.save(notification);
        int databaseSizeBeforeDelete = notificationRepository.findAll().size();

        // Get the notification
        restNotificationMockMvc.perform(delete("/api/notifications/{id}", notification.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate ElasticSearch is empty
        boolean notificationExistsInEs = notificationSearchRepository.exists(notification.getId());
        assertThat(notificationExistsInEs).isFalse();

        // Validate the database is empty
        List<Notification> notifications = notificationRepository.findAll();
        assertThat(notifications).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchNotification() throws Exception {
        // Initialize the database
        notificationRepository.saveAndFlush(notification);
        notificationSearchRepository.save(notification);

        // Search the notification
        restNotificationMockMvc.perform(get("/api/_search/notifications?query=id:" + notification.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.[*].id").value(hasItem(notification.getId().intValue())))
            .andExpect(jsonPath("$.[*].notificationMethod").value(hasItem(DEFAULT_NOTIFICATION_METHOD.toString())))
            .andExpect(jsonPath("$.[*].notificationConfig").value(hasItem(DEFAULT_NOTIFICATION_CONFIG.toString())))
            .andExpect(jsonPath("$.[*].notificationType").value(hasItem(DEFAULT_NOTIFICATION_TYPE.toString())))
            .andExpect(jsonPath("$.[*].notificationLevelName").value(hasItem(DEFAULT_NOTIFICATION_LEVEL_NAME.toString())))
            .andExpect(jsonPath("$.[*].notificationLevelDisplayTime").value(hasItem(DEFAULT_NOTIFICATION_LEVEL_DISPLAY_TIME)))
            .andExpect(jsonPath("$.[*].notificationLevelColor").value(hasItem(DEFAULT_NOTIFICATION_LEVEL_COLOR.toString())))
            .andExpect(jsonPath("$.[*].notificationTitle").value(hasItem(DEFAULT_NOTIFICATION_TITLE.toString())))
            .andExpect(jsonPath("$.[*].notificationContents").value(hasItem(DEFAULT_NOTIFICATION_CONTENTS.toString())));
    }
}
