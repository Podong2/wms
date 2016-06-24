package kr.wisestone.wms.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import kr.wisestone.wms.web.rest.dto.PermissionDTO;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import java.io.Serializable;
import java.util.*;
import java.util.stream.Collectors;

/**
 * A Permission.
 */
@Entity
@Table(name = "owl_permission")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "permission")
public class Permission extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "permissionSeqGenerator")
    @TableGenerator(name = "permissionSeqGenerator"
        , table = "owl_sequence"
        , initialValue = 10000
        , pkColumnValue = "owl_permission_id"
        , pkColumnName = "seq_id"
        , valueColumnName = "seq_value"
        , allocationSize = 1)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "status")
    private String status;

    @Column(name = "action")
    private String action;

    @Column(name = "role_gubun")
    private String roleGubun;

    @Column(name = "role_permission_yn")
    private Boolean rolePermissionYn;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "permission_category_id")
    private PermissionCategory permissionCategory;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Permission parent;

    @OneToMany(mappedBy="parent")
    private List<Permission> childPermissions = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy="permission", cascade={CascadeType.ALL})
    private Set<SystemRolePermission> systemRolePermissions = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy="permission", cascade={CascadeType.ALL})
    private Set<MenuPermission> menuPermissions = new HashSet<>();

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getRoleGubun() {
        return roleGubun;
    }

    public void setRoleGubun(String roleGubun) {
        this.roleGubun = roleGubun;
    }

    public void setRolePermissionYn(Boolean rolePermissionYn) {
        this.rolePermissionYn = rolePermissionYn;
    }

    public PermissionCategory getPermissionCategory() {
        return permissionCategory;
    }

    public void setPermissionCategory(PermissionCategory permissionCategory) {
        this.permissionCategory = permissionCategory;
    }

    public Permission getParent() {
        return parent;
    }

    public void setParent(Permission permission) {
        this.parent = permission;
    }

    public Set<MenuPermission> getMenuPermissions() {
        return menuPermissions;
    }

    public void setMenuPermissions(Set<MenuPermission> menuPermissions) {
        this.menuPermissions = menuPermissions;
    }

    public Boolean getRolePermissionYn() {
        return rolePermissionYn;
    }

    public List<Permission> getChildPermissions() {
        return this.childPermissions.stream().filter(menu -> menu != null).collect(Collectors.toList());
    }

    public void setChildPermissions(List<Permission> childPermissions) {
        this.childPermissions = childPermissions;
    }

    public Set<SystemRolePermission> getSystemRolePermissions() {
        return systemRolePermissions;
    }

    public void setSystemRolePermissions(Set<SystemRolePermission> systemRolePermissions) {
        this.systemRolePermissions = systemRolePermissions;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Permission permission = (Permission) o;
        if(permission.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, permission.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Permission{" +
            "id=" + id +
            ", name='" + name + "'" +
            ", description='" + description + "'" +
            ", status='" + status + "'" +
            ", action='" + action + "'" +
            ", roleGubun='" + roleGubun + "'" +
            ", rolePermissionYn='" + rolePermissionYn + "'" +
            '}';
    }

    public Permission update(PermissionDTO permissionDTO) {

        this.setId( permissionDTO.getId() );
        this.setName( permissionDTO.getName() );
        this.setDescription( permissionDTO.getDescription() );
        this.setStatus( permissionDTO.getStatus() );
        this.setAction( permissionDTO.getAction() );
        this.setRoleGubun( permissionDTO.getRoleGubun() );
        this.setRolePermissionYn( permissionDTO.getRolePermissionYn() );

        return this;
    }
}
