package kr.wisestone.wms.common.exception;

public class CommonRuntimeException extends RuntimeException {

    private String code;

    public CommonRuntimeException() {
        super();
    }

    public CommonRuntimeException(String code, final String message,
                               final Throwable cause) {
        super(message, cause);
        this.code = code;
    }

    public CommonRuntimeException(String code, final String message) {
        super(message);
        this.code = code;
    }

    public CommonRuntimeException(Exception e) {
        super(e);
    }

    public CommonRuntimeException(String code) {
        this.code = code;
    }

    public CommonRuntimeException(String code, Exception e) {
        super(e);
        this.code = code;
    }

    public String getCode() {
        return this.code;
    }
}
