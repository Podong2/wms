package kr.wisestone.wms.web.rest.form;

import kr.wisestone.wms.domain.Code;
import kr.wisestone.wms.domain.Project;
import kr.wisestone.wms.domain.User;
import lombok.Data;
import org.flywaydb.core.internal.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

@Data
public class ProjectForm {

    private Long id;

    private String name;

    private String startDate;

    private String endDate;

    private String contents;

    private Long statusId;

    private Long adminId;

    private Boolean folderYn = Boolean.FALSE;

    private List<Long> projectUserIds = new ArrayList<>();

    private List<Long> removeProjectUserIds = new ArrayList<>();

    private List<Long> parentProjectIds = new ArrayList<>();

    private List<Long> removeParentProjectIds = new ArrayList<>();

    private List<Long> removeTargetFiles = new ArrayList<>();

    public Project bind(Project project) {

        if(StringUtils.hasText(this.name))
            project.setName(this.name);

        if(StringUtils.hasText(this.startDate))
            project.setStartDate(this.startDate);

        if(StringUtils.hasText(this.endDate))
            project.setEndDate(this.endDate);

        if(StringUtils.hasText(this.contents))
            project.setContents(this.contents);

        project.setFolderYn(folderYn);

        if(this.adminId != null) {
            User admin = new User();
            admin.setId(this.adminId);
            project.setAdmin(admin);
        }

        if(this.statusId != null) {
            Code status = new Code();
            status.setId(this.statusId);
            project.setStatus(status);
        }

        for(Long id : getProjectUserIds()) {
            User user = new User();
            user.setId(id);

            project.addProjectUser(user);
        }

        for(Long id : getRemoveProjectUserIds()) {
            User user = new User();
            user.setId(id);

            project.removeProjectUser(user);
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
