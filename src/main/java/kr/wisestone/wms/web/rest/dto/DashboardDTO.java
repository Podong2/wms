package kr.wisestone.wms.web.rest.dto;

public class DashboardDTO {

    private Long id;

    private String name;

    private String description;

    private String dashboardModel;

    private Boolean useYn = Boolean.TRUE;

    private Boolean systemYn = Boolean.FALSE;

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

    public Boolean getSystemYn() {
        return systemYn;
    }

    public void setSystemYn(Boolean systemYn) {
        this.systemYn = systemYn;
    }
}
