package kr.wisestone.wms.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import kr.wisestone.wms.web.rest.dto.TaskRepeatScheduleDTO;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.util.ClassUtils;
import org.springframework.util.StringUtils;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A TaskAttachedFile.
 */
@Entity
@Table(name = "owl_task_repeat_schedule")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "taskrepeatschedule")
public class TaskRepeatSchedule extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final String REPEAT_TYPE_DAILY = "DAILY";
    public static final String REPEAT_TYPE_WEEKLY = "WEEKLY";
    public static final String REPEAT_TYPE_MONTHLY_DATE = "MONTHLY_DATE";
    public static final String REPEAT_TYPE_MONTHLY_WEEKDAY = "MONTHLY_WEEKDAY";
    public static final String REPEAT_TYPE_ANNUALLY = "ANNUALLY";

    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "taskRepeatScheduleSeqGenerator")
    @TableGenerator(name = "taskRepeatScheduleSeqGenerator"
        , table = "owl_sequence"
        , initialValue = 10000
        , pkColumnValue = "owl_task_repeat_schedule_id"
        , pkColumnName = "seq_id"
        , valueColumnName = "seq_value"
        , allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    @JsonIgnore
    private Task task;

    @Column(name = "repeat_yn")
    @Type(type="yes_no")
    private Boolean repeatYn = Boolean.FALSE;

    @Column(name = "repeat_type")
    private String repeatType;

    @Column(name = "weekdays")
    private String weekdays;

    @Column(name = "monthly_criteria")
    private String monthlyCriteria;

    @Column(name = "advent_date_start_time")
    private String adventDateStartTime;

    @Column(name = "start_date")
    private String startDate;

    @Column(name = "end_date")
    private String endDate;

    @Column(name = "permanent_yn")
    @Type(type="yes_no")
    private Boolean permanentYn;

    @Column(name = "execute_date")
    private String executeDate;

    public TaskRepeatSchedule() {}

    public TaskRepeatSchedule(Task task, TaskRepeatScheduleDTO taskRepeatSchedule) {

        this.setTask(task);

        this.setRepeatYn(taskRepeatSchedule.getRepeatYn());

        if(StringUtils.isEmpty(taskRepeatSchedule.getRepeatType()))
            this.setRepeatYn(Boolean.FALSE);

        this.setRepeatType(taskRepeatSchedule.getRepeatType());
        this.setWeekdays(taskRepeatSchedule.getWeekdays());
        this.setMonthlyCriteria(taskRepeatSchedule.getMonthlyCriteria());
        this.setAdventDateStartTime(taskRepeatSchedule.getAdventDateStartTime());
        this.setStartDate(taskRepeatSchedule.getStartDate());
        this.setEndDate(taskRepeatSchedule.getEndDate());
        this.setPermanentYn(taskRepeatSchedule.getPermanentYn());
    }

    public TaskRepeatSchedule update(TaskRepeatScheduleDTO taskRepeatSchedule) {

        this.setRepeatYn(taskRepeatSchedule.getRepeatYn());

        if(StringUtils.isEmpty(taskRepeatSchedule.getRepeatType()))
            this.setRepeatYn(Boolean.FALSE);

        this.setRepeatType(taskRepeatSchedule.getRepeatType());
        this.setWeekdays(taskRepeatSchedule.getWeekdays());
        this.setMonthlyCriteria(taskRepeatSchedule.getMonthlyCriteria());
        this.setAdventDateStartTime(taskRepeatSchedule.getAdventDateStartTime());
        this.setStartDate(taskRepeatSchedule.getStartDate());
        this.setEndDate(taskRepeatSchedule.getEndDate());
        this.setPermanentYn(taskRepeatSchedule.getPermanentYn());

        return this;
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

    public Boolean getRepeatYn() {
        return repeatYn;
    }

    public void setRepeatYn(Boolean repeatYn) {
        this.repeatYn = repeatYn;
    }

    public String getRepeatType() {
        return repeatType;
    }

    public void setRepeatType(String repeatType) {
        this.repeatType = repeatType;
    }

    public String getWeekdays() {
        return weekdays;
    }

    public void setWeekdays(String weekdays) {
        this.weekdays = weekdays;
    }

    public String getMonthlyCriteria() {
        return monthlyCriteria;
    }

    public void setMonthlyCriteria(String monthlyCriteria) {
        this.monthlyCriteria = monthlyCriteria;
    }

    public String getAdventDateStartTime() {
        return adventDateStartTime;
    }

    public void setAdventDateStartTime(String adventDateStartTime) {
        this.adventDateStartTime = adventDateStartTime;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public Boolean getPermanentYn() {
        return permanentYn;
    }

    public void setPermanentYn(Boolean permanentYn) {
        this.permanentYn = permanentYn;
    }

    public String getExecuteDate() {
        return executeDate;
    }

    public void setExecuteDate(String executeDate) {
        this.executeDate = executeDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        TaskRepeatSchedule taskRepeatSchedule = (TaskRepeatSchedule) o;
        if(taskRepeatSchedule.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, taskRepeatSchedule.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "TaskRepeatSchedule{" +
            "id=" + id +
            '}';
    }

}
