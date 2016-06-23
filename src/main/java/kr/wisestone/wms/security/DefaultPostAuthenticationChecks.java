package kr.wisestone.wms.security;

import kr.wisestone.wms.domain.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsChecker;

public class DefaultPostAuthenticationChecks implements UserDetailsChecker {

    private static Logger logger = LoggerFactory.getLogger(DefaultPostAuthenticationChecks.class);

    @SuppressWarnings("deprecation")
    public void check(UserDetails userDetails) {
        if(User.class.isAssignableFrom(userDetails.getClass())) {
            User user = (User) userDetails;

            // 사용자 비밀번호가 만료되었는지 검증
            if(!user.isCredentialsNonExpired()) {
                logger.debug("User account credentials have expired");

//                throw new OwlLoginProcessingException(MsgConstants.USER_EXPIRED_PASSWORD);
            }
        }
    }

}
