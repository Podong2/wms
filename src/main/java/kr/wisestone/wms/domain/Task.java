package kr.wisestone.wms.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.common.base.Function;
import com.google.common.base.Predicate;
import com.google.common.collect.Iterables;
import com.google.common.collect.Lists;
import kr.wisestone.wms.common.util.DateUtil;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.util.ClassUtils;
import org.springframework.util.StringUtils;

import javax.annotation.Nullable;
import javax.persistence.*;
import java.io.Serializable;
import java.util.*;
import java.util.stream.Collectors;

/**
 * A Task.
 */
@Entity
@Table(name = "owl_task")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "task")
public class Task extends AbstractAuditingEntity implements Serializable, Traceable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "taskSeqGenerator")
    @TableGenerator(name = "taskSeqGenerator"
        , table = "owl_sequence"
        , initialValue = 10000
        , pkColumnValue = "owl_task_id"
        , pkColumnName = "seq_id"
        , valueColumnName = "seq_value"
        , allocationSize = 1)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "start_date")
    private String startDate;

    @Column(name = "end_date")
    private String endDate;

    @Column(name = "contents")
    private String contents;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "status_id")
    private Code status;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<TaskAttachedFile> taskAttachedFiles = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Task parent;

    @OneToMany(mappedBy = "parent")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Task> subTasks = new HashSet<>();

    @Column(name = "important_yn")
    @Type(type="yes_no")
    private Boolean importantYn = Boolean.FALSE;

    @Column(name = "template_yn")
    @Type(type="yes_no")
    private Boolean templateYn = Boolean.FALSE;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy(value = "id asc")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<TaskUser> taskUsers = new HashSet<>();

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<RelatedTask> relatedTasks = new HashSet<>();

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<TaskProject> taskProjects = new HashSet<>();

    public Task() {

    }

    public Task(String name) {
        setName(name);
    }

    @Override
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

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public String getContents() {
        return contents;
    }

    public void setContents(String contents) {
        this.contents = contents;
    }

    public Code getStatus() {
        return status;
    }

    public void setStatus(Code code) {
        this.status = code;
    }

    public Set<TaskAttachedFile> getTaskAttachedFiles() {
        return taskAttachedFiles;
    }

    public void setTaskAttachedFiles(Set<TaskAttachedFile> taskAttachedFiles) {
        this.taskAttachedFiles = taskAttachedFiles;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public Task getParent() {
        return parent;
    }

    public void setParent(Task parent) {
        this.parent = parent;
    }

    public Set<Task> getSubTasks() {
        return subTasks;
    }

    public void setSubTasks(Set<Task> subTasks) {
        this.subTasks = subTasks;
    }

    public Boolean getImportantYn() {
        return importantYn;
    }

    public void setImportantYn(Boolean importantYn) {
        this.importantYn = importantYn;
    }

    public Boolean getTemplateYn() {
        return templateYn;
    }

    public void setTemplateYn(Boolean templateYn) {
        this.templateYn = templateYn;
    }

    public Set<TaskUser> getTaskUsers() {
        return taskUsers;
    }

    public void setTaskUsers(Set<TaskUser> taskUsers) {
        this.taskUsers = taskUsers;
    }

    public Set<RelatedTask> getRelatedTasks() {
        return relatedTasks;
    }

    public List<Task> getPlainRelatedTask() {

        return relatedTasks.stream().map(RelatedTask::getRelatedTask).collect(Collectors.toList());
    }

    public void setRelatedTasks(Set<RelatedTask> relatedTasks) {
        this.relatedTasks = relatedTasks;
    }

    public Task addTaskUser(User user, TaskUserType taskUserType) {

        Optional<TaskUser> origin = this.taskUsers.stream().filter(
            taskUser ->
                taskUser.getUserType().equals(taskUserType) && taskUser.getUser().getId().equals(user.getId())
        ).findFirst();

        if(!origin.isPresent())
            this.taskUsers.add(new TaskUser(this, user, taskUserType));

        return this;
    }

    public Task removeTaskUser(User user, TaskUserType taskUserType) {

        Optional<TaskUser> origin = this.taskUsers.stream().filter(
            taskUser ->
                taskUser.getUserType().equals(taskUserType) && taskUser.getUser().getId().equals(user.getId())
        ).findFirst();

        if(origin.isPresent())
            this.taskUsers.remove(origin.get());

        return this;
    }

    public List<User> findTaskUsersByType(TaskUserType taskUserType) {

        List<TaskUser> taskUsers = this.taskUsers.stream().filter(
                                        taskUser -> taskUser.getUserType().equals(taskUserType)
                                    ).collect(Collectors.toList());

        return taskUsers.stream().map(TaskUser::getUser).collect(Collectors.toList());
    }

    public Task addRelatedTask(Task task) {

        Optional<RelatedTask> origin = this.relatedTasks.stream().filter(
            relatedTask ->
                relatedTask.getRelatedTask().getId().equals(task.getId())
        ).findFirst();

        if(!origin.isPresent())
            this.relatedTasks.add(new RelatedTask(this, task));

        return this;
    }

    public Task removeRelatedTask(Task task) {

        Optional<RelatedTask> origin = this.relatedTasks.stream().filter(
            relatedTask ->
                relatedTask.getTask().getId().equals(task.getId())
        ).findFirst();

        if(origin.isPresent())
            this.relatedTasks.remove(origin.get());

        return this;
    }

    public TaskAttachedFile addAttachedFile(AttachedFile attachedFile) {

        if(attachedFile == null) {
            return null;
        }

        TaskAttachedFile taskAttachedFile = new TaskAttachedFile(this, attachedFile);

        this.taskAttachedFiles.add(taskAttachedFile);

        return taskAttachedFile;
    }

    public TaskAttachedFile findAttachedFile(Long attachedFileId) {
        return this.taskAttachedFiles.stream().filter(
            taskAttachedFile -> taskAttachedFile.getId().equals(attachedFileId)
        ).findFirst().get();
    }

    public Task removeAttachedFile(Long attachedFileId) {

        TaskAttachedFile taskAttachedFile = this.findAttachedFile(attachedFileId);

        if(taskAttachedFile != null)
            this.taskAttachedFiles.remove(taskAttachedFile);

        return this;
    }

    public Set<TaskProject> getTaskProjects() {
        return taskProjects;
    }

    public void setTaskProjects(Set<TaskProject> taskProjects) {
        this.taskProjects = taskProjects;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Task task = (Task) o;
        if(task.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, task.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Task{" +
            "id=" + id +
            ", name='" + name + "'" +
            ", endDate='" + endDate + "'" +
            ", contents='" + contents + "'" +
            '}';
    }

    @Override
    public TraceLog getTraceLog(String persisType) {

        TraceLog logRecord = TraceLog.builder(this, persisType);

        if(this.parent == null) {
            logRecord.setTaskId(this.getId());
        } else {
            logRecord.setTaskId(this.getParent().getId());
            logRecord.setEntityName(ClassUtils.getShortName(this.getParent().getClass()));
            logRecord.setEntityField("subTasks");
            logRecord.setEntityId(this.getId());
        }

        if (Traceable.PERSIST_TYPE_INSERT.equals(persisType)) {
            logRecord.setNewValue(this.getName());
        } else if (Traceable.PERSIST_TYPE_DELETE.equals(persisType)) {
            logRecord.setOldValue(this.getName());
        }

        return logRecord;
    }
}
