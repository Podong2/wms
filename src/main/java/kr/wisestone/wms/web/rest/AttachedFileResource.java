package kr.wisestone.wms.web.rest;

import com.codahale.metrics.annotation.Timed;
import kr.wisestone.wms.common.constant.Constants;
import kr.wisestone.wms.domain.AttachedFile;
import kr.wisestone.wms.repository.AttachedFileRepository;
import kr.wisestone.wms.service.AttachedFileService;
import kr.wisestone.wms.web.rest.util.HeaderUtil;
import kr.wisestone.wms.web.view.AttachedFileDownloadView;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import javax.inject.Inject;
import java.net.URISyntaxException;
import java.util.List;

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

    @Inject
    private AttachedFileDownloadView attachedFileDownloadView;

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
     * @return ModelAndView - AttachedFileDownloadView
     */
    @RequestMapping(value = "/attachedFile/{id:.+}", method = RequestMethod.GET)
    @Timed
    @Transactional(readOnly = true)
    public ModelAndView downloadFile(@PathVariable Long id, Model model) {
        log.debug("REST request to delete AttachedFile : {}", id);
        AttachedFile attachedFile = attachedFileRepository.findOne(id);

        model.addAttribute(Constants.FILE_DOWNLOAD_TARGET, attachedFile);
        model.addAttribute(Constants.FILE_DOWNLOAD_CONTENT, attachedFile.getContent());

        return new ModelAndView(attachedFileDownloadView);
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
