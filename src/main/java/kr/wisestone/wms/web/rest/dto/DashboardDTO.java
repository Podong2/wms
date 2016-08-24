package kr.wisestone.wms.web.rest.dto;

public class DashboardDTO {

    private Long id;

    private String name;

    private String description;

    private String dashboardModel;

    private Boolean useYn = Boolean.TRUE;

    private Boolean sharedYn = Boolean.FALSE;

    private Boolean systemYn = Boolean.FALSE;

    private Boolean loginYn = Boolean.FALSE;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDashboardModel() {
        return dashboardModel;
    }

    public void setDashboardModel(String dashboardModel) {
        this.dashboardModel = dashboardModel;
    }

    public Boolean getUseYn() {
        return useYn;
    }

    public void setUseYn(Boolean useYn) {
        this.useYn = useYn;
    }

    public Boolean getSharedYn() {
        return sharedYn;
    }

    public void setSharedYn(Boolean sharedYn) {
        this.sharedYn = sharedYn;
    }

    public Boolean getSystemYn() {
        return systemYn;
    }

    public void setSystemYn(Boolean systemYn) {
        this.systemYn = systemYn;
    }

    public Boolean getLoginYn() {
        return loginYn;
    }

    public void setLoginYn(Boolean loginYn) {
        this.loginYn = loginYn;
    }
}
