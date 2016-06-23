package kr.wisestone.wms.security;
import kr.wisestone.wms.domain.User;
import kr.wisestone.wms.repository.UserRepository;
import kr.wisestone.wms.security.exception.UserNotActivatedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.util.*;

/**
 * Authenticate a user from the database.
 */
@Component("userDetailsService")
public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    private final Logger log = LoggerFactory.getLogger(UserDetailsService.class);

    @Inject
    private UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(final String login) {
        log.debug("Authenticating {}", login);
        String lowercaseLogin = login.toLowerCase(Locale.ENGLISH);
        Optional<User> userFromDatabase = userRepository.findOneByLogin(lowercaseLogin);

        if(!userFromDatabase.isPresent())
            throw new UsernameNotFoundException("error.authentication.userNotFound");

        if(!userFromDatabase.isPresent())
            throw new UserNotActivatedException("error.authentication.userNotActivated");

        return userFromDatabase.get();
    }
}
