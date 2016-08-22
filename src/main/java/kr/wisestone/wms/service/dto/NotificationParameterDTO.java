package kr.wisestone.wms.service.dto;

import com.google.common.base.Function;
import com.google.common.collect.Iterables;
import com.google.common.collect.Lists;
import kr.wisestone.wms.common.constant.NotificationConfig;
import kr.wisestone.wms.common.util.ConvertUtil;
import kr.wisestone.wms.domain.Notification;
import kr.wisestone.wms.domain.TraceLog;
import kr.wisestone.wms.domain.User;
import kr.wisestone.wms.web.rest.dto.TaskDTO;
import kr.wisestone.wms.web.rest.dto.UserDTO;
import lombok.Data;

import javax.annotation.Nullable;
import javax.persistence.Column;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Data
public class NotificationParameterDTO {
    private Long id;

    private NotificationConfig notificationConfig;

    private String notificationMethod;

    private String title;

    private Map<String, Object> contents;

    private Long linkedIssueId;

    private UserDTO fromUser;

    private List<User> toUsers = new ArrayList<>();

    private List<User> pushUsers = new ArrayList<>();

    private Long entityId;

    private String entityName;

    private String entityField;

    private String entityValue;

    private String etcValue;

    NotificationParameterDTO() {}

    public NotificationParameterDTO(NotificationConfig notificationConfig, String notificationMethod, Map<String, Object> contents
        , UserDTO fromUser, List<User> toUsers) {

        this.notificationConfig = notificationConfig;
        this.notificationMethod = notificationMethod;
        this.contents = contents;
        this.fromUser = fromUser;
        this.toUsers = toUsers;
    }

    public NotificationParameterDTO(NotificationConfig notificationConfig, String notificationMethod, String title, Map<String, Object> contents
        , UserDTO fromUser, List<User> toUsers, TraceLog traceLog) {

        this.notificationConfig = notificationConfig;
        this.notificationMethod = notificationMethod;
        this.title = title;
        this.contents = contents;
        this.fromUser = fromUser;
        this.toUsers = toUsers;

        this.setEntityId(traceLog.getEntityId());
        this.setEntityField(traceLog.getEntityField());
        this.setEntityName(traceLog.getEntityName());
        this.setEntityValue(traceLog.getEntityField());
        this.setEtcValue(traceLog.getEtcValue());
    }

    public NotificationParameterDTO(NotificationConfig notificationConfig, String notificationMethod, String title, Map<String, Object> contents
        , UserDTO fromUser, List<User> toUsers, TaskDTO taskDTO) {

        this.notificationConfig = notificationConfig;
        this.notificationMethod = notificationMethod;
        this.title = title;
        this.contents = contents;
        this.fromUser = fromUser;
        this.toUsers = toUsers;

        this.setEntityId(taskDTO.getId());
        this.setEntityName("Task");
        this.setEntityValue(taskDTO.getName());
    }

    public NotificationParameterDTO(NotificationConfig notificationConfig, String notificationMethod
        , String title, Map<String, Object> contents, List<User> toUsers) {

        this.notificationConfig = notificationConfig;
        this.notificationMethod = notificationMethod;
        this.title = title;
        this.contents = contents;
        this.toUsers = toUsers;
    }

    public NotificationParameterDTO(NotificationConfig notificationConfig, String notificationMethod
        , String title, Map<String, Object> contents, Long linkedIssueId
        , UserDTO fromUser, List<User> toUsers) {

        this.notificationConfig = notificationConfig;
        this.notificationMethod = notificationMethod;
        this.title = title;
        this.contents = contents;
        this.linkedIssueId = linkedIssueId;
        this.fromUser = fromUser;
        this.toUsers = toUsers;
    }

    public Notification populate() {

        Notification notification = new Notification();

        if(this.fromUser != null)
            notification.setSender(fromUser.getId());

        notification.setTitle(this.title);
        notification.setNotificationMethod(this.notificationMethod);
        notification.setNotificationConfig(this.notificationConfig);
        notification.setContents(ConvertUtil.convertObjectToJson(this.contents));

        if(this.notificationConfig.equals(NotificationConfig.COMMON_MESSAGE)) {
            notification.setNotificationType("02");
        } else {
            notification.setNotificationType("01");
        }

        notification.setEntityId(this.getEntityId());
        notification.setEntityField(this.getEntityField());
        notification.setEntityName(this.getEntityName());
        notification.setEntityValue(this.getEntityField());
        notification.setEtcValue(this.getEtcValue());

        notification.addNotificationReceive(this.toUsers.stream().map(User::getId).collect(Collectors.toList()));

/*        notification.addNotificationReceiveMobilePush(Lists.newArrayList(Iterables.transform(this.pushUsers, new Function<UserVo, UserVo>(){
            @Override
            public UserVo apply(UserVo userVo) {
                return userVo;
            }
        })));*/

//        if(this.notificationLevel != null) {
//            notification.setNotificationLevelInfo(ConvertUtil.copyProperties(this.notificationLevel, NotificationLevelInfo.class));
//        }

//        notification.setLinkedIssueId(this.linkedIssueId);

        return notification;
    }
}
