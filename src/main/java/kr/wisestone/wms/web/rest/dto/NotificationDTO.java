package kr.wisestone.wms.web.rest.dto;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;


/**
 * A DTO for the Notification entity.
 */
public class NotificationDTO implements Serializable {

    private Long id;

    private String notificationMethod;

    private String notificationConfig;

    private String notificationType;

    private String notificationLevelName;

    private Integer notificationLevelDisplayTime;

    private String notificationLevelColor;

    private String title;

    private String contents;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public String getNotificationMethod() {
        return notificationMethod;
    }

    public void setNotificationMethod(String notificationMethod) {
        this.notificationMethod = notificationMethod;
    }
    public String getNotificationConfig() {
        return notificationConfig;
    }

    public void setNotificationConfig(String notificationConfig) {
        this.notificationConfig = notificationConfig;
    }
    public String getNotificationType() {
        return notificationType;
    }

    public void setNotificationType(String notificationType) {
        this.notificationType = notificationType;
    }
    public String getNotificationLevelName() {
        return notificationLevelName;
    }

    public void setNotificationLevelName(String notificationLevelName) {
        this.notificationLevelName = notificationLevelName;
    }
    public Integer getNotificationLevelDisplayTime() {
        return notificationLevelDisplayTime;
    }

    public void setNotificationLevelDisplayTime(Integer notificationLevelDisplayTime) {
        this.notificationLevelDisplayTime = notificationLevelDisplayTime;
    }
    public String getNotificationLevelColor() {
        return notificationLevelColor;
    }

    public void setNotificationLevelColor(String notificationLevelColor) {
        this.notificationLevelColor = notificationLevelColor;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContents() {
        return contents;
    }

    public void setContents(String contents) {
        this.contents = contents;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        NotificationDTO notificationDTO = (NotificationDTO) o;

        if ( ! Objects.equals(id, notificationDTO.id)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "NotificationDTO{" +
            "id=" + id +
            ", notificationMethod='" + notificationMethod + "'" +
            ", notificationConfig='" + notificationConfig + "'" +
            ", notificationType='" + notificationType + "'" +
            ", notificationLevelName='" + notificationLevelName + "'" +
            ", notificationLevelDisplayTime='" + notificationLevelDisplayTime + "'" +
            ", notificationLevelColor='" + notificationLevelColor + "'" +
            ", title='" + title + "'" +
            ", contents='" + contents + "'" +
            '}';
    }
}
