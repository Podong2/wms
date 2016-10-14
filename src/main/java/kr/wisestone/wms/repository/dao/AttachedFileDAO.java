package kr.wisestone.wms.repository.dao;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class AttachedFileDAO {

    @Autowired
    private SqlSession sqlSession;

    public int purgeOrphanAttachedFile() {
        return sqlSession.delete("kr.wisestone.wms.domain.AttachedFile.purgeOrphanAttachedFile");
    }
}
