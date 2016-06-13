package kr.wisestone.wms.web.rest.dto;

import java.io.Serializable;
import java.util.Objects;


/**
 * A DTO for the SystemRole entity.
 */
public class SystemRoleDTO implements Serializable {

    private Long id;

    private String name;

    private String description;

    private String roleGubun;


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
    public String getRoleGubun() {
        return roleGubun;
    }

    public void setRoleGubun(String roleGubun) {
        this.roleGubun = roleGubun;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        SystemRoleDTO systemRoleDTO = (SystemRoleDTO) o;

        if ( ! Objects.equals(id, systemRoleDTO.id)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "SystemRoleDTO{" +
            "id=" + id +
            ", name='" + name + "'" +
            ", description='" + description + "'" +
            ", roleGubun='" + roleGubun + "'" +
            '}';
    }
}
