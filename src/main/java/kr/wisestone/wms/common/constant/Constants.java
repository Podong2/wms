package kr.wisestone.wms.common.constant;

public class Constants {

    public static final String REQ_KEY_CONDITIONS = "conditions";
    public static final String REQ_KEY_PAGE_VO = "page";
    public static final String REQ_KEY_CONTENT = "content";
    public static final String REQ_KEY_COMMON = "common";

    public static final String RES_KEY_MESSAGE = "message";
    public static final String RES_KEY_MESSAGES = "messages";
    public static final String RES_KEY_PAGE = "page";
    public static final String RES_KEY_CONTENTS = "data";
    public static final String RES_KEY_MSG_SUCCESS = "success";
    public static final String RES_KEY_MSG_EXPIRED = "expired";
    public static final String RES_KEY_MSG_FAIL = "fail";
    public static final String RES_KEY_PAGE_NAME="firstPage";
    public static final String RES_KEY_DECISION_DISCONNECT = "decisionConnect";
    public static final String RES_KEY_LAYOUTS = "layouts";
    public static final String RES_KEY_WIDGETS = "widgets";
    public static final String TOP_MENUS = "topMenus";
    public static final String LEFT_MENUS = "leftMenus";
    public static final String BUTTON_PERMISSIONS = "buttons";
    public static final String SESSION_ACCOUNT = "account";
    public static final String ACCOUNT_ACTIVE = "/main/activeUser";
    public static final String FIRST_PAGE_USER_PASSWORD_CHANGE = "/main/userPasswordChange";
    public static final String FIRST_PAGE_DASHBOARD_NAME = "/dashboard/dashboard";
    public static final String NEXT_PAGE_LOGIN = "/dashboard/dashboard";
    public static final String PROJECT_ID = "projectId";
    public static final String EXCEL = "excel";
    public static final String EXCEL_ISSUE_CUSTOMFILEDS = "issueCustomFields";
    public static final String WIDGET_IMAGE = "widgetImage";
    public static final String RES_KEY_USER = "loginUser";
    public static final String RES_KEY_MANGER_YN = "systemManagerYn";

    /** 엑셀로 출력할 수 있는 최대 사이즈 */
    public static final int MAX_EXPORT_SIZE = 99999;
    /** 동기로 출력할 수 있는 최대 사이즈 */
    public static final String RELATION_USER = "user";
    public static final String RELATION_SYSTEM_ROLE = "systemRole";
    public static final String RELATION_PERMISSION = "permisson";
    public static final String RELATION_CUSTOM_FIELD = "customField";
    public static final String RELATION_CUSTOM_FIELD_VALUE = "customFieldValue";
    public static final String RELATION_ISSUE = "issue";
    public static final String RELATION_ISSUEATTACHEDFILE = "file";
    public static final String RELATION_WATCHER = "watcher";
    public static final String RELATION_VOTER = "voter";
    public static final String RELATION_REMOVE = "remove";
    public static final String RELATION_FILE_DEL = "del";
    public static final String RELATION_REMOVE_FILES = "removeFiles";
    public static final String RELATION_ADD = "add";
    public static final String RELATION_DECISION = "decision";
    public static final String RELATION_DECISION_USERS = "decisionUsers";
    public static final String RELATION_DECISION_PROJECT_ROLES = "decisionProjectRoles";
    public static final String RELATION_DECISION_MANAGER_GUBUN = "decisionManagerGubun";
    public static final String RELATION_TEXT_EXECUTIONS = "testExecutions";
    public static final String RELATION_TEST_CASES = "testCases";
    public static final String RELATION_CUSTOM_FIELDS = "customFields";
    public static final String RELATION_TEST_BUILD = "testBuild";

    // 다운로드 타겟 파일
    public static final String FILE_DOWNLOAD_TARGET = "fileDownloadTarget";
    public static final String FILE_DOWNLOAD_CONTENT = "fileDownloadContent";
    public static final String FILE_DOWNLOAD_ALL_NAME_PREFIX = "fileDownloadAllNamePrefix";

    // 모바일 푸시
    public static  final class mobilePush{
        public static final String ANDROID = "android"; // 안드로이드
        public static final String IOS = "IOS"; // 아이폰
        public static final int RETRY = 5; // gcm 통신 실패시 재시도 횟수
    }

    // 모바일 푸시
    public static  final class mobileStatus{
        public static final String WEB = "Y"; // 웹
        public static final String MOBILE = "N"; // 모바일
    }
}
