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

    private Boolean sharedYn = Boolean.FALSE;

    private Boolean systemYn = Boolean.FALSE;

    private Boolean loginYn = Boolean.FALSE;


    public Dashboard bind(Dashboard dashboard) {

        dashboard.setName(this.getName());

        dashboard.setDescription(this.getDescription());

        dashboard.setDashboardModel(this.getDashboardModel());

        dashboard.setUseYn(this.getUseYn());
        dashboard.setSharedYn(this.getSharedYn());
        dashboard.setSystemYn(this.getSystemYn());
        dashboard.setLoginYn(this.getLoginYn());

        return dashboard;
    }
}
