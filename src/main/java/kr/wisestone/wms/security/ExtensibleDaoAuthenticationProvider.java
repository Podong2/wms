package kr.wisestone.wms.security;

import kr.wisestone.wms.common.constant.MsgConstants;
import kr.wisestone.wms.domain.User;
import kr.wisestone.wms.security.exception.UserPasswordNotValidException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.AbstractUserDetailsAuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsChecker;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import javax.inject.Inject;

/**
 * {@link DaoAuthenticationProvider}를 확장해서 추가 메소드를 구현
 *
 */
public class ExtensibleDaoAuthenticationProvider extends DaoAuthenticationProvider {

    private Logger logger = LoggerFactory.getLogger(ExtensibleDaoAuthenticationProvider.class);

    private UserDetailsService userDetailsService;

    private PasswordEncoder passwordEncoder;

    public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public PasswordEncoder getSpringPasswordEncoder() {
        return this.passwordEncoder;
    }

    public void setUserDetailsService(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    protected UserDetailsService getUserDetailsService() {
        return this.userDetailsService;
    }

    private boolean forcePrincipalAsString = false;

    private UserDetailsChecker preAuthenticationChecks;
    private UserDetailsChecker postAuthenticationChecks;

    public UserDetailsChecker getPreAuthenticationChecks() {
        return preAuthenticationChecks;
    }
    public void setPreAuthenticationChecks(UserDetailsChecker userDetailsChecker) {
        super.setPreAuthenticationChecks(userDetailsChecker);
        this.preAuthenticationChecks = userDetailsChecker;
    }

    public UserDetailsChecker getPostAuthenticationChecks() {
        return postAuthenticationChecks;
    }
    public void setPostAuthenticationChecks(UserDetailsChecker userDetailsChecker) {
        super.setPostAuthenticationChecks(userDetailsChecker);
        this.postAuthenticationChecks = userDetailsChecker;
    }

    protected void doAfterPropertiesSet() throws Exception {
    }

    protected void additionalAuthenticationChecks(UserDetails userDetails, UsernamePasswordAuthenticationToken authentication) throws AuthenticationException {
        Object salt = null;
        if(getSaltSource() != null) {
            salt = getSaltSource().getSalt(userDetails);
        }

        if(authentication.getCredentials() == null) {
            this.logger.debug("Authentication failed: no credentials provided");
            throw new BadCredentialsException(this.messages.getMessage("AbstractUserDetailsAuthenticationProvider.badCredentials", "Bad credentials"));
        } else {
            String presentedPassword = authentication.getCredentials().toString();
            if(!getPasswordEncoder().isPasswordValid(userDetails.getPassword(), presentedPassword, salt)) {
                this.logger.debug("Authentication failed: password does not match stored value");
                throw new BadCredentialsException(this.messages.getMessage("AbstractUserDetailsAuthenticationProvider.badCredentials", "Bad credentials"));
            }
        }
    }

    /**
     * 검증순서를 바꿔달라는 요청으로 인해 해당 메소드를 오버라이드
     *
     * @see AbstractUserDetailsAuthenticationProvider#authenticate(Authentication)
     */
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        Assert.isInstanceOf(UsernamePasswordAuthenticationToken.class, authentication,
                messages.getMessage("AbstractUserDetailsAuthenticationProvider.onlySupports",
                        "Only UsernamePasswordAuthenticationToken is supported"));

        // Determine username
        String username = (authentication.getPrincipal() == null) ? "NONE_PROVIDED" : authentication.getName();

        User user = (User) retrieveUser(username, (UsernamePasswordAuthenticationToken) authentication);

        if(user == null) {
            throw new UsernameNotFoundException("error.authentication.userNotFound");
        }

        if(StringUtils.isEmpty(authentication.getCredentials())) {
            throw new BadCredentialsException("error.authentication.badCredential");
        }

        String presentedPassword = authentication.getCredentials().toString();

        if (!getSpringPasswordEncoder().matches(presentedPassword, user.getPassword())) {
            throw new UserPasswordNotValidException("error.authentication.badCredential");
        }

        preAuthenticationChecks.check(user);
        postAuthenticationChecks.check(user);

        Object principalToReturn = user;

        if (forcePrincipalAsString) {
            principalToReturn = user.getUsername();
        }
//        User loginUser = this.userService.findByUserNo(user.getUsername());
//        loginUser.setFailCount(0);
//        this.userService.save(loginUser);
        return super.createSuccessAuthentication(principalToReturn, authentication, user);
    }

}
