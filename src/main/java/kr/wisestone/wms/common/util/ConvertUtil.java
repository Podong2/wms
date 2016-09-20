/**
 * 상기 프로그램에 대한 저작권을 포함한 지적재산권은 WiseStone에 있으며,
 * WiseStone이 명시적으로 허용하지 않은 사용, 복사, 변경, 제3자에의 공개,
 * 배포는 엄격히 금지되며, WiseStone의 지적재산권 침해에 해당됩니다.
 * (Copyright ⓒ 2014 WiseStone Co., Ltd. All Rights Reserved|Confidential)
 *-----------------------------------------------------------------------------
 * You are strictly prohibited to copy, disclose, distribute, modify,
 * or use this program in part or as a whole without the prior written
 * consent of WiseStone Co., Ltd. WiseStone Co., Ltd., owns the
 * intellectual property rights in and to this program.
 * (Copyright ⓒ 2014 WiseStone Co., Ltd. All Rights Reserved|Confidential)
 *-----------------------------------------------------------------------------
 */
package kr.wisestone.wms.common.util;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import kr.wisestone.wms.common.exception.CommonRuntimeException;
import org.apache.commons.lang.ArrayUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 * 변경이력
 * -------------------------------------------------------
 * DATE         :  Author             : Documents
 * 2014. 7. 29.     jyoh@wisestone.kr    최초 작성
 * -------------------------------------------------------
 * </pre>
 */
public class ConvertUtil {

    private final Logger log = LoggerFactory.getLogger(ConvertUtil.class);

    public static <T> List<T> convertListToListClass(List<Map<String, Object>> sources,
                                                     Class<T> clazz, String... ignores) {
        List<T> targets = new ArrayList<T>();

        for (Map<String, Object> source : sources) {
            targets.add(convertMapToClass(source, clazz, ignores));
        }

        return targets;
    }

    public static <T> List<T> convertListToListClass(List<Map<String, Object>> sources,
                                                     Class<T> clazz) {
        return convertListToListClass(sources, clazz, new String[] {});
    }

    public static <T> T convertMapToClass(Map<String, Object> source, Class<T> clazz, String... ignores) {
        Object objClass = null;
        try {
            objClass = clazz.newInstance();
        } catch (Exception e) {
            throw new CommonRuntimeException("failed convert ", e);
        }
        convertMapToObject(source, objClass, ignores);

        return (T) objClass;
    }

    public static Object convertMapToObject(Map<String, Object> map,
                                            Object objClass, String... ignores) {
        String keyAttribute = null;
        Iterator<String> itr = map.keySet().iterator();
        while (itr.hasNext()) {
            keyAttribute = itr.next();

            if (ArrayUtils.contains(ignores, keyAttribute)) {
                continue;
            }
            if (map.get(keyAttribute) == null) {
                continue;
            }

            PropertyDescriptor propertyDescriptor = BeanUtils.getPropertyDescriptor(objClass.getClass(), keyAttribute);
            try {
                Method method = propertyDescriptor.getWriteMethod();

                if (propertyDescriptor.getPropertyType() == String.class) {
                    method.invoke(objClass, map.get(keyAttribute).toString());
                } else if (propertyDescriptor.getPropertyType() == Integer.class) {
                    method.invoke(objClass, new Integer(map.get(keyAttribute).toString()));
                } else if (propertyDescriptor.getPropertyType() == Long.class) {
                    method.invoke(objClass, Long.valueOf(map.get(keyAttribute).toString()));
                } else if (propertyDescriptor.getPropertyType() == Boolean.class) {
                    if ("Y".equalsIgnoreCase(map.get(keyAttribute).toString())) {
                        method.invoke(objClass, Boolean.TRUE);
                    } else if ("true".equalsIgnoreCase(map.get(keyAttribute).toString())) {
                        method.invoke(objClass, Boolean.TRUE);
                    } else {
                        method.invoke(objClass, Boolean.FALSE);
                    }
                }
            } catch (Exception e) {
//                e.printStackTrace();
            }
        }
        return objClass;
    }

    public static String convertObjectToJson(Object target) {
        String json;
        ObjectMapper mapper = getObjectMapper();

        try {
            json = mapper.writeValueAsString(target);
        } catch (Exception e) {
            throw new CommonRuntimeException("failed convert to json", e);
        }

        return json;
    }

    public static <T> T convertJsonToObject(String json, Class<T> targetClass) {

        T object;

        ObjectMapper mapper = getObjectMapper();

        try {
            object = mapper.readValue(json, targetClass);
        } catch (Exception e) {
            throw new CommonRuntimeException("failed convert from json", e);
        }

        return object;
    }

    private static ObjectMapper getObjectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        return mapper;
    }
}
