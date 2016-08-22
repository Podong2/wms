package kr.wisestone.wms.web.rest.mapper;

import kr.wisestone.wms.domain.Code;
import kr.wisestone.wms.domain.Project;
import kr.wisestone.wms.domain.User;
import kr.wisestone.wms.web.rest.dto.ProjectDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

/**
 * Mapper for the entity Task and its DTO TaskDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface ProjectMapper {

    @Mapping(source = "status.id", target = "statusId")
    @Mapping(source = "status.name", target = "statusName")
    @Mapping(source = "projectParents", target = "projectParents", ignore = true)
    @Mapping(source = "projectChilds", target = "projectChilds", ignore = true)
    @Mapping(source = "projectUsers", target = "projectUsers", ignore = true)
    @Mapping(source = "projectUsers", target = "projectAdmins", ignore = true)
    ProjectDTO projectToProjectDTO(Project project);

    List<ProjectDTO> projectsToProjectDTOs(List<Project> projects);

    @Mapping(source = "statusId", target = "status")
    @Mapping(source = "projectParents", target = "projectParents", ignore = true)
    @Mapping(source = "projectChilds", target = "projectChilds", ignore = true)
    @Mapping(target = "projectUsers", ignore = true)
    Project projectDTOToProject(ProjectDTO projectDTO);

    List<Project> projectDTOsToProjects(List<ProjectDTO> projectDTOs);

    default Code codeFromId(Long id) {
        if (id == null) {
            return null;
        }
        Code code = new Code();
        code.setId(id);
        return code;
    }

    default User userFromId(Long id) {
        if (id == null) {
            return null;
        }
        User user = new User();
        user.setId(id);
        return user;
    }
}
