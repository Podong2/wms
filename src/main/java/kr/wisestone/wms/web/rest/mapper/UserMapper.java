package kr.wisestone.wms.web.rest.mapper;

import kr.wisestone.wms.domain.Authority;
import kr.wisestone.wms.domain.Company;
import kr.wisestone.wms.domain.Department;
import kr.wisestone.wms.domain.User;
import kr.wisestone.wms.web.rest.dto.UserDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Mapper for the entity User and its DTO UserDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface UserMapper {

    @Mapping(source = "company.name", target = "companyName")
    @Mapping(source = "department.name", target = "departmentName")
    @Mapping(source = "company.id", target = "companyId")
    @Mapping(source = "department.id", target = "departmentId")
    @Mapping(source = "profileImage.id", target = "profileImageId")
    @Mapping(source = "profileImage", target = "profileImage", ignore = true)
    UserDTO userToUserDTO(User user);

    List<UserDTO> usersToUserDTOs(List<User> users);

    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "persistentTokens", ignore = true)
    @Mapping(target = "activationKey", ignore = true)
    @Mapping(target = "resetKey", ignore = true)
    @Mapping(target = "resetDate", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "profileImage", ignore = true)
    @Mapping(source = "companyId", target = "company")
    @Mapping(source = "departmentId", target = "department")
    User userDTOToUser(UserDTO userDTO);

    List<User> userDTOsToUsers(List<UserDTO> userDTOs);

    default Company companyFromId(Long id) {
        if (id == null) {
            return null;
        }
        Company company = new Company();
        company.setId(id);
        return company;
    }

    default Department departmentFromId(Long id) {
        if (id == null) {
            return null;
        }
        Department department = new Department();
        department.setId(id);
        return department;
    }

    default User userFromId(Long id) {
        if (id == null) {
            return null;
        }
        User user = new User();
        user.setId(id);
        return user;
    }

    default Set<String> stringsFromAuthorities (Set<Authority> authorities) {
        return authorities.stream().map(Authority::getName)
            .collect(Collectors.toSet());
    }

    default Set<Authority> authoritiesFromStrings(Set<String> strings) {
        return strings.stream().map(string -> {
            Authority auth = new Authority();
            auth.setName(string);
            return auth;
        }).collect(Collectors.toSet());
    }
}
