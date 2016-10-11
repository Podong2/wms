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

    public ProjectStatisticsDTO(ProjectDTO project, Long projectCount, Long folderCount, Long taskCompleteCount, Long taskTotalCount) {
        setProject(project);
        setProjectCount(projectCount);
        setFolderCount(folderCount);
        setTaskCompleteCount(taskCompleteCount);
        setTaskTotalCount(taskTotalCount);
    }
}
