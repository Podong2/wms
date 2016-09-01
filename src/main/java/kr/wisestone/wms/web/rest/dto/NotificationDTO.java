package kr.wisestone.wms.web.rest.dto;

import java.io.Serializable;
import java.time.ZonedDateTime;
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

    private Long entityId;

    private String entityName;

    private String entityValue;

    private String etcValue;

    private String entityField;

    private String persistType;

    private TaskDTO taskDTO;

    private ProjectDTO projectDTO;

    private ZonedDateTime createdDate;

    private Boolean readYn = Boolean.FALSE;

    private UserDTO sender;

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

    public Long getEntityId() {
        return entityId;
    }

    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }

    public String getEntityName() {
        return entityName;
    }

    public void setEntityName(String entityName) {
        this.entityName = entityName;
    }

    public String getEntityValue() {
        return entityValue;
    }

    public void setEntityValue(String entityValue) {
        this.entityValue = entityValue;
    }

    public String getEtcValue() {
        return etcValue;
    }

    public void setEtcValue(String etcValue) {
        this.etcValue = etcValue;
    }

    public String getEntityField() {
        return entityField;
    }

    public void setEntityField(String entityField) {
        this.entityField = entityField;
    }

    public TaskDTO getTaskDTO() {
        return taskDTO;
    }

    public void setTaskDTO(TaskDTO taskDTO) {
        this.taskDTO = taskDTO;
    }

    public ProjectDTO getProjectDTO() {
        return projectDTO;
    }

    public void setProjectDTO(ProjectDTO projectDTO) {
        this.projectDTO = projectDTO;
    }

    public ZonedDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(ZonedDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public Boolean getReadYn() {
        return readYn;
    }

    public void setReadYn(Boolean readYn) {
        this.readYn = readYn;
    }

    public UserDTO getSender() {
        return sender;
    }

    public void setSender(UserDTO sender) {
        this.sender = sender;
    }

    public String getPersistType() {
        return persistType;
    }

    public void setPersistType(String persistType) {
        this.persistType = persistType;
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
