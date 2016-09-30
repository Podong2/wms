package kr.wisestone.wms.web.rest.dto;


import kr.wisestone.wms.domain.AttachedFile;

import java.time.ZonedDateTime;

public class AttachedFileDTO {

    private Long id;

    private String name;

    private Long size;

    private String contentType;

    private String createdBy;

    private ZonedDateTime createdDate;

    private String lastModifiedBy;

    private ZonedDateTime lastModifiedDate;

    public AttachedFileDTO() {}

    public AttachedFileDTO(AttachedFile attachedFile) {

        this.setId(attachedFile.getId());
        this.setName(attachedFile.getName());
        this.setContentType(attachedFile.getContentType());
        this.setSize(attachedFile.getSize());
        this.setLastModifiedBy(attachedFile.getLastModifiedBy());
        this.setLastModifiedDate(attachedFile.getLastModifiedDate());
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

    public String getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public ZonedDateTime getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(ZonedDateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public ZonedDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(ZonedDateTime createdDate) {
        this.createdDate = createdDate;
    }
}
