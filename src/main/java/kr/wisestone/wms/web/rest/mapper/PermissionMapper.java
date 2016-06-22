package kr.wisestone.wms.web.rest.mapper;

import kr.wisestone.wms.domain.*;
import kr.wisestone.wms.web.rest.dto.PermissionDTO;

import org.mapstruct.*;
import java.util.List;

/**
 * Mapper for the entity Permission and its DTO PermissionDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface PermissionMapper {

    @Mapping(source = "permissionCategory.id", target = "permissionCategoryId")
    @Mapping(source = "parent.id", target = "parentId")
    @Mapping(source = "childPermissions", target = "childPermissions")
    PermissionDTO permissionToPermissionDTO(Permission permission);

    List<PermissionDTO> permissionsToPermissionDTOs(List<Permission> permissions);

    @Mapping(source = "permissionCategoryId", target = "permissionCategory")
    @Mapping(source = "parentId", target = "parent")
    Permission permissionDTOToPermission(PermissionDTO permissionDTO);

    List<Permission> permissionDTOsToPermissions(List<PermissionDTO> permissionDTOs);

    default PermissionCategory permissionCategoryFromId(Long id) {
        if (id == null) {
            return null;
        }
        PermissionCategory permissionCategory = new PermissionCategory();
        permissionCategory.setId(id);
        return permissionCategory;
    }

    default Permission permissionFromId(Long id) {
        if (id == null) {
            return null;
        }
        Permission permission = new Permission();
        permission.setId(id);
        return permission;
    }
}
