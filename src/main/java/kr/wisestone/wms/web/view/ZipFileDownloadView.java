package kr.wisestone.wms.web.view;

import com.google.common.collect.Maps;
import kr.wisestone.wms.common.constant.Constants;
import kr.wisestone.wms.domain.AttachedFile;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.servlet.view.AbstractView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Component
public class ZipFileDownloadView extends AbstractView {

    private final Logger log = LoggerFactory.getLogger(ZipFileDownloadView.class);

    public ZipFileDownloadView() {
        super.setContentType("application/zip");
    }

    @Override
    protected void renderMergedOutputModel(Map<String, Object> model, HttpServletRequest request
                                        , HttpServletResponse response) throws Exception {

        List<AttachedFile> attachedFiles = (List<AttachedFile>) model.get(Constants.FILE_DOWNLOAD_TARGET);
        String name = (String) model.get(Constants.FILE_DOWNLOAD_NAME);

        response.setContentType("application/zip");
        response.setHeader("Content-Transfer-Encoding", "binary");

        String userAgent = request.getHeader("User-Agent");

        // attachment; 가 붙으면 IE의 경우 무조건 다운로드창이 뜬다. 상황에 따라 써야한다.
        if (userAgent != null && userAgent.indexOf("MSIE 5.5") > -1) {
            // MS IE 5.5 이하
            response.setHeader("Content-Disposition", String.format("filename=%s;", URLEncoder.encode(name+".zip", "UTF-8")));
        } else if ((userAgent != null && userAgent.indexOf("MSIE") > -1)||userAgent.indexOf("Trident") > -1) {
            // MS IE (보통은 6.x 이상 가정)
            response.setHeader("Content-Disposition", String.format("attachment; filename=%s;", URLEncoder.encode(name+".zip", "UTF-8")));
        } else {
            // 모질라, 오페라, 크롬 등
            response.setHeader("Content-Disposition", String.format("attachment; filename=\"%s\";", new String((name+".zip").getBytes("UTF-8"), "latin1")));
        }

        ByteArrayOutputStream byteArrayOutputStream = this.makeZipByteArrayOutputStream(attachedFiles);

        try {
            response.getOutputStream().write(byteArrayOutputStream.toByteArray());
            response.flushBuffer();

        } catch(IOException ioe) {
            log.error("다운로드 파일 제어 중 오류가 발생했습니다.", ioe);

            throw ioe;
        } finally {
            if(byteArrayOutputStream != null) {
                try {byteArrayOutputStream.flush();} catch(IOException ioe) {ioe.printStackTrace();}
                try {byteArrayOutputStream.close();} catch(IOException ioe) {ioe.printStackTrace();}
            }
        }
    }

    private ByteArrayOutputStream makeZipByteArrayOutputStream(List<AttachedFile> attachedFiles) throws IOException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        Map<String, Integer> duplicateCountMap = Maps.newHashMap();

        try {

            ZipOutputStream zipOutputStream = new ZipOutputStream(byteArrayOutputStream);
            byte[] buffer = new byte[128];
            for (AttachedFile attachedFile : attachedFiles) {

                String fileName = FilenameUtils.removeExtension(attachedFile.getName());
                String extension = FilenameUtils.getExtension(attachedFile.getName());

                if(!duplicateCountMap.containsKey(attachedFile.getName())) {
                    duplicateCountMap.put(attachedFile.getName(), 0);
                } else {
                    Integer count = duplicateCountMap.get(attachedFile.getName()) + 1;
                    duplicateCountMap.put(attachedFile.getName(), count);

                    fileName = fileName + " (" + count + ")";
                }

                ZipEntry entry = new ZipEntry(fileName + "." + extension);
                ByteArrayInputStream inputStream = new ByteArrayInputStream(attachedFile.getContent());
                zipOutputStream.putNextEntry(entry);
                int read = 0;
                while ((read = inputStream.read(buffer)) != -1) {
                    zipOutputStream.write(buffer, 0, read);
                }
                zipOutputStream.closeEntry();
                inputStream.close();
            }
            zipOutputStream.close();
        } catch (FileNotFoundException e) {
            System.out.println("File not found : " + e);
        }
        return byteArrayOutputStream;
    }
}
