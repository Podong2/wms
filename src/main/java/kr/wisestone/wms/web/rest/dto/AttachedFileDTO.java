package kr.wisestone.wms.web.rest.dto;


import kr.wisestone.wms.domain.AttachedFile;

public class AttachedFileDTO {

    private Long id;

    private String name;

    private Long size;

    private String contentType;

    public AttachedFileDTO() {}

    public AttachedFileDTO(AttachedFile attachedFile) {

        this.setId(attachedFile.getId());
        this.setName(attachedFile.getName());
        this.setContentType(attachedFile.getContentType());
        this.setSize(attachedFile.getSize());

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }
}
