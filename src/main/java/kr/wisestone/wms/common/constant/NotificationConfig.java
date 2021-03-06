package kr.wisestone.wms.common.constant;

public enum NotificationConfig {
    COMMON_MESSAGE("common", "commonMail", "commonPush"),
    TASK_CREATED("task.created.title", "taskCreatedMail", "taskCreatedPush"),
    TASK_MODIFIED("task.modified.title", "taskModifiedMail", "taskModifiedPush"),
    TASK_REMOVED("task.removed.title", "taskRemovedMail", "taskRemovedPush"),
    ;

    private String title;

    private String mailTemplate;

    private String pushTemplate;

    NotificationConfig(String title, String mailTemplate, String pushTemplate) {
        this.title = title;
        this.mailTemplate = mailTemplate;
        this.pushTemplate = pushTemplate;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMailTemplate() {
        return mailTemplate;
    }

    public void setMailTemplate(String mailTemplate) {
        this.mailTemplate = mailTemplate;
    }

    public String getPushTemplate() {
        return pushTemplate;
    }

    public void setPushTemplate(String pushTemplate) {
        this.pushTemplate = pushTemplate;
    }
}
