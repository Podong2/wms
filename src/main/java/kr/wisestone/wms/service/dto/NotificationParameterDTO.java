package kr.wisestone.wms.service.dto;

import kr.wisestone.wms.common.constant.NotificationConfig;
import kr.wisestone.wms.domain.User;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Data
public class NotificationParameterDTO {
    private Long id;

    private NotificationConfig notificationConfig;

    private String notificationMethod;

    private String title;

    private Map<String, Object> contents;

    private Long linkedIssueId;

    private String fromUser;

    private List<User> toUsers = new ArrayList<>();

    private List<User> pushUsers = new ArrayList<>();

    NotificationParameterDTO() {}

    public NotificationParameterDTO(NotificationConfig notificationConfig, String notificationMethod, Map<String, Object> contents
        , String fromUser, List<User> toUsers) {

        this.notificationConfig = notificationConfig;
        this.notificationMethod = notificationMethod;
        this.contents = contents;
        this.fromUser = fromUser;
        this.toUsers = toUsers;
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
        , String fromUser, List<User> toUsers) {

        this.notificationConfig = notificationConfig;
        this.notificationMethod = notificationMethod;
        this.title = title;
        this.contents = contents;
        this.linkedIssueId = linkedIssueId;
        this.fromUser = fromUser;
        this.toUsers = toUsers;
    }

}
