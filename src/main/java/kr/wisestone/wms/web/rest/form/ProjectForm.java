package kr.wisestone.wms.web.rest.form;

import kr.wisestone.wms.domain.*;
import lombok.Data;
import org.flywaydb.core.internal.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

@Data
public class ProjectForm {

    private Long id;

    private String name;

    private String startDate = "";

    private String endDate = "";

    private String contents;

    private Long statusId;

    private Boolean folderYn = Boolean.FALSE;

    private List<Long> projectAdminIds = new ArrayList<>();

    private List<Long> removeProjectAdminIds = new ArrayList<>();

    private List<Long> projectUserIds = new ArrayList<>();

    private List<Long> removeProjectUserIds = new ArrayList<>();

    private List<Long> parentProjectIds = new ArrayList<>();

    private List<Long> removeParentProjectIds = new ArrayList<>();

    private List<Long> removeTargetFiles = new ArrayList<>();

    public Project bind(Project project) {

        if(StringUtils.hasText(this.name))
            project.setName(this.name);

        if("null".equalsIgnoreCase(this.startDate)) {
            this.startDate = "";
        }

        if("null".equalsIgnoreCase(this.endDate)) {
            this.endDate = "";
        }

        Period period = project.getPeriod();

        if(period == null) {
            period = new Period(this.startDate, this.endDate);
        } else {
            period.setStartDate(this.startDate);
            period.setEndDate(this.endDate);
        }

        project.setPeriod(period);

        if(StringUtils.hasText(this.contents))
            project.setContents(this.contents);

        project.setFolderYn(folderYn);

        if(this.statusId != null) {
            Code status = new Code();
            status.setId(this.statusId);

            project.setStatus(status);
        } else {
            Code status = new Code();
            status.setId(Project.STATUS_ACTIVE);

            project.setStatus(status);
        }

        for(Long id : getProjectAdminIds()) {
            User user = new User();
            user.setId(id);

            project.addProjectUser(user, UserType.ADMIN);
        }


        for(Long id : getRemoveProjectAdminIds()) {
            User user = new User();
            user.setId(id);

            project.removeProjectUser(user, UserType.ADMIN);
        }

        for(Long id : getProjectUserIds()) {
            User user = new User();
            user.setId(id);

            project.addProjectUser(user, UserType.SHARER);
        }


        for(Long id : getRemoveProjectUserIds()) {
            User user = new User();
            user.setId(id);

            project.removeProjectUser(user, UserType.SHARER);
        }

        for(Long id : getParentProjectIds()) {
            Project parent = new Project();
            parent.setId(id);

            project.addParentProject(parent);
        }


        for(Long id : getRemoveParentProjectIds()) {
            Project parent = new Project();
            parent.setId(id);

            project.removeParentProject(parent);
        }

        return project;
    }
}
