package kr.wisestone.wms.web.rest.mapper;

import kr.wisestone.wms.domain.*;
import kr.wisestone.wms.web.rest.dto.NotificationDTO;

import org.mapstruct.*;
import java.util.List;

/**
 * Mapper for the entity Notification and its DTO NotificationDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface NotificationMapper {

    @Mapping(source = "sender", target = "sender", ignore = true)
    NotificationDTO notificationToNotificationDTO(Notification notification);

    List<NotificationDTO> notificationsToNotificationDTOs(List<Notification> notifications);

    @Mapping(target = "sender", ignore = true)
    @Mapping(target = "notificationRecipients", ignore = true)
    Notification notificationDTOToNotification(NotificationDTO notificationDTO);

    List<Notification> notificationDTOsToNotifications(List<NotificationDTO> notificationDTOs);
}
