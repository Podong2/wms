package kr.wisestone.wms.common.util;

import org.thymeleaf.context.Context;

import java.util.Locale;
import java.util.Map;

public class StringTemplateUtil {

    public static Context makeContext(Map<String, Object> contents, Locale locale) {
        Context context = new Context(locale);

        for(String key : contents.keySet()) {
            context.setVariable(key, contents.get(key));
        }
        return context;
    }
}
