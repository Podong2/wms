package kr.wisestone.wms.domain;

public enum TaskApprovalStatus {

    //요청자
    APPROVAL_REQUEST("approval_request", "승인요청"),
    CANCEL_REQUEST("cancel_request", "요청취소"),


    //승인자
    APPROVAL_COMPLETE("approval_complete", "approval_complete"),
    APPROVAL_REJECT("approval_reject", "approval_reject"),
    ;

    private String code;
    private String description;

    TaskApprovalStatus(String code, String description) {
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
