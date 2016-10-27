package kr.wisestone.wms.repository.dao;

import kr.wisestone.wms.web.rest.dto.*;
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

    public List<ProjectHistoryListDTO> getProjectHistoryLists(Map<String, Object> condition) {
        return sqlSession.selectList("kr.wisestone.wms.domain.Project.getProjectHistoryLists", condition);
    }

    public List<ProjectHistoryListDTO> getProjectFileHistoryList(Map<String, Object> condition) {
        return sqlSession.selectList("kr.wisestone.wms.domain.Project.getProjectFileHistoryList", condition);
    }

    public List<ProjectDTO> getProjectByName(Map<String, Object> condition) {
        return sqlSession.selectList("kr.wisestone.wms.domain.Project.getProjects", condition);
    }

    public Map<String, Object> getProjectProgressCounts(Map<String, Object> condition) {

        return sqlSession.selectOne("kr.wisestone.wms.domain.Project.getProjectProgressCounts", condition);
    }

    public ProjectDTO getProject(Long id) {
        return sqlSession.selectOne("kr.wisestone.wms.domain.Project.getProject", id);
    }
}
