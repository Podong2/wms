package kr.wisestone.wms.web.rest.mapper;

import kr.wisestone.wms.domain.*;
import kr.wisestone.wms.web.rest.dto.PermissionCategoryDTO;

import org.mapstruct.*;
import java.util.List;

/**
 * Mapper for the entity PermissionCategory and its DTO PermissionCategoryDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface PermissionCategoryMapper {

    PermissionCategoryDTO permissionCategoryToPermissionCategoryDTO(PermissionCategory permissionCategory);

    List<PermissionCategoryDTO> permissionCategoriesToPermissionCategoryDTOs(List<PermissionCategory> permissionCategories);

    PermissionCategory permissionCategoryDTOToPermissionCategory(PermissionCategoryDTO permissionCategoryDTO);

    List<PermissionCategory> permissionCategoryDTOsToPermissionCategories(List<PermissionCategoryDTO> permissionCategoryDTOs);
}
