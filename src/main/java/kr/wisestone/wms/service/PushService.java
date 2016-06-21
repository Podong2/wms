package kr.wisestone.wms.service;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Maps;
import kr.wisestone.wms.common.constant.NotificationConfig;
import kr.wisestone.wms.domain.User;
import kr.wisestone.wms.service.dto.NotificationParameterDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring4.SpringTemplateEngine;

import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@Service
public class PushService {

    @Autowired
    private SimpMessagingTemplate template;

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private SpringTemplateEngine templateEngine;

    @Autowired
    private UserService userService;

    @Async
    public void sendPush(NotificationParameterDTO notificationParameterDTO) {

        Locale locale = Locale.KOREA;
        Context context = StringTemplateUtil.makeContext(notificationParameterDTO.getContents(), locale);

        NotificationConfig notificationConfig = notificationParameterDTO.getNotificationConfig();

        String content = templateEngine.process("commonPush", context);
        String subject = notificationConfig.getTitle();

        if(StringUtils.hasText(notificationParameterDTO.getTitle()))
            subject = notificationParameterDTO.getTitle();

        Map<String, Object> pushObject = Maps.newHashMap(ImmutableMap.<String, Object>builder().
            put("id", notificationParameterDTO.getId()).
            put("message", content).
            put("title", subject).
            build());

        Optional<User> userOptional = userService.getUserWithAuthoritiesByLogin(notificationParameterDTO.getFromUser());

        if(notificationParameterDTO.getFromUser() != null) {
            pushObject.put("sendUser", userOptional.get());
        }

        for(User toUser : notificationParameterDTO.getToUsers())
            template.convertAndSendToUser(toUser.getLogin(), "/notification/subscribe", pushObject);
    }

    public static class StringTemplateUtil {

        public static Context makeContext(Map<String, Object> contents, Locale locale) {
            Context context = new Context(locale);

            for(String key : contents.keySet()) {
                context.setVariable(key, contents.get(key));
            }
            return context;
        }
    }
}
