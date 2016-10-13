package kr.wisestone.wms.web.rest.form;

import java.util.ArrayList;
import java.util.List;

public class ProjectFileDeleteForm {

    public List<ProjectFileDeleteObject> projectFileDeleteTargets = new ArrayList<>();

    public ProjectFileDeleteForm() {
    }

    public ProjectFileDeleteForm(List<ProjectFileDeleteObject> projectFileDeleteTargets) {
        this.projectFileDeleteTargets = projectFileDeleteTargets;
    }

    public List<ProjectFileDeleteObject> getProjectFileDeleteTargets() {
        return projectFileDeleteTargets;
    }

    public void setProjectFileDeleteTargets(List<ProjectFileDeleteObject> projectFileDeleteTargets) {
        this.projectFileDeleteTargets = projectFileDeleteTargets;
    }

    public static class ProjectFileDeleteObject {

        private String entityName;

        private Long entityId;

        private Long attachedFileId;

        public ProjectFileDeleteObject() {
        }

        public ProjectFileDeleteObject(String entityName, Long entityId, Long attachedFileId) {
            this.entityName = entityName;
            this.entityId = entityId;
            this.attachedFileId = attachedFileId;
        }

        public String getEntityName() {
            return entityName;
        }

        public void setEntityName(String entityName) {
            this.entityName = entityName;
        }

        public Long getEntityId() {
            return entityId;
        }

        public void setEntityId(Long entityId) {
            this.entityId = entityId;
        }

        public Long getAttachedFileId() {
            return attachedFileId;
        }

        public void setAttachedFileId(Long attachedFileId) {
            this.attachedFileId = attachedFileId;
        }
    }
}
