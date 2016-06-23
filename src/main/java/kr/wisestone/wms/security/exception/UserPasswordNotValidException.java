package kr.wisestone.wms.security.exception;

import org.springframework.security.core.AuthenticationException;

public class UserPasswordNotValidException extends AuthenticationException {

    private static final long serialVersionUID = 1L;

    public UserPasswordNotValidException(String message) {
        super(message);
    }

    public UserPasswordNotValidException(String message, Throwable t) {
        super(message, t);
    }
}
