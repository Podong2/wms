package kr.wisestone.wms.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.*;
import org.hibernate.annotations.Cache;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "owl_project")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "project")
public class Project extends AbstractAuditingEntity {

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

    @Column(name = "start_date")
    private String startDate;

    @Column(name = "end_date")
    private String endDate;

    @Column(name = "contents")
    private String contents;

    @Column(name = "folder_yn")
    @Type(type="yes_no")
    private Boolean folderYn = Boolean.FALSE;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "status_id")
    private Code status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Project parent;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    private User admin;

    @OneToMany(mappedBy = "parent")
    @JsonIgnore
    @org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Project> subProjects = new HashSet<>();

    @OneToMany(mappedBy = "project")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<ProjectUser> projectUsers = new HashSet<>();

    @OneToMany(mappedBy = "project")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<ProjectAttachedFile> projectAttachedFiles = new HashSet<>();

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

    public String getContents() {
        return contents;
    }

    public void setContents(String contents) {
        this.contents = contents;
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

    public Project getParent() {
        return parent;
    }

    public void setParent(Project parent) {
        this.parent = parent;
    }

    public User getAdmin() {
        return admin;
    }

    public void setAdmin(User admin) {
        this.admin = admin;
    }

    public Set<Project> getSubProjects() {
        return subProjects;
    }

    public void setSubProjects(Set<Project> subProjects) {
        this.subProjects = subProjects;
    }

    public Set<ProjectUser> getProjectUsers() {
        return projectUsers;
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
}
