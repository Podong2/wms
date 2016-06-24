package kr.wisestone.wms.web.rest.dto;

import java.io.Serializable;
import java.util.Objects;


/**
 * A DTO for the Code entity.
 */
public class CodeDTO implements Serializable {

    private Long id;

    private String name;

    private Boolean defaultYn;

    private Integer position;

    private String color;

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

        CodeDTO codeDTO = (CodeDTO) o;

        if ( ! Objects.equals(id, codeDTO.id)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "CodeDTO{" +
            "id=" + id +
            ", name='" + name + "'" +
            ", defaultYn='" + defaultYn + "'" +
            ", position='" + position + "'" +
            ", color='" + color + "'" +
            ", codeType='" + codeType + "'" +
            '}';
    }
}
