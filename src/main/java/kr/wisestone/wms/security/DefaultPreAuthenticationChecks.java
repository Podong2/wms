package kr.wisestone.wms.security;

import kr.wisestone.wms.domain.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsChecker;

public class DefaultPreAuthenticationChecks implements UserDetailsChecker {

	private Logger logger = LoggerFactory.getLogger(DefaultPreAuthenticationChecks.class);

	@SuppressWarnings("deprecation")
	public void check(UserDetails userDetails) {

		logger.debug("DefaultPreAuthenticationChecks.check");

		if(User.class.isAssignableFrom(userDetails.getClass())) {

			User user = (User) userDetails;

			if (!user.isAccountNonLocked()) {
				logger.debug("User account is locked");

//				throw new OwlLoginProcessingException(MsgConstants.USER_NOT_AUTHORIZED);
			}

			if (!user.isEnabled()) {
				logger.debug("User account is disabled");

//				throw new OwlLoginProcessingException(MsgConstants.USER_NOT_AUTHORIZED);
			}

			if (!user.isAccountNonExpired()) {
				logger.debug("User account is expired");

//				throw new OwlLoginProcessingException(MsgConstants.USER_EXPIRED_PASSWORD);
			}
		}

	}

}
