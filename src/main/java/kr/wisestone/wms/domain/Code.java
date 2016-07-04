package kr.wisestone.wms.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A Code.
 */
@Entity
@Table(name = "owl_code")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "code")
public class Code extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    private static final String CODE_TYPE_SEVERITY = "severity";
    private static final String CODE_TYPE_PRIORITY = "priority";
    private static final String CODE_TYPE_RESOLUTION = "resolution";

    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "codeSeqGenerator")
    @TableGenerator(name = "codeSeqGenerator"
        , table = "owl_sequence"
        , initialValue = 10000
        , pkColumnValue = "owl_code_id"
        , pkColumnName = "seq_id"
        , valueColumnName = "seq_value"
        , allocationSize = 1)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "default_yn")
    @Type(type="yes_no")
    private Boolean defaultYn;

    @Column(name = "position")
    private Integer position;

    @Column(name = "color")
    private String color;

    @Column(name = "code_type")
    private String codeType;

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

    public Boolean isDefaultYn() {
        return defaultYn;
    }

    public Boolean getDefaultYn() {
        return defaultYn;
    }

    public void setDefaultYn(Boolean defaultYn) {
        this.defaultYn = defaultYn;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getCodeType() {
        return codeType;
    }

    public void setCodeType(String codeType) {
        this.codeType = codeType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Code code = (Code) o;
        if(code.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, code.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Code{" +
            "id=" + id +
            ", name='" + name + "'" +
            ", defaultYn='" + defaultYn + "'" +
            ", position='" + position + "'" +
            ", color='" + color + "'" +
            ", codeType='" + codeType + "'" +
            '}';
    }
}
