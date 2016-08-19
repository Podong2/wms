package kr.wisestone.wms.service;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Maps;
import kr.wisestone.wms.common.constant.NotificationConfig;
import kr.wisestone.wms.common.util.StringTemplateUtil;
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

@Service
public class PushService {

    @Autowired
    private SimpMessagingTemplate template;

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private SpringTemplateEngine templateEngine;

    @Async
    public void sendPush(NotificationParameterDTO notificationParameterDTO) {

        Locale locale = Locale.KOREA;
        Context context = StringTemplateUtil.makeContext(notificationParameterDTO.getContents(), locale);

        NotificationConfig notificationConfig = notificationParameterDTO.getNotificationConfig();

        String content = templateEngine.process(notificationConfig.getPushTemplate(), context);

        String subject = notificationParameterDTO.getTitle();

        if(StringUtils.isEmpty(subject))
            subject = messageSource.getMessage(notificationConfig.getTitle(), null, locale);

        if(StringUtils.hasText(notificationParameterDTO.getTitle()))
            subject = notificationParameterDTO.getTitle();

        Map<String, Object> pushObject = Maps.newHashMap(ImmutableMap.<String, Object>builder().
            put("id", notificationParameterDTO.getId()).
            put("receiveUsers", notificationParameterDTO.getToUsers()).
            put("message", content).
            put("title", subject).
            build());

        if(notificationParameterDTO.getFromUser() != null) {
            pushObject.put("sendUser", notificationParameterDTO.getFromUser());
        }

        for(User toUser : notificationParameterDTO.getToUsers())
            template.convertAndSendToUser(toUser.getLogin(), "/notification/subscribe", pushObject);
    }
}
