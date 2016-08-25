package kr.wisestone.wms.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A NotificationRecipient.
 */
@Entity
@Table(name = "owl_notification_recipient")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "notificationrecipient")
public class NotificationRecipient extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "notificationRecipientSeqGenerator")
    @TableGenerator(name = "notificationRecipientSeqGenerator"
        , table = "owl_sequence"
        , initialValue = 10000
        , pkColumnValue = "owl_notification_recipient_id"
        , pkColumnName = "seq_id"
        , valueColumnName = "seq_value"
        , allocationSize = 1)
    private Long id;

    @Column(name = "read_yn")
    @Type(type="yes_no")
    private Boolean readYn = Boolean.FALSE;

    @Column(name = "confirm_yn")
    @Type(type="yes_no")
    private Boolean confirmYn = Boolean.FALSE;

    @ManyToOne
    @JoinColumn(name = "notification_id")
    private Notification notification;

    @Column(name = "recipient_id")
    private Long recipient;


    public NotificationRecipient() {}

    public NotificationRecipient(Notification notification, Long recipient) {
        this.setNotification(notification);
        this.setRecipient(recipient);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean isReadYn() {
        return readYn;
    }

    public void setReadYn(Boolean readYn) {
        this.readYn = readYn;
    }

    public Boolean getConfirmYn() {
        return confirmYn;
    }

    public void setConfirmYn(Boolean confirmYn) {
        this.confirmYn = confirmYn;
    }

    public Notification getNotification() {
        return notification;
    }

    public void setNotification(Notification notification) {
        this.notification = notification;
    }

    public Long getRecipient() {
        return recipient;
    }

    public void setRecipient(Long recipient) {
        this.recipient = recipient;
    }

    public Boolean getReadYn() {
        return readYn;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        NotificationRecipient notificationRecipient = (NotificationRecipient) o;
        if(notificationRecipient.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, notificationRecipient.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "NotificationRecipient{" +
            "id=" + id +
            ", readYn='" + readYn + "'" +
            '}';
    }
}
