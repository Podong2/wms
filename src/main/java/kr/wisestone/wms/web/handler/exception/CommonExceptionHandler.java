package kr.wisestone.wms.web.handler.exception;

import kr.wisestone.wms.common.constant.Constants;
import kr.wisestone.wms.common.constant.MsgConstants;
import kr.wisestone.wms.common.exception.CommonRuntimeException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.orm.jpa.JpaObjectRetrievalFailureException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.support.HandlerMethodInvocationException;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.persistence.NonUniqueResultException;
import javax.validation.ConstraintViolationException;
import java.util.HashMap;
import java.util.Map;

@RestController
public class CommonExceptionHandler extends ResponseEntityExceptionHandler {

    private final Logger log = LoggerFactory.getLogger(CommonExceptionHandler.class);

    @ExceptionHandler({ IncorrectResultSizeDataAccessException.class })
    public ResponseEntity<Object> handleBadRequest(final IncorrectResultSizeDataAccessException ex,
                                                   final WebRequest request) {
        Map<String, Object> resJsonData = new HashMap<String, Object>();
        resJsonData.put(Constants.RES_KEY_MESSAGE, MsgConstants.ERR_NON_UNIQUE_RESULT);

        return this.handleExceptionInternal(ex, resJsonData, new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    @ExceptionHandler({ NonUniqueResultException.class })
    public ResponseEntity<Object> handleBadRequest(final NonUniqueResultException ex,
                                                   final WebRequest request) {
        Map<String, Object> resJsonData = new HashMap<String, Object>();
        resJsonData.put(Constants.RES_KEY_MESSAGE, MsgConstants.ERR_NON_UNIQUE_RESULT);

        return this.handleExceptionInternal(ex, resJsonData, new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    @ExceptionHandler({ CommonRuntimeException.class })
    public ResponseEntity<Object> handleBadRequest(final CommonRuntimeException ex,
                                                   final WebRequest request) {
        Map<String, Object> resJsonData = new HashMap<String, Object>();
        resJsonData.put(Constants.RES_KEY_MESSAGE, MsgConstants.ERR_BAD_REQUEST);

        return this.handleExceptionInternal(ex, resJsonData, new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler({ JpaObjectRetrievalFailureException.class })
    public ResponseEntity<Object> handleBadRequest(final JpaObjectRetrievalFailureException ex,
                                                   final WebRequest request) {
        Map<String, Object> resJsonData = new HashMap<String, Object>();
        resJsonData.put(Constants.RES_KEY_MESSAGE, MsgConstants.ERR_INVALID_ENTITY);

        return this.handleExceptionInternal(ex, resJsonData, new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    @ExceptionHandler({ ConstraintViolationException.class })
    public ResponseEntity<Object> handleBadRequest(final ConstraintViolationException ex,
                                                   final WebRequest request) {
        final String bodyOfResponse = "This should be application specific1";
        return this.handleExceptionInternal(ex, bodyOfResponse, new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR,
            request);
    }

    @ExceptionHandler({ DataIntegrityViolationException.class })
    public ResponseEntity<Object> handleBadRequest(final DataIntegrityViolationException ex,
                                                   final WebRequest request) {
        Map<String, Object> resJsonData = new HashMap<String, Object>();
        resJsonData.put(Constants.RES_KEY_MESSAGE, MsgConstants.ERR_DATA_INTEGRITY_VIOLATION);

        return this.handleExceptionInternal(ex, resJsonData, new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    @ExceptionHandler({ InvalidDataAccessApiUsageException.class, DataAccessException.class })
    protected ResponseEntity<Object> handleConflict(final RuntimeException ex,
                                                    final WebRequest request) {
        final String bodyOfResponse = "This should be application specific409";
        return this.handleExceptionInternal(ex, bodyOfResponse, new HttpHeaders(), HttpStatus.CONFLICT,
            request);
    }

    @ExceptionHandler({ StackOverflowError.class, HandlerMethodInvocationException.class,
        NullPointerException.class, IllegalArgumentException.class, IllegalStateException.class })
    public ResponseEntity<Object> handleInternal(final RuntimeException ex, final WebRequest request) {
        Map<String, Object> resJsonData = new HashMap<String, Object>();
        resJsonData.put(Constants.RES_KEY_MESSAGE, MsgConstants.NOT_READABLE_JSON_DATA);

        return this.handleExceptionInternal(ex, resJsonData, new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    @ExceptionHandler({ Exception.class })
    public ResponseEntity<Object> handleInternal(final Exception ex, final WebRequest request) {
        Map<String, Object> resJsonData = new HashMap<String, Object>();
        resJsonData.put(Constants.RES_KEY_MESSAGE, MsgConstants.NOT_READABLE_JSON_DATA);

        return this.handleExceptionInternal(ex, resJsonData, new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(
        final HttpMessageNotReadableException ex, final HttpHeaders headers,
        final HttpStatus status, final WebRequest request) {
        Map<String, Object> resJsonData = new HashMap<String, Object>();
        resJsonData.put(Constants.RES_KEY_MESSAGE, MsgConstants.NOT_READABLE_JSON_DATA);

        return this.handleExceptionInternal(ex, resJsonData, headers, HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
        final MethodArgumentNotValidException ex, final HttpHeaders headers,
        final HttpStatus status, final WebRequest request) {
        final String bodyOfResponse = "This should be application specific4";
        return this.handleExceptionInternal(ex, bodyOfResponse, headers, HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    @Override
    protected ResponseEntity<Object> handleExceptionInternal(Exception ex, Object body, HttpHeaders headers,
                                                             HttpStatus status, WebRequest request) {
        log.error(ex.getMessage(), ex);
        return super.handleExceptionInternal(ex, body, headers, status, request);
    }
}
