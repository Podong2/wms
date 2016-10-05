package kr.wisestone.wms.repository.dao;

import kr.wisestone.wms.web.rest.dto.ProjectDTO;
import kr.wisestone.wms.web.rest.dto.ProjectManagedAttachedFileDTO;
import kr.wisestone.wms.web.rest.dto.TaskDTO;
import kr.wisestone.wms.web.rest.dto.TaskStatisticsDTO;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class ProjectDAO {

    @Autowired
    private SqlSession sqlSession;

    public List<ProjectManagedAttachedFileDTO> getProjectManagedAttachedFile(Map<String, Object> condition) {
        return sqlSession.selectList("kr.wisestone.wms.domain.Project.getProjectManagedAttachedFile", condition);
    }

    public ProjectDTO getProject(Map<String, Object> condition) {
        return sqlSession.selectOne("kr.wisestone.wms.domain.Project.getProject", condition);
    }
}
