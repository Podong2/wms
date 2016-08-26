package kr.wisestone.wms.service;

import com.mysema.query.BooleanBuilder;
import kr.wisestone.wms.domain.Dashboard;
import kr.wisestone.wms.domain.QDashboard;
import kr.wisestone.wms.domain.User;
import kr.wisestone.wms.domain.UserDashboard;
import kr.wisestone.wms.repository.DashboardRepository;
import kr.wisestone.wms.security.SecurityUtils;
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

    public DashboardDTO updateDashboard(DashboardForm dashboardForm) {

        Dashboard origin = dashboardRepository.findOne(dashboardForm.getId());
        dashboardForm.bind(origin);

        origin = dashboardRepository.save(origin);

        return dashboardMapper.dashboardToDashboardDTO(origin);
    }

    public DashboardDTO findOne(Long id) {

        Dashboard dashboard = dashboardRepository.findOne(id);

        return dashboardMapper.dashboardToDashboardDTO(dashboard);
    }

    public DashboardDTO findUserDashboard() {

        User loginUser = SecurityUtils.getCurrentUser();

        QDashboard $dashboard = QDashboard.dashboard;

        BooleanBuilder predicate = new BooleanBuilder();

        predicate.and($dashboard.userDashboards.any().user.id.eq(loginUser.getId()));

        Dashboard dashboard = dashboardRepository.findOne(predicate);

        if(dashboard == null) {
            dashboard = new Dashboard();
            dashboard.setName(loginUser.getName()+"'s dashboard");
            dashboard.addUserDashboard(new UserDashboard(loginUser, dashboard));

            dashboard = dashboardRepository.save(dashboard);
        }

        return dashboardMapper.dashboardToDashboardDTO(dashboard);
    }
}
