package kr.wisestone.wms.web.view;

import kr.wisestone.wms.common.constant.Constants;
import kr.wisestone.wms.domain.AttachedFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.servlet.view.AbstractView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.util.Map;

@Component
public class AttachedFileDownloadView extends AbstractView {

    private final Logger log = LoggerFactory.getLogger(AttachedFileDownloadView.class);

    public AttachedFileDownloadView() {
        super.setContentType("application/octet-stream");
    }

    @Override
    protected void renderMergedOutputModel(Map<String, Object> model, HttpServletRequest request
                                        , HttpServletResponse response) throws Exception {

        AttachedFile attachedFile = (AttachedFile) model.get(Constants.FILE_DOWNLOAD_TARGET);

        byte[] targetFile = attachedFile.getContent();

        response.setContentType(super.getContentType());
        response.setContentLength(attachedFile.getContent().length);
        response.setHeader("Content-Transfer-Encoding", "binary");

        String userAgent = request.getHeader("User-Agent");

        // attachment; 가 붙으면 IE의 경우 무조건 다운로드창이 뜬다. 상황에 따라 써야한다.
        if (userAgent != null && userAgent.indexOf("MSIE 5.5") > -1) {
            // MS IE 5.5 이하
            response.setHeader("Content-Disposition", String.format("filename=%s;", URLEncoder.encode(attachedFile.getName(), "UTF-8")));
        } else if ((userAgent != null && userAgent.indexOf("MSIE") > -1)||userAgent.indexOf("Trident") > -1) {
            // MS IE (보통은 6.x 이상 가정)
            response.setHeader("Content-Disposition", String.format("attachment; filename=%s;", URLEncoder.encode(attachedFile.getName(), "UTF-8")));
        } else {
            // 모질라, 오페라, 크롬 등
            response.setHeader("Content-Disposition", String.format("attachment; filename=\"%s\";", new String(attachedFile.getName().getBytes("UTF-8"), "latin1")));
        }

        OutputStream outputStream = null;
        InputStream inputStream = null;

        try {
            outputStream = response.getOutputStream();
            inputStream = new ByteArrayInputStream(targetFile);

            FileCopyUtils.copy(inputStream, outputStream);
        } catch(IOException ioe) {
            log.error("다운로드 파일 제어 중 오류가 발생했습니다.", ioe);

            throw ioe;
        } finally {
            if(inputStream != null)
                inputStream.close();

            if(outputStream != null) {
                outputStream.flush();
                outputStream.close();
            }
        }
    }
}
