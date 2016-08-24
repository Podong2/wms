package kr.wisestone.wms.service;

import kr.wisestone.wms.domain.Dashboard;
import kr.wisestone.wms.repository.DashboardRepository;
import kr.wisestone.wms.web.rest.dto.DashboardDTO;
import kr.wisestone.wms.web.rest.form.DashboardForm;
import kr.wisestone.wms.web.rest.mapper.DashboardMapper;
import org.springframework.stereotype.Service;

import javax.inject.Inject;

@Service
public class DashboardService {

    @Inject
    private DashboardRepository dashboardRepository;

    @Inject
    private DashboardMapper dashboardMapper;

    public DashboardDTO saveDashboard(DashboardForm dashboardForm) {

        Dashboard dashboard = dashboardForm.bind(new Dashboard());

        dashboard = dashboardRepository.save(dashboard);

        return dashboardMapper.dashboardToDashboardDTO(dashboard);
    }

    public DashboardDTO updateDashboardDTO(DashboardForm dashboardForm) {

        Dashboard origin = dashboardRepository.findOne(dashboardForm.getId());
        dashboardForm.bind(origin);

        origin = dashboardRepository.save(origin);

        return dashboardMapper.dashboardToDashboardDTO(origin);
    }

    public DashboardDTO findOne(Long id) {

        Dashboard dashboard = dashboardRepository.findOne(id);

        return dashboardMapper.dashboardToDashboardDTO(dashboard);
    }
}
