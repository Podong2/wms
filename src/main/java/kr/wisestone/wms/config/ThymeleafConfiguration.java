package kr.wisestone.wms.config;

import org.apache.commons.lang.CharEncoding;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.*;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

@Configuration
public class ThymeleafConfiguration {

    @SuppressWarnings("unused")
    private final Logger log = LoggerFactory.getLogger(ThymeleafConfiguration.class);

    @Bean
    @Description("Thymeleaf template resolver serving HTML 5 emails")
    public ClassLoaderTemplateResolver emailTemplateResolver() {
        ClassLoaderTemplateResolver emailTemplateResolver = new ClassLoaderTemplateResolver();
        emailTemplateResolver.setPrefix("mails/");
        emailTemplateResolver.setSuffix(".html");
        emailTemplateResolver.setTemplateMode("HTML5");
        emailTemplateResolver.setCharacterEncoding(CharEncoding.UTF_8);
        emailTemplateResolver.setOrder(1);
        return emailTemplateResolver;
    }

    @Bean
    @Description("Thymeleaf template resolver serving HTML 5 pushes")
    public ClassLoaderTemplateResolver pushTemplateResolver() {
        ClassLoaderTemplateResolver pushTemplateResolver = new ClassLoaderTemplateResolver();
        pushTemplateResolver.setPrefix("push/");
        pushTemplateResolver.setSuffix(".html");
        pushTemplateResolver.setTemplateMode("HTML5");
        pushTemplateResolver.setCharacterEncoding(CharEncoding.UTF_8);
        pushTemplateResolver.setOrder(1);
        return pushTemplateResolver;
    }
}
