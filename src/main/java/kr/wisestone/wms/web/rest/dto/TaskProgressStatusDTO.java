package kr.wisestone.wms.web.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskProgressStatusDTO {

    private TaskDTO taskDTO;

    private Long totalCount;

    private Long completeCount;
}
