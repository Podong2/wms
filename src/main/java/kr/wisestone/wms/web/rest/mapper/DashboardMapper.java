package kr.wisestone.wms.web.rest.mapper;

import kr.wisestone.wms.domain.Dashboard;
import kr.wisestone.wms.web.rest.dto.DashboardDTO;
import org.mapstruct.Mapper;

import java.util.List;

/**
 * Mapper for the entity Dashboard and its DTO DashboardDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface DashboardMapper {

    DashboardDTO dashboardToDashboardDTO(Dashboard dashboard);

    List<DashboardDTO> dashboardsToDashboardDTOs(List<Dashboard> dashboards);

    Dashboard dashboardDTOToDashboard(DashboardDTO dashboardDTO);

    List<Dashboard> dashboardDTOsToDashboards(List<DashboardDTO> dashboardDTOs);
}
