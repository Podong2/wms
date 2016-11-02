package kr.wisestone.wms.domain;

public enum UserType {

    ASSIGNEE("assignee", "담당자"),
    WATCHER("watcher", "참조자"),
    ADMIN("admin", "관리자"),
    SHARER("sharer", "공유"),
    MEMBER("member", "멤버"),
    ;

    private String code;
    private String description;

    UserType(String code, String description) {
        this.code = code;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
