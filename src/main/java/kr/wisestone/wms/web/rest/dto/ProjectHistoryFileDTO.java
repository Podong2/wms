package kr.wisestone.wms.web.rest.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ProjectHistoryFileDTO {

    private List<ProjectHistoryListDTO> projectFiles = new ArrayList<>();

    private Boolean showMoreYn = Boolean.FALSE;


    public ProjectHistoryFileDTO() {

    }

    public ProjectHistoryFileDTO(List<ProjectHistoryListDTO> projectFiles, Integer dateCount) {

        setProjectFiles(projectFiles);

        if(dateCount != null && dateCount > 2) {
            this.setShowMoreYn(Boolean.TRUE);
        }

    }
}
