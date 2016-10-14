package kr.wisestone.wms.service;

import kr.wisestone.wms.repository.dao.AttachedFileDAO;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;

@Service
public class TaskAttachedFileScheduleService {

    @Inject
    private AttachedFileDAO attachedFileDAO;

//    @Scheduled(fixedRate = 60000)
    @Scheduled(cron = "0 1 1 * * ?") // run daily 1:01 am
    @Transactional
    public void purgeOrphanAttachedFile() {
        attachedFileDAO.purgeOrphanAttachedFile();
    }
}
