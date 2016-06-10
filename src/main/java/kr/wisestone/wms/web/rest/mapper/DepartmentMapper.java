package kr.wisestone.wms.web.rest.mapper;

import kr.wisestone.wms.domain.*;
import kr.wisestone.wms.web.rest.dto.DepartmentDTO;

import org.mapstruct.*;
import java.util.List;

/**
 * Mapper for the entity Department and its DTO DepartmentDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface DepartmentMapper {

    @Mapping(source = "company.id", target = "companyId")
    @Mapping(source = "parent.id", target = "parentId")
    DepartmentDTO departmentToDepartmentDTO(Department department);

    List<DepartmentDTO> departmentsToDepartmentDTOs(List<Department> departments);

    @Mapping(target = "subDepartments", ignore = true)
    @Mapping(source = "companyId", target = "company")
    @Mapping(source = "parentId", target = "parent")
    Department departmentDTOToDepartment(DepartmentDTO departmentDTO);

    List<Department> departmentDTOsToDepartments(List<DepartmentDTO> departmentDTOs);

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
}
