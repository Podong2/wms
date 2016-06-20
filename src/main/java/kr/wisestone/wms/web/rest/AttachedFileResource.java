package kr.wisestone.wms.web.rest;

import com.codahale.metrics.annotation.Timed;
import kr.wisestone.wms.domain.AttachedFile;
import kr.wisestone.wms.domain.Menu;
import kr.wisestone.wms.repository.AttachedFileRepository;
import kr.wisestone.wms.service.AttachedFileService;
import kr.wisestone.wms.web.rest.dto.MenuDTO;
import kr.wisestone.wms.web.rest.util.HeaderUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.inject.Inject;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * 특정도메인과 연계되어 처리되므로 컨트롤러가 필요없으나 현재 단계에서 첨부파일 테스트를 위해 등록함, 추후 삭제 예정
 *
 * REST controller for testing AttachedFile.
 */
@RestController
@RequestMapping("/api")
public class AttachedFileResource {

    private final Logger log = LoggerFactory.getLogger(AttachedFileResource.class);

    @Inject
    private AttachedFileRepository attachedFileRepository;

    @Inject
    private AttachedFileService attachedFileService;

    /**
     * POST  /attachedFile : Create a new attachedFile.
     *
     * @param request the multipartFile to create
     * @return the ResponseEntity with status 201 (Created) and with body the new attachedFile, or with status 400 (Bad Request) if the attachedFile has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/attachedFile",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<AttachedFile> createAttachedFile(MultipartHttpServletRequest request) throws URISyntaxException {
        log.debug("REST request to save");

        List<MultipartFile> multipartFiles = request.getFiles("files");

        for(MultipartFile multipartFile : multipartFiles) {
            this.attachedFileService.saveFile(multipartFile);
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * GET  /attachedFile/:id : get the "id" attachedFIle.
     *
     * @param id the id of the attachedFile to get
     * @return the ResponseEntity with status 200 (OK) or 404(Not Found)
     */
    @RequestMapping(value = "/attachedFile/{id:.+}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<AttachedFile> getAttachedFile(@PathVariable Long id) {
        log.debug("REST request to delete AttachedFile : {}", id);
        AttachedFile attachedFile = attachedFileRepository.findOne(id);
        return Optional.ofNullable(attachedFile)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /attachedFile/:id : delete the "id" attachedFIle.
     *
     * @param id the id of the attachedFile to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/attachedFile/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteAttachedFile(@PathVariable Long id) {
        log.debug("REST request to delete AttachedFile : {}", id);
        attachedFileService.removeFile(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("attachedFile", id.toString())).build();
    }

}
