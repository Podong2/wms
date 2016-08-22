package kr.wisestone.wms.web.rest;

import com.codahale.metrics.annotation.Timed;
import kr.wisestone.wms.domain.Notification;
import kr.wisestone.wms.service.NotificationService;
import kr.wisestone.wms.web.rest.dto.TaskDTO;
import kr.wisestone.wms.web.rest.form.TaskForm;
import kr.wisestone.wms.web.rest.util.HeaderUtil;
import kr.wisestone.wms.web.rest.util.PaginationUtil;
import kr.wisestone.wms.web.rest.dto.NotificationDTO;
import kr.wisestone.wms.web.rest.mapper.NotificationMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Notification.
 */
@RestController
@RequestMapping("/api")
public class NotificationResource {

    private final Logger log = LoggerFactory.getLogger(NotificationResource.class);

    @Inject
    private NotificationService notificationService;

    @Inject
    private NotificationMapper notificationMapper;

    /**
     * GET  /notifications : get all the notifications.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of notifications in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/notifications",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<List<NotificationDTO>> getAllNotifications(
            @RequestParam(name = "listType", required = false, defaultValue = "UN_READ") String listType
            , Pageable pageable)

        throws URISyntaxException {
        log.debug("REST request to get a page of Notifications");
        Page<NotificationDTO> page = notificationService.findAll(listType, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/notifications");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    @RequestMapping(value = "/notifications/getUnreadCount",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Long> getUnreadNotificationCount()

        throws URISyntaxException {
        log.debug("REST request to get a count of unread Notifications");
        Long count = notificationService.unreadNotificationCounts();

        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    /**
     * GET  /notifications/:id : get the "id" notification.
     *
     * @param id the id of the notificationDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the notificationDTO, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/notifications/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<NotificationDTO> getNotification(@PathVariable Long id) {
        log.debug("REST request to get Notification : {}", id);
        NotificationDTO notificationDTO = notificationService.findOne(id);
        return Optional.ofNullable(notificationDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @RequestMapping(value = "/notifications/{id}",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<NotificationDTO> checkReadNotification(@PathVariable Long id) throws URISyntaxException {
        log.debug("REST request to read Notification : {}", id);

        NotificationDTO notificationDTO = notificationService.checkReadNotification(id);
        return Optional.ofNullable(notificationDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /notifications/:id : delete the "id" notification.
     *
     * @param id the id of the notificationDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/notifications/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        log.debug("REST request to delete Notification : {}", id);
        notificationService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("notification", id.toString())).build();
    }

    /**
     * SEARCH  /_search/notifications?query=:query : search for the notification corresponding
     * to the query.
     *
     * @param query the query of the notification search
     * @return the result of the search
     */
    @RequestMapping(value = "/_search/notifications",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<List<NotificationDTO>> searchNotifications(@RequestParam String query, Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to search for a page of Notifications for query {}", query);
        Page<Notification> page = notificationService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/notifications");
        return new ResponseEntity<>(notificationMapper.notificationsToNotificationDTOs(page.getContent()), headers, HttpStatus.OK);
    }

}
