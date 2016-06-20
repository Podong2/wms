package kr.wisestone.wms.web.rest.dto;

import kr.wisestone.wms.config.Constants;
import kr.wisestone.wms.domain.Authority;
import kr.wisestone.wms.domain.Company;
import kr.wisestone.wms.domain.Department;
import kr.wisestone.wms.domain.User;
import lombok.Data;
import org.hibernate.validator.constraints.Email;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.util.Set;
import java.util.stream.Collectors;
/**
 * A DTO representing a user, with his authorities.
 */
@Data
public class UserDTO {

    @NotNull
    @Pattern(regexp = Constants.LOGIN_REGEX)
    @Size(min = 1, max = 100)
    private String login;

    @Size(max = 50)
    private String name;

    @Email
    @Size(min = 5, max = 100)
    private String email;

    private boolean activated = false;

    @Size(min = 2, max = 5)
    private String langKey;

    private Set<String> authorities;

    private Long companyId;

    private Long departmentId;

    public UserDTO() {
    }

    public UserDTO(User user) {
        this(user.getLogin(), user.getName(), user.getEmail()
            , user.getActivated(), user.getLangKey(),
            user.getAuthorities().stream().map(Authority::getName)
                .collect(Collectors.toSet()), user.getCompany(), user.getDepartment());
    }

    public UserDTO(String login, String name, String email
                , boolean activated, String langKey, Set<String> authorities) {

        this.login = login;
        this.name = name;
        this.email = email;
        this.activated = activated;
        this.langKey = langKey;
        this.authorities = authorities;
    }

    public UserDTO(String login, String name, String email, boolean activated
        , String langKey, Set<String> authorities, Company company, Department department) {

        this.login = login;
        this.name = name;
        this.email = email;
        this.activated = activated;
        this.langKey = langKey;
        this.authorities = authorities;
        if(company != null)
            this.companyId = company.getId();

        if(department != null)
            this.departmentId = department.getId();
    }

    @Override
    public String toString() {
        return "UserDTO{" +
            "login='" + login + '\'' +
            ", name='" + name + '\'' +
            ", email='" + email + '\'' +
            ", activated=" + activated +
            ", langKey='" + langKey + '\'' +
            ", authorities=" + authorities +
            "}";
    }
}
