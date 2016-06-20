package kr.wisestone.wms.util;

import kr.wisestone.wms.config.provider.ApplicationContextProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.context.support.WebApplicationContextUtils;

public class ApplicationContextUtil {

    private static final Logger LOGGER = LoggerFactory.getLogger(ApplicationContextUtil.class);

    public static ApplicationContext getApplicationContext() {
        ApplicationContext applicationContext = null;

        ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (requestAttributes == null) {
            return ApplicationContextProvider.getContext();
        }
        applicationContext = WebApplicationContextUtils.getWebApplicationContext(requestAttributes
            .getRequest().getServletContext());

        return applicationContext;
    }

    public static <T> T getBean(Class<T> clazz) {
        ApplicationContext ac = getApplicationContext();
        if (ac == null) {
            return null;
        }
        return ac.getBean(clazz);
    }

    /**
     * 이름을 이용해 빈을 찾는다. 없으면 null을 반환한다.
     *
     * @param name
     * @param clazz
     * @return
     */
    public static <T> T getBean(String name, Class<T> clazz) {
        ApplicationContext ac = getApplicationContext();
        if (ac == null) {
            return null;
        }

        return ac.getBean(name, clazz);
    }
}
