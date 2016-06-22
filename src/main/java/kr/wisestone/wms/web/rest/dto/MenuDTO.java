package kr.wisestone.wms.web.rest.dto;

import java.io.Serializable;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.Objects;


/**
 * A DTO for the Menu entity.
 */
public class MenuDTO implements Serializable {

    private Long id;

    private String name;

    private String description;

    private String area;

    private Integer position;

    private String status;

    private Boolean projectYn;

    private Boolean systemYn;

    private Boolean mobileYn;

    private Boolean hrIncludeYn;

    private String urlPath;

    private Long parentId;

    private List<MenuDTO> childMenus;

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
    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }
    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    public Boolean getProjectYn() {
        return projectYn;
    }

    public void setProjectYn(Boolean projectYn) {
        this.projectYn = projectYn;
    }
    public Boolean getSystemYn() {
        return systemYn;
    }

    public void setSystemYn(Boolean systemYn) {
        this.systemYn = systemYn;
    }
    public Boolean getMobileYn() {
        return mobileYn;
    }

    public void setMobileYn(Boolean mobileYn) {
        this.mobileYn = mobileYn;
    }
    public Boolean getHrIncludeYn() {
        return hrIncludeYn;
    }

    public void setHrIncludeYn(Boolean hrIncludeYn) {
        this.hrIncludeYn = hrIncludeYn;
    }
    public String getUrlPath() {
        return urlPath;
    }

    public void setUrlPath(String urlPath) {
        this.urlPath = urlPath;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long menuId) {
        this.parentId = menuId;
    }

    public List<MenuDTO> getChildMenus() {
        return childMenus;
    }

    public void setChildMenus(List<MenuDTO> childMenus) {
        this.childMenus = childMenus;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        MenuDTO menuDTO = (MenuDTO) o;

        if ( ! Objects.equals(id, menuDTO.id)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "MenuDTO{" +
            "id=" + id +
            ", name='" + name + "'" +
            ", description='" + description + "'" +
            ", area='" + area + "'" +
            ", position='" + position + "'" +
            ", status='" + status + "'" +
            ", projectYn='" + projectYn + "'" +
            ", systemYn='" + systemYn + "'" +
            ", mobileYn='" + mobileYn + "'" +
            ", hrIncludeYn='" + hrIncludeYn + "'" +
            ", urlPath='" + urlPath + "'" +
            '}';
    }
}
