package kr.wisestone.wms.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A SystemRole.
 */
@Entity
@Table(name = "owl_system_role")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "systemrole")
public class SystemRole extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "systemRoleSeqGenerator")
    @TableGenerator(name = "systemRoleSeqGenerator"
        , table = "owl_sequence"
        , initialValue = 10000
        , pkColumnValue = "owl_system_role_id"
        , pkColumnName = "seq_id"
        , valueColumnName = "seq_value"
        , allocationSize = 1)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "role_gubun")
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
        SystemRole systemRole = (SystemRole) o;
        if(systemRole.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, systemRole.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "SystemRole{" +
            "id=" + id +
            ", name='" + name + "'" +
            ", description='" + description + "'" +
            ", roleGubun='" + roleGubun + "'" +
            '}';
    }
}
