package kr.wisestone.wms.domain;

import org.hibernate.annotations.*;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "owl_task_approval")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "taskApproval")
public class TaskApproval extends AbstractAuditingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "taskApprovalSeqGenerator")
    @TableGenerator(name = "taskApprovalSeqGenerator"
        , table = "owl_sequence"
        , initialValue = 10000
        , pkColumnValue = "owl_task_approval_id"
        , pkColumnName = "seq_id"
        , valueColumnName = "seq_value"
        , allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id")
    private User requester;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private TaskApprovalStatus approvalStatus;

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

    public User getRequester() {
        return requester;
    }

    public void setRequester(User requester) {
        this.requester = requester;
    }

    public TaskApprovalStatus getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(TaskApprovalStatus approvalStatus) {
        this.approvalStatus = approvalStatus;
    }
}
