package kr.wisestone.wms.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.util.ClassUtils;

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

    public static final Long STATUS_ACTIVE = 1L;
    public static final Long STATUS_COMPLETE = 2L;
    public static final Long STATUS_HOLD = 3L;
    public static final Long STATUS_CANCEL = 4L;


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

    @Embedded
    @AttributeOverrides({@AttributeOverride(name="startDate", column=@Column(name="start_date"))
        ,@AttributeOverride(name="endDate", column=@Column(name="end_date"))})
    private Period period;

    @Column(name = "contents")
    private String contents;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "status_id")
    private Code status;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<TaskAttachedFile> taskAttachedFiles = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Task parent;

    @OneToMany(mappedBy = "parent", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Task> subTasks = new HashSet<>();

    @Column(name = "important_yn")
    @Type(type="yes_no")
    private Boolean importantYn = Boolean.FALSE;

    @Column(name = "template_yn")
    @Type(type="yes_no")
    private Boolean templateYn = Boolean.FALSE;

    @Column(name = "private_yn")
    @Type(type="yes_no")
    private Boolean privateYn = Boolean.FALSE;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy(value = "id ASC")
    @JsonIgnore
    private Set<TaskUser> taskUsers = new HashSet<>();

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<RelatedTask> relatedTasks = new HashSet<>();

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<TaskProject> taskProjects = new HashSet<>();

    @OneToOne(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private TaskRepeatSchedule taskRepeatSchedule;

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

    public List<AttachedFile> getPlainTaskAttachedFiles() {
        return taskAttachedFiles.stream().map(TaskAttachedFile::getAttachedFile).collect(Collectors.toList());
    }

    public Period getPeriod() {
        return period;
    }

    public void setPeriod(Period period) {
        this.period = period;
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

        List<Task> transformedTasks = relatedTasks.stream().map(RelatedTask::getRelatedTask).collect(Collectors.toList());;

        return transformedTasks;
    }

    public void setRelatedTasks(Set<RelatedTask> relatedTasks) {
        this.relatedTasks = relatedTasks;
    }

    public Task addTaskUser(User user, UserType userType) {

        Optional<TaskUser> origin = findTaskUser(user, userType);

        if(!origin.isPresent())
            this.taskUsers.add(new TaskUser(this, user, userType));

        return this;
    }

    public Optional<TaskUser> findTaskUser(User user, UserType userType) {
        return this.taskUsers.stream().filter(
            taskUser ->
                taskUser.getUserType().equals(userType) && taskUser.getUser().getId().equals(user.getId())
        ).findFirst();
    }

    public Task removeTaskUser(User user, UserType userType) {

        Optional<TaskUser> origin = findTaskUser(user, userType);

        if(origin.isPresent())
            this.taskUsers.remove(origin.get());

        return this;
    }

    public List<User> findTaskUsersByType(UserType userType) {

        List<TaskUser> taskUsers = this.taskUsers.stream().filter(
                                        taskUser -> taskUser.getUserType().equals(userType)
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
                relatedTask.getRelatedTask().getId().equals(task.getId())
        ).findFirst();

        if(origin.isPresent())
            this.relatedTasks.remove(origin.get());

        return this;
    }

    public Task updateTaskProject(Project project) {

        this.clearTaskProject();

        Optional<TaskProject> origin = this.findTaskProject(project);

        if(!origin.isPresent())
            this.taskProjects.add(new TaskProject(this, project));

        return this;
    }

    private Task clearTaskProject() {

        this.taskProjects.clear();

        return this;
    }

    public Optional<TaskProject> findTaskProject(Project project) {
        return this.taskProjects.stream().filter(
            taskProject ->
                taskProject.getProject().getId().equals(project.getId())
        ).findFirst();
    }

    public Task removeTaskProject(Project project) {

        Optional<TaskProject> origin = this.findTaskProject(project);

        if(origin.isPresent())
            this.taskProjects.remove(origin.get());

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
            taskAttachedFile -> taskAttachedFile.getAttachedFile().getId().equals(attachedFileId)
        ).findFirst().orElse(null);
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

    public List<Project> getPlainTaskProject() {

        return this.taskProjects.stream().map(TaskProject::getProject).collect(Collectors.toList());
    }

    public TaskRepeatSchedule getTaskRepeatSchedule() {
        return taskRepeatSchedule;
    }

    public void setTaskRepeatSchedule(TaskRepeatSchedule taskRepeatSchedule) {
        this.taskRepeatSchedule = taskRepeatSchedule;
    }

    public Boolean getPrivateYn() {
        return privateYn;
    }

    public void setPrivateYn(Boolean privateYn) {
        this.privateYn = privateYn;
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
            ", contents='" + contents + "'" +
            '}';
    }

    @Override
    public TraceLog getTraceLog(String persisType) {

        TraceLog logRecord = TraceLog.builder(this, persisType);

        if(this.parent == null) {
            logRecord.setTaskId(this.getId());
        } else {
            if (Traceable.PERSIST_TYPE_INSERT.equals(persisType)) {
                logRecord.setTaskId(this.getParent().getId());
            } else if (Traceable.PERSIST_TYPE_UPDATE.equals(persisType)) {
                logRecord.setTaskId(this.getId());
            } else if (Traceable.PERSIST_TYPE_DELETE.equals(persisType)) {
                logRecord.setTaskId(this.getParent().getId());
            }


            String entityName = ClassUtils.getShortName(this.getParent().getClass());

            logRecord.setEntityName(entityName.replaceAll("_", ""));
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
