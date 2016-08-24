package kr.wisestone.wms.service;

import kr.wisestone.wms.domain.AttachedFile;
import kr.wisestone.wms.repository.AttachedFileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.io.IOException;

@Service
public class AttachedFileService {

    private final Logger log = LoggerFactory.getLogger(AttachedFileService.class);

    @Inject
    private AttachedFileRepository attachedFileRepository;

    @Transactional
    public AttachedFile saveFile(MultipartFile multipartFile) {

        AttachedFile attachedFile = new AttachedFile();
        attachedFile.setName(multipartFile.getOriginalFilename());
        attachedFile.setContentType(multipartFile.getContentType());
        attachedFile.setSize(multipartFile.getSize());
        try {
            attachedFile.setContent(multipartFile.getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        }

        return attachedFileRepository.save(attachedFile);
    }

    @Transactional
    public AttachedFile copyFile(AttachedFile targetAttachedFile) {

        AttachedFile attachedFile = new AttachedFile();
        attachedFile.setName(targetAttachedFile.getName());
        attachedFile.setContentType(targetAttachedFile.getContentType());
        attachedFile.setSize(targetAttachedFile.getSize());
        attachedFile.setContent(targetAttachedFile.getContent());

        return attachedFileRepository.save(attachedFile);
    }

    @Transactional
    public void removeFile(Long id) {
        attachedFileRepository.findOneById(id).ifPresent(af -> {
            attachedFileRepository.delete(af);
            log.debug("Deleted AttachedFile: {}", af.getName());
        });
    }
}
