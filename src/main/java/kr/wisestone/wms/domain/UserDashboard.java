package kr.wisestone.wms.domain;

import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;

@Entity
@Table(name = "owl_user_dashboard")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "userdashboard")
public class UserDashboard {

    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "userDashboardSeqGenerator")
    @TableGenerator(name = "userDashboardSeqGenerator"
        , table = "owl_sequence"
        , initialValue = 10000
        , pkColumnValue = "owl_user_dashboard_id"
        , pkColumnName = "seq_id"
        , valueColumnName = "seq_value"
        , allocationSize = 1)
    private Long id;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="user_id")
    private User user;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="dashboard_id")
    private Dashboard dashboard;

    @Column(name = "default_yn")
    @Type(type="yes_no")
    private Boolean defaultYn = Boolean.FALSE;

    public UserDashboard() {}

    public UserDashboard(User user, Dashboard dashboard) {
        this.setUser(user);
        this.setDashboard(dashboard);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Dashboard getDashboard() {
        return dashboard;
    }

    public void setDashboard(Dashboard dashboard) {
        this.dashboard = dashboard;
    }

    public Boolean getDefaultYn() {
        return defaultYn;
    }

    public void setDefaultYn(Boolean defaultYn) {
        this.defaultYn = defaultYn;
    }
}
