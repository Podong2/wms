package kr.wisestone.wms.web.rest.form;

import kr.wisestone.wms.domain.Dashboard;
import lombok.Data;

@Data
public class DashboardForm {

    private Long id;

    private String name;

    private String description;

    private String dashboardModel;

    private Boolean useYn = Boolean.TRUE;

    private Boolean systemYn = Boolean.FALSE;


    public Dashboard bind(Dashboard dashboard) {

        dashboard.setName(this.getName());

        dashboard.setDescription(this.getDescription());

        dashboard.setDashboardModel(this.getDashboardModel());

        dashboard.setUseYn(this.getUseYn());
        dashboard.setSystemYn(this.getSystemYn());

        return dashboard;
    }
}
