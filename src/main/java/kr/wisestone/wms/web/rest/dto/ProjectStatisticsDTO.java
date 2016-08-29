package kr.wisestone.wms.web.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectStatisticsDTO {

    private ProjectDTO project;

    private Long projectCount = 0L;

    private Long folderCount = 0L;

    private Long taskCompleteCount = 0L;

    private Long taskTotalCount = 0L;
}
