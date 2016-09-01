package kr.wisestone.wms.domain;

import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.util.ClassUtils;

import javax.persistence.*;

@Entity
@Table(name = "owl_project_user")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "projectUser")
public class ProjectUser extends AbstractAuditingEntity implements Traceable {

    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "projectUserSeqGenerator")
    @TableGenerator(name = "projectUserSeqGenerator"
        , table = "owl_sequence"
        , initialValue = 10000
        , pkColumnValue = "owl_project_user_id"
        , pkColumnName = "seq_id"
        , valueColumnName = "seq_value"
        , allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_type")
    private UserType userType;

    public ProjectUser() {}

    public ProjectUser(Project project, User user, UserType userType) {
        super();

        this.setProject(project);
        this.setUser(user);
        this.setUserType(userType);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public UserType getUserType() {
        return userType;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }

    @Override
    public TraceLog getTraceLog(String persisType) {

        TraceLog logRecord = TraceLog.builder(this, persisType);

        logRecord.setProjectId(this.getProject().getId());
        logRecord.setEntityName(ClassUtils.getShortName(this.getProject().getClass()));
        logRecord.setEntityField("projectUsers");
        logRecord.setEntityId(this.getProject().getId());
        logRecord.setEtcValue(this.getUserType().getCode());

        if (Traceable.PERSIST_TYPE_INSERT.equals(persisType)) {
            logRecord.setNewValue(this.getUser().getName());
        } else if (Traceable.PERSIST_TYPE_DELETE.equals(persisType)) {
            logRecord.setOldValue(this.getUser().getName());
        }

        return logRecord;
    }
}
