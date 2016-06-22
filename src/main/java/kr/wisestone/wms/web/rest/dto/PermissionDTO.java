package kr.wisestone.wms.web.rest.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;


/**
 * A DTO for the Permission entity.
 */
public class PermissionDTO implements Serializable {

    private Long id;

    private String name;

    private String description;

    private String status;

    private String action;

    private String roleGubun;

    private Boolean rolePermissionYn;

    private Long permissionCategoryId;

    private Long parentId;

    private Boolean activeYn;

    private Set<PermissionDTO> childPermissions;

    public Set<PermissionDTO> getChildPermissions() {
        return childPermissions;
    }

    public void setChildPermissions(Set<PermissionDTO> childPermissions) {
        this.childPermissions = childPermissions;
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

    public Boolean getRolePermissionYn() {
        return rolePermissionYn;
    }

    public void setRolePermissionYn(Boolean rolePermissionYn) {
        this.rolePermissionYn = rolePermissionYn;
    }

    public Long getPermissionCategoryId() {
        return permissionCategoryId;
    }

    public void setPermissionCategoryId(Long permissionCategoryId) {
        this.permissionCategoryId = permissionCategoryId;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public Boolean getActiveYn() {
        return activeYn;
    }

    public void setActiveYn(Boolean activeYn) {
        this.activeYn = activeYn;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        PermissionDTO permissionDTO = (PermissionDTO) o;

        if ( ! Objects.equals(id, permissionDTO.id)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "PermissionDTO{" +
            "id=" + id +
            ", name='" + name + "'" +
            ", description='" + description + "'" +
            ", status='" + status + "'" +
            ", action='" + action + "'" +
            ", roleGubun='" + roleGubun + "'" +
            ", rolePermissionYn='" + rolePermissionYn + "'" +
            '}';
    }
}
