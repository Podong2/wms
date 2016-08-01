package kr.wisestone.wms.domain;

import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;

@Entity
@Table(name = "owl_task_approver")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "taskApprover")
public class TaskApprover extends AbstractAuditingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "taskApproverSeqGenerator")
    @TableGenerator(name = "taskApproverSeqGenerator"
        , table = "owl_sequence"
        , initialValue = 10000
        , pkColumnValue = "owl_task_approver_id"
        , pkColumnName = "seq_id"
        , valueColumnName = "seq_value"
        , allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_approval_id")
    private TaskApproval taskApproval;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approver_id")
    private User approver;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TaskApproval getTaskApproval() {
        return taskApproval;
    }

    public void setTaskApproval(TaskApproval taskApproval) {
        this.taskApproval = taskApproval;
    }

    public User getApprover() {
        return approver;
    }

    public void setApprover(User approver) {
        this.approver = approver;
    }
}
