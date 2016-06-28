package kr.wisestone.wms.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import kr.wisestone.wms.common.constant.NotificationConfig;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.Objects;

/**
 * A Notification.
 */
@Entity
@Table(name = "owl_notification")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "notification")
public class Notification extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final String METHOD_EMAIL = "01";
    public static final String METHOD_SMS  = "02";
    public static final String METHOD_PUSH = "03";
    public static final String METHOD_EMAIL_AND_PUSH = "04";

    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "notificationSeqGenerator")
    @TableGenerator(name = "notificationSeqGenerator"
        , table = "owl_sequence"
        , initialValue = 10000
        , pkColumnValue = "owl_notification_id"
        , pkColumnName = "seq_id"
        , valueColumnName = "seq_value"
        , allocationSize = 1)
    private Long id;

    @Column(name = "notification_method")
    private String notificationMethod;

    @Column(name = "notification_config")
    @Enumerated(EnumType.STRING)
    private NotificationConfig notificationConfig;

    @Column(name = "notification_type")
    private String notificationType;

    @Column(name = "notification_level_name")
    private String notificationLevelName;

    @Column(name = "notification_level_display_time")
    private Integer notificationLevelDisplayTime;

    @Column(name = "notification_level_color")
    private String notificationLevelColor;

    @Column(name = "title")
    private String title;

    @Column(name = "contents")
    private String contents;

    @OneToMany(mappedBy = "notification", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<NotificationRecipient> notificationRecipients = new HashSet<>();

    @Column(name = "sender_id")
    private Long sender;

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

    public NotificationConfig getNotificationConfig() {
        return notificationConfig;
    }

    public void setNotificationConfig(NotificationConfig notificationConfig) {
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

    public String getContents() {
        return contents;
    }

    public void setContents(String contents) {
        this.contents = contents;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Set<NotificationRecipient> getNotificationRecipients() {
        return notificationRecipients;
    }

    public void setNotificationRecipients(Set<NotificationRecipient> notificationRecipients) {
        this.notificationRecipients = notificationRecipients;
    }

    public Long getSender() {
        return sender;
    }

    public void setSender(Long sender) {
        this.sender = sender;
    }

    public void addNotificationReceive(Long recvUserId) {
        this.getNotificationRecipients().add(new NotificationRecipient(this, recvUserId));
    }

    public void addNotificationReceive(List<Long> recvUserIds) {

        for(Long id : recvUserIds) {

            this.getNotificationRecipients().add(new NotificationRecipient(this, id));
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Notification notification = (Notification) o;
        if(notification.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, notification.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Notification{" +
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
