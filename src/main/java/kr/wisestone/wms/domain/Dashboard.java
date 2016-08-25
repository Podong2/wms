package kr.wisestone.wms.domain;

import org.hibernate.annotations.*;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "owl_dashboard")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "dashboard")
public class Dashboard {

    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "dashboardSeqGenerator")
    @TableGenerator(name = "dashboardSeqGenerator"
        , table = "owl_sequence"
        , initialValue = 10000
        , pkColumnValue = "owl_dashboard_id"
        , pkColumnName = "seq_id"
        , valueColumnName = "seq_value"
        , allocationSize = 1)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "dashboard_model")
    private String dashboardModel;

    @Column(name = "use_yn")
    @Type(type = "yes_no")
    private Boolean useYn = Boolean.TRUE;

    @Column(name = "shared_yn")
    @Type(type = "yes_no")
    private Boolean sharedYn = Boolean.FALSE;

    @Column(name = "system_yn")
    @Type(type = "yes_no")
    private Boolean systemYn = Boolean.FALSE;

    @Column(name = "login_yn")
    @Type(type = "yes_no")
    private Boolean loginYn = Boolean.FALSE;

    @OneToMany(mappedBy = "dashboard", cascade = { CascadeType.ALL }, orphanRemoval = true)
    private Set<UserDashboard> userDashboards = new HashSet<>();


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

    public Set<UserDashboard> getUserDashboards() {
        return userDashboards;
    }

    public void setUserDashboards(Set<UserDashboard> userDashboards) {
        this.userDashboards = userDashboards;
    }

    public void addUserDashboard(UserDashboard userDashboard) {
        this.userDashboards.add(userDashboard);
    }
}
