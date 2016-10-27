package kr.wisestone.wms.repository.dao;

import kr.wisestone.wms.web.rest.dto.TraceLogDTO;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class TraceLogDAO {

    @Autowired
    private SqlSession sqlSession;

    public List<TraceLogDTO> getTraceLogs(Map<String, Object> condition) {
        return sqlSession.selectList("kr.wisestone.wms.domain.TraceLog.getTraceLogs", condition);
    }

    public List<TraceLogDTO> getRecentTraceLogs(Map<String, Object> condition) {
        return sqlSession.selectList("kr.wisestone.wms.domain.TraceLog.getRecentTraceLogs", condition);
    }

    public Integer getTraceLogDateCount(Map<String, Object> condition) {

        return sqlSession.selectOne("kr.wisestone.wms.domain.TraceLog.getTraceLogDateCount", condition);
    }
}
