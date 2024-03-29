package kr.wisestone.wms.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.util.ClassUtils;

import javax.persistence.*;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Table(name = "owl_project")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "project")
public class Project extends AbstractAuditingEntity implements Traceable {

    public static final Long STATUS_ACTIVE = 1L;
    public static final Long STATUS_COMPLETE = 2L;
    public static final Long STATUS_HOLD = 3L;
    public static final Long STATUS_CANCEL = 4L;

    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "projectSeqGenerator")
    @TableGenerator(name = "projectSeqGenerator"
        , table = "owl_sequence"
        , initialValue = 10000
        , pkColumnValue = "owl_project_id"
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

    @Column(name = "color")
    private String color;

    @Column(name = "folder_yn")
    @Type(type="yes_no")
    private Boolean folderYn = Boolean.FALSE;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "status_id")
    private Code status;

    @OneToMany(mappedBy = "child", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<ProjectRelation> projectParents = new HashSet<>();

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<ProjectRelation> projectChilds = new HashSet<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @OrderBy(value = "id ASC")
    private Set<ProjectUser> projectUsers = new HashSet<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<ProjectAttachedFile> projectAttachedFiles = new HashSet<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<ProjectSharedAttachedFile> projectSharedAttachedFiles = new HashSet<>();

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

    public Period getPeriod() {
        return period;
    }

    public void setPeriod(Period period) {
        this.period = period;
    }

    public String getContents() {
        return contents;
    }

    public void setContents(String contents) {
        this.contents = contents;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Boolean getFolderYn() {
        return folderYn;
    }

    public void setFolderYn(Boolean folderYn) {
        this.folderYn = folderYn;
    }

    public Code getStatus() {
        return status;
    }

    public void setStatus(Code status) {
        this.status = status;
    }

    public Set<ProjectRelation> getProjectChilds() {
        return projectChilds;
    }

    public void setProjectChilds(Set<ProjectRelation> projectChilds) {
        this.projectChilds = projectChilds;
    }

    public Set<ProjectRelation> getProjectParents() {
        return projectParents;
    }

    public void setProjectParents(Set<ProjectRelation> projectParents) {
        this.projectParents = projectParents;
    }

    public List<Project> getPlainProjectParent() {

        return this.projectParents.stream().map(ProjectRelation::getParent).collect(Collectors.toList());
    }

    public Set<ProjectUser> getProjectUsers() {
        return projectUsers;
    }

    public List<User> getPlainProjectUsers(UserType userType) {

        return this.projectUsers.stream().filter(
            projectUser -> projectUser.getUserType().equals(userType)
        ).map(ProjectUser::getUser).collect(Collectors.toList());
    }

    public void setProjectUsers(Set<ProjectUser> projectUsers) {
        this.projectUsers = projectUsers;
    }

    public Set<ProjectAttachedFile> getProjectAttachedFiles() {
        return projectAttachedFiles;
    }

    public void setProjectAttachedFiles(Set<ProjectAttachedFile> projectAttachedFiles) {
        this.projectAttachedFiles = projectAttachedFiles;
    }

    public ProjectAttachedFile addAttachedFile(AttachedFile attachedFile) {

        if(attachedFile == null) {
            return null;
        }

        ProjectAttachedFile projectAttachedFile = new ProjectAttachedFile(this, attachedFile);

        this.projectAttachedFiles.add(projectAttachedFile);

        return projectAttachedFile;
    }

    public ProjectAttachedFile findAttachedFile(Long attachedFileId) {
        return this.projectAttachedFiles.stream().filter(
            projectAttachedFile -> projectAttachedFile.getAttachedFile().getId().equals(attachedFileId)
        ).findFirst().get();
    }

    public Project removeAttachedFile(Long attachedFileId) {

        ProjectAttachedFile projectAttachedFile = this.findAttachedFile(attachedFileId);

        if(projectAttachedFile != null)
            this.projectAttachedFiles.remove(projectAttachedFile);

        return this;
    }

    public List<AttachedFile> getPlainProjectAttachedFiles() {
        return this.projectAttachedFiles.stream().map(ProjectAttachedFile::getAttachedFile).collect(Collectors.toList());
    }

    public Set<ProjectSharedAttachedFile> getProjectSharedAttachedFiles() {
        return projectSharedAttachedFiles;
    }

    public void setProjectSharedAttachedFiles(Set<ProjectSharedAttachedFile> projectSharedAttachedFiles) {
        this.projectSharedAttachedFiles = projectSharedAttachedFiles;
    }


    public ProjectSharedAttachedFile addSharedAttachedFile(AttachedFile attachedFile) {

        if(attachedFile == null) {
            return null;
        }

        ProjectSharedAttachedFile projectSharedAttachedFile = new ProjectSharedAttachedFile(this, attachedFile);

        this.projectSharedAttachedFiles.add(projectSharedAttachedFile);

        return projectSharedAttachedFile;
    }

    public ProjectSharedAttachedFile findSharedAttachedFile(Long attachedFileId) {
        return this.projectSharedAttachedFiles.stream().filter(
            projectSharedAttachedFile -> projectSharedAttachedFile.getAttachedFile().getId().equals(attachedFileId)
        ).findFirst().get();
    }

    public Project removeSharedAttachedFile(Long attachedFileId) {

        ProjectSharedAttachedFile projectSharedAttachedFile = this.findSharedAttachedFile(attachedFileId);

        if(projectSharedAttachedFile != null)
            this.projectSharedAttachedFiles.remove(projectSharedAttachedFile);

        return this;
    }

    public List<AttachedFile> getPlainProjectSharedAttachedFiles() {
        return this.projectSharedAttachedFiles.stream().map(ProjectSharedAttachedFile::getAttachedFile).collect(Collectors.toList());
    }

    public Project addProjectUser(User user, UserType userType) {

        ProjectUser origin = this.findProjectUser(user, userType);

        if(origin == null)
            this.projectUsers.add(new ProjectUser(this, user, userType));

        return this;
    }

    public Project removeProjectUser(User user, UserType userType) {

        ProjectUser origin = this.findProjectUser(user, userType);

        if(origin != null)
            this.projectUsers.remove(origin);

        return this;
    }

    private ProjectUser findProjectUser(User user, UserType userType) {
        Optional<ProjectUser> origin = this.projectUsers.stream().filter(
            projectUser ->
                projectUser.getUser().getId().equals(user.getId()) && projectUser.getUserType().equals(userType)
        ).findFirst();

        if(origin.isPresent()) return origin.get();
        else return null;
    }

    public Project updateParentProject(Project parent) {

        this.clearParentProject();

        ProjectRelation origin = this.findParentProject(parent);

        if(origin == null && !this.checkIsDuplex(parent) && !parent.getId().equals(this.getId()))
            this.projectParents.add(new ProjectRelation(this, parent));

        return this;
    }

    private Project clearParentProject() {

        this.projectParents.clear();

        return this;
    }

    public Project removeParentProject(Project parent) {

        ProjectRelation origin = this.findParentProject(parent);

        if(origin != null)
            this.projectParents.remove(origin);

        return this;
    }

    private ProjectRelation findParentProject(Project parent) {
        Optional<ProjectRelation> origin = this.projectParents.stream().filter(
            projectParent ->
                projectParent.getParent().getId().equals(parent.getId())
        ).findFirst();

        if(origin.isPresent()) return origin.get();
        else return null;
    }

    private Boolean checkIsDuplex(Project parent) {
        Optional<ProjectRelation> origin = this.projectParents.stream().filter(
            projectParent ->
                projectParent.getChild().getId().equals(parent.getId()) && projectParent.getParent().getId().equals(this.getId())
        ).findFirst();

        if(origin.isPresent()) return Boolean.TRUE;
        else return Boolean.FALSE;
    }

    public Boolean checkRelatedProjectUser(User user) {

        List<ProjectUser> projectUsers = this.getProjectUsers().stream().filter(
            projectUser
                -> projectUser.getUser().getId().equals(user.getId())
        ).collect(Collectors.toList());

        return projectUsers != null && !projectUsers.isEmpty();
    }

    @Override
    public TraceLog getTraceLog(String persisType) {

        TraceLog logRecord = TraceLog.builder(this, persisType);

        logRecord.setProjectId(this.getId());
        logRecord.setEntityName(ClassUtils.getShortName(this.getClass()));
        logRecord.setEntityId(this.getId());

        if (Traceable.PERSIST_TYPE_INSERT.equals(persisType)) {
            logRecord.setNewValue(this.getName());
        } else if (Traceable.PERSIST_TYPE_DELETE.equals(persisType)) {
            logRecord.setOldValue(this.getName());
        }

        return logRecord;
    }
}
