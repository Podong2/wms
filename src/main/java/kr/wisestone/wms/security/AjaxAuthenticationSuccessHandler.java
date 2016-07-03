package kr.wisestone.wms.security;

import com.google.common.collect.Maps;
import kr.wisestone.wms.domain.User;
import kr.wisestone.wms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Spring Security success handler, specialized for Ajax requests.
 */
@Component
public class AjaxAuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Inject
    UserRepository userRepository;

    @Inject
    SessionRegistry sessionRegistry;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
        Authentication authentication)
        throws IOException, ServletException {

        Map<String, Object> resJsonData = Maps.newHashMap();

        User user = (User) authentication.getPrincipal();

        if(authentication != null && authentication.getPrincipal() != null) {
            List<SessionInformation> sessionInformationList = sessionRegistry.getAllSessions(authentication.getPrincipal(), true);

            sessionInformationList.remove(sessionInformationList.size()-1);

            for(SessionInformation sessionInformation : sessionInformationList) {
                sessionInformation.expireNow();
            }
        }

        /* 비밀번호 만료 체크*/ {
//
//            if (StringUtils.hasText(passwordExpireConfig) && passwordExpireConfig.equals("Y")) {
//
//                if (user.getPasswordModifyDate() == null) {
//
//                    resJsonData.put(Constants.RES_KEY_USER, ConvertUtil.copyProperties(user, UserVo.class));
//                    resJsonData.put(Constants.RES_KEY_PAGE_NAME, Constants.FIRST_PAGE_USER_PASSWORD_CHANGE);
//
//                    resMessage = this.ma.getResMessage(MsgConstants.USER_EXPIRED_PASSWORD, Constants.RES_KEY_MSG_EXPIRED);
//                }
//
//                String expirePeriodValue = systemConfigService.findConfigValue(SystemConfig.KEY_PWD_EXPIRE_PERIOD);
//
//                if (CommonUtil.isNumeric(expirePeriodValue)) {
//                    int expirePeriod = Integer.parseInt(expirePeriodValue);
//
//                    int passwordChangedDateDiff = DateUtil.getDateDiff(user.getPasswordModifyDate(), new Date());
//
//                    if (passwordChangedDateDiff >= expirePeriod) {
//                        resJsonData.put(Constants.RES_KEY_USER, ConvertUtil.copyProperties(user, UserVo.class));
//                        resJsonData.put(Constants.RES_KEY_PAGE_NAME, Constants.FIRST_PAGE_USER_PASSWORD_CHANGE);
//
//                        resMessage = this.ma.getResMessage(MsgConstants.USER_EXPIRED_PASSWORD, Constants.RES_KEY_MSG_EXPIRED);
//                    }
//                }
//            }
        }
//
//        if (user.getFailCount() != null && user.getFailCount() > 0) {
//            user.setFailCount(0);
//            this.userRepository.save(user);
//        }

//        if (user.getStatus().equals(User.USER_STATUS_JOIN)) {
//            resJsonData.put(Constants.RES_KEY_PAGE_NAME, Constants.ACCOUNT_ACTIVE);
//        } else if (user.getStatus().equals(User.USER_STATUS_ADD)) {
//            resJsonData.put(Constants.RES_KEY_PAGE_NAME, Constants.FIRST_PAGE_USER_PASSWORD_CHANGE);
//        }
//
//        if (resMessage != null) {
//            resJsonData.put(Constants.RES_KEY_MESSAGE, resMessage);
//        } else {
//            resJsonData.put(Constants.RES_KEY_MESSAGE,
//                this.ma.getResMessage(MsgConstants.SUCCESS_REQUEST, Constants.RES_KEY_MSG_SUCCESS));
//        }

        response.setStatus(HttpServletResponse.SC_OK);
    }
}
