package kr.wisestone.wms.web.rest.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ProjectStatisticsDTO {

    private ProjectDTO project;

    private List<ProjectDTO> projectList = new ArrayList<>();

    private List<ProjectDTO> folderList = new ArrayList<>();

    private List<TaskDTO> projectTasks = new ArrayList<>();

}
