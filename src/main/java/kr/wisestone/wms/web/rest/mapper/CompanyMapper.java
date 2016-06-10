package kr.wisestone.wms.web.rest.mapper;

import kr.wisestone.wms.domain.*;
import kr.wisestone.wms.web.rest.dto.CompanyDTO;

import org.mapstruct.*;
import java.util.List;

/**
 * Mapper for the entity Company and its DTO CompanyDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface CompanyMapper {

    CompanyDTO companyToCompanyDTO(Company company);

    List<CompanyDTO> companiesToCompanyDTOs(List<Company> companies);

    Company companyDTOToCompany(CompanyDTO companyDTO);

    List<Company> companyDTOsToCompanies(List<CompanyDTO> companyDTOs);
}
