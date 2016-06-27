package kr.wisestone.wms.domain.support.interceptor;

import kr.wisestone.wms.domain.Code;
import kr.wisestone.wms.domain.TraceLog;
import kr.wisestone.wms.domain.Traceable;
import kr.wisestone.wms.domain.User;
import kr.wisestone.wms.service.TraceLogService;
import kr.wisestone.wms.util.ApplicationContextUtil;
import org.apache.commons.lang.ArrayUtils;
import org.hibernate.CallbackException;
import org.hibernate.EmptyInterceptor;
import org.hibernate.type.Type;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.Serializable;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.Set;

public class TraceLogInterceptor extends EmptyInterceptor {

    private final Logger log = LoggerFactory.getLogger(TraceLogInterceptor.class);

    private final String[] codeField = {""};

    /* (non-Javadoc)
     * @see org.hibernate.EmptyInterceptor#onFlushDirty(java.lang.Object, java.io.Serializable, java.lang.Object[], java.lang.Object[], java.lang.String[], org.hibernate.type.Type[])
     */
    @Override
    public boolean onFlushDirty(Object entity, Serializable id, Object[] currentState,
                                Object[] previousState, String[] propertyNames, Type[] types) throws CallbackException {

        TraceLogService traceLogService = ApplicationContextUtil.getBean(TraceLogService.class);

        log.debug("Update Entity = " + entity.getClass().getName());
        for (String pn :propertyNames) {
            log.debug("Update propertyNames = " + pn);
        }

        if (entity instanceof Traceable) {

            String[] ignoreFields = new String[] { "id", "attachedFiles", "createdBy", "createdDate", "lastModifiedBy", "lastModifiedDate"};
            Field[] allFields = this.getAllFields(entity.getClass(), null);

            fieldIteration: for (Field field : allFields) {
                // 대상 제외
                if (Modifier.isTransient(field.getModifiers())
                    || Modifier.isFinal(field.getModifiers())
                    || Modifier.isStatic(field.getModifiers())) {
                    continue fieldIteration;
                }
                if (ArrayUtils.contains(ignoreFields, field.getName())) {
                    continue fieldIteration;
                }

                // 변경 필드 목록에 존재하는지
                int index = ArrayUtils.indexOf(propertyNames, field.getName());
                if (index < 0) {
                    continue fieldIteration;
                }

                String propertyNewState = this.getPropertyState(currentState[index]);
                String propertyOldState = this.getPropertyState(previousState[index]);
                if (propertyNewState.equals(propertyOldState)) {
                    continue fieldIteration;
                }

                TraceLog logRecord = ((Traceable) entity).getTraceLog(Traceable.PERSIST_TYPE_UPDATE);

                String entityField = field.getName();
                logRecord.setEntityField(entityField);

                if (propertyNewState != null) {
                    if (propertyNewState.length() > 20) {
                        logRecord.setNewValue(propertyNewState.substring(0, 20) + "...");
                    } else {
                        logRecord.setNewValue(propertyNewState);
                    }
                }
                if (propertyOldState != null) {
                    if (propertyOldState.length() > 20) {
                        logRecord.setOldValue(propertyOldState.substring(0, 20) + "...");
                    } else {
                        logRecord.setOldValue(propertyOldState);
                    }
                }

                if (logRecord != null && traceLogService != null) {
                    traceLogService.save(logRecord);
                }
            }

        }

        return true;
    }

    private boolean addNotContains(Set<TraceLog> auditLogs, TraceLog logRecord) {
        for (TraceLog auditLog : auditLogs) {
            if ((auditLog.getEntityName() == null && logRecord.getEntityName() == null) || auditLog.getEntityName().equals(logRecord.getEntityName())) {
                if ((auditLog.getEntityField() == null && logRecord.getEntityField() == null) || auditLog.getEntityField().equals(logRecord.getEntityField())) {
                    if ((auditLog.getEntityId() == null && logRecord.getEntityId() == null) || auditLog.getEntityId().equals(logRecord.getEntityId())) {
                        if ((auditLog.getPersistType() == null && logRecord.getPersistType() == null) || auditLog.getPersistType().equals(logRecord.getPersistType())) {
                            return false;
                        }
                    }
                }
            }
        }

        return true;
    }

    /**
     * @param objProperty
     * @return
     */
    private String getPropertyState(Object objProperty) {
        String propertyState = null;
        try {
            if (objProperty != null) {
                if (objProperty instanceof User) {
                    propertyState = ((User) objProperty).getName();
                } else if (objProperty instanceof Code) {
                    propertyState = ((Code) objProperty).getName();
                } else {
                    propertyState = objProperty.toString();
                }
            } else {
                propertyState = "";
            }
        } catch (Exception e) {
            propertyState = "";
        }
        return propertyState;
    }

    @Override
    public boolean onSave(Object entity, Serializable id, Object[] state, String[] propertyNames,
                          Type[] types) throws CallbackException {

        if (entity instanceof Traceable) {
            TraceLogService traceLogService = ApplicationContextUtil.getBean(TraceLogService.class);

            TraceLog logRecord = ((Traceable) entity).getTraceLog(Traceable.PERSIST_TYPE_INSERT);
            if (logRecord != null && traceLogService != null) {
                traceLogService.save(logRecord);
            }
        }

        return true;
    }

    @Override
    public void onDelete(Object entity, Serializable id, Object[] state, String[] propertyNames,
                         Type[] types) {

        if (entity instanceof Traceable) {
            TraceLogService traceLogService = ApplicationContextUtil.getBean(TraceLogService.class);

            TraceLog logRecord = ((Traceable) entity).getTraceLog(Traceable.PERSIST_TYPE_DELETE);
            if (logRecord != null && traceLogService != null) {
                traceLogService.remove(logRecord);
            }
        }
    }

    /**
     * 주어진 클래스의 모든 필드를 조회한다.
     *
     * @param entityClass
     * @param fields
     * @return
     */
    private Field[] getAllFields(Class entityClass, Field[] fields) {
        Field[] newFields = entityClass.getDeclaredFields();

        int fieldsSize = 0;
        int newFieldsSize = 0;

        if (fields != null) {
            fieldsSize = fields.length;
        }

        if (newFields != null) {
            newFieldsSize = newFields.length;
        }

        Field[] totalFields = new Field[fieldsSize + newFieldsSize];

        if (fieldsSize > 0) {
            System.arraycopy(fields, 0, totalFields, 0, fieldsSize);
        }

        if (newFieldsSize > 0) {
            System.arraycopy(newFields, 0, totalFields, fieldsSize, newFieldsSize);
        }

        Class superClass = entityClass.getSuperclass();

        Field[] finalFieldsArray;

        if (superClass != null && !superClass.getName().equals("java.lang.Object")) {
            finalFieldsArray = this.getAllFields(superClass, totalFields);
        } else {
            finalFieldsArray = totalFields;
        }

        return finalFieldsArray;

    }

    private Serializable getObjectId(Object obj) {
        Class objectClass = obj.getClass();
        Method[] methods = objectClass.getMethods();

        Serializable persistedObjectId = null;
        for (int ii = 0; ii < methods.length; ii++) {
            if (methods[ii].getName().equals("getId")) {
                try {
                    persistedObjectId = (Serializable) methods[ii].invoke(obj, null);
                    break;
                } catch (Exception e) {
                    log.warn("Audit Log Failed - Could not get persisted object id: "
                        + e.getMessage());
                }
            }
        }
        return persistedObjectId;
    }
}
