package kr.wisestone.wms.web.rest.mapper;

import kr.wisestone.wms.domain.*;
import kr.wisestone.wms.web.rest.dto.SystemRoleDTO;

import org.mapstruct.*;
import java.util.List;

/**
 * Mapper for the entity SystemRole and its DTO SystemRoleDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface SystemRoleMapper {

    SystemRoleDTO systemRoleToSystemRoleDTO(SystemRole systemRole);

    List<SystemRoleDTO> systemRolesToSystemRoleDTOs(List<SystemRole> systemRoles);

    SystemRole systemRoleDTOToSystemRole(SystemRoleDTO systemRoleDTO);

    List<SystemRole> systemRoleDTOsToSystemRoles(List<SystemRoleDTO> systemRoleDTOs);
}
