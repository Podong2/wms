package kr.wisestone.wms.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import kr.wisestone.wms.web.rest.dto.MenuDTO;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import java.io.Serializable;
import java.util.*;
import java.util.stream.Collectors;

/**
 * A Menu.
 */
@Entity
@Table(name = "owl_menu")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "menu")
public class Menu extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "menuSeqGenerator")
    @TableGenerator(name = "menuSeqGenerator"
        , table = "owl_sequence"
        , initialValue = 10000
        , pkColumnValue = "owl_menu_id"
        , pkColumnName = "seq_id"
        , valueColumnName = "seq_value"
        , allocationSize = 1)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "area")
    private String area;

    @Column(name = "position")
    private Integer position;

    @Column(name = "status")
    private String status;

    @Column(name = "project_yn")
    private Boolean projectYn = Boolean.FALSE;

    @Column(name = "system_yn")
    private Boolean systemYn = Boolean.FALSE;

    @Column(name = "mobile_yn")
    private Boolean mobileYn = Boolean.FALSE;

    @Column(name = "hr_include_yn")
    private Boolean hrIncludeYn = Boolean.FALSE;

    @Column(name = "url_path")
    private String urlPath;

    @Column(name = "permission_url")
    private String permissionUrl;

    @Column(name = "display_yn")
    private Boolean displayYn = Boolean.FALSE;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Menu parent;

    /** 자식 메뉴들 */
    @OneToMany(mappedBy="parent", fetch = FetchType.EAGER)
    @OrderColumn(name="position")
    private List<Menu> childMenus = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy="menu", cascade={CascadeType.ALL}, orphanRemoval=true)
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

    public Menu getParent() {
        return parent;
    }

    public void setParent(Menu parent) {
        this.parent = parent;
    }

    public List<Menu> getChildMenus() {
        return this.childMenus.stream().filter(menu -> menu != null).collect(Collectors.toList());
    }

    public void setChildMenus(List<Menu> childMenus) {
        this.childMenus = childMenus;
    }

    public Set<MenuPermission> getMenuPermissions() {
        return menuPermissions;
    }

    public void setMenuPermissions(Set<MenuPermission> menuPermissions) {
        this.menuPermissions = menuPermissions;
    }

    public Boolean getDisplayYn() {
        return displayYn;
    }

    public void setDisplayYn(Boolean displayYn) {
        this.displayYn = displayYn;
    }

    public String getPermissionUrl() {
        return permissionUrl;
    }

    public void setPermissionUrl(String permissionUrl) {
        this.permissionUrl = permissionUrl;
    }

    public Menu update(MenuDTO menuDTO) {

        this.setId( menuDTO.getId() );
        this.setName( menuDTO.getName() );
        this.setDescription( menuDTO.getDescription() );
        this.setArea( menuDTO.getArea() );
        this.setPosition( menuDTO.getPosition() );
        this.setStatus( menuDTO.getStatus() );
        this.setProjectYn( menuDTO.getProjectYn() );
        this.setSystemYn( menuDTO.getSystemYn() );
        this.setMobileYn( menuDTO.getMobileYn() );
        this.setHrIncludeYn( menuDTO.getHrIncludeYn() );
        this.setUrlPath( menuDTO.getUrlPath() );
        this.setDisplayYn( menuDTO.getDisplayYn() );
        this.setPermissionUrl( menuDTO.getPermissionUrl() );

        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Menu menu = (Menu) o;
        if(menu.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, menu.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Menu{" +
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
