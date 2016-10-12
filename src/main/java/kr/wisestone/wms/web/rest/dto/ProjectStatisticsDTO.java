package kr.wisestone.wms.web.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
public class ProjectStatisticsDTO {

    private ProjectDTO project;

    private List<ProjectStatisticsDTO> projectStatisticsChilds = new ArrayList<>();

    private Long projectCount = 0L;

    private Long folderCount = 0L;

    private Long taskCompleteCount = 0L;

    private Long taskTotalCount = 0L;

    private Boolean adminYn = Boolean.FALSE;

    private Boolean memberYn = Boolean.FALSE;

    private Boolean watcherYn = Boolean.FALSE;

    public ProjectStatisticsDTO(ProjectDTO project, Long projectCount, Long folderCount, Long taskCompleteCount, Long taskTotalCount, String loginUser) {
        setProject(project);
        setProjectCount(projectCount);
        setFolderCount(folderCount);
        setTaskCompleteCount(taskCompleteCount);
        setTaskTotalCount(taskTotalCount);

        for(UserDTO admin : project.getProjectAdmins()) {
            if(admin.getLogin().equals(loginUser)) {
                this.adminYn = Boolean.TRUE;

                break;
            }
        }

        if(this.adminYn == Boolean.FALSE) {

            for(UserDTO member : project.getProjectMembers()) {
                if(member.getLogin().equals(loginUser)) {
                    this.memberYn = Boolean.TRUE;

                    break;
                }
            }
        }

        if(this.adminYn == Boolean.FALSE && this.memberYn == Boolean.FALSE) {

            for(UserDTO watcher : project.getProjectWatchers()) {
                if(watcher.getLogin().equals(loginUser)) {
                    this.watcherYn = Boolean.TRUE;

                    break;
                }
            }
        }
    }
}
