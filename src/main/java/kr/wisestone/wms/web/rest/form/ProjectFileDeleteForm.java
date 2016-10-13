package kr.wisestone.wms.web.rest.form;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
public class ProjectFileDeleteForm {

    public List<ProjectFileDeleteObject> projectFileDeleteTargets = new ArrayList<>();

    @Data
    @NoArgsConstructor
    public class ProjectFileDeleteObject {

        private String entityName;

        private Long entityId;

        private Long attachedFileId;
    }
}
