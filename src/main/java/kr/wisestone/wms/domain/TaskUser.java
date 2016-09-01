package kr.wisestone.wms.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.util.ClassUtils;

import javax.persistence.*;

@Entity
@Table(name = "owl_task_user")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "taskUser")
public class TaskUser extends AbstractAuditingEntity implements Traceable {

    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "taskUserSeqGenerator")
    @TableGenerator(name = "taskUserSeqGenerator"
        , table = "owl_sequence"
        , initialValue = 10000
        , pkColumnValue = "owl_task_user_id"
        , pkColumnName = "seq_id"
        , valueColumnName = "seq_value"
        , allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_type")
    private UserType userType;

    public TaskUser() {}

    public TaskUser(Task task, User user, UserType type) {
        this.setTask(task);
        this.setUser(user);
        this.setUserType(type);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
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

    public void setUserType(UserType type) {
        this.userType = type;
    }


    @Override
    public TraceLog getTraceLog(String persisType) {

        TraceLog logRecord = TraceLog.builder(this, persisType);

        logRecord.setTaskId(this.getTask().getId());
        logRecord.setEntityName(ClassUtils.getShortName(this.getTask().getClass()));
        logRecord.setEntityField("taskUsers");
        logRecord.setEntityId(this.getTask().getId());
        logRecord.setEtcValue(this.getUserType().getCode());

        if (Traceable.PERSIST_TYPE_INSERT.equals(persisType)) {
            logRecord.setNewValue(this.getUser().getName());
        } else if (Traceable.PERSIST_TYPE_DELETE.equals(persisType)) {
            logRecord.setOldValue(this.getUser().getName());
        }

        return logRecord;
    }
}
