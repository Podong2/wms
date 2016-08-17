package kr.wisestone.wms.web.rest.mapper;

import kr.wisestone.wms.domain.AttachedFile;
import kr.wisestone.wms.web.rest.dto.AttachedFileDTO;
import org.mapstruct.Mapper;

import java.util.List;

/**
 * Mapper for the entity Code and its DTO CodeDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface AttachedFileMapper {

    AttachedFileDTO attachedFileToAttachedFileDTO(AttachedFile attachedFile);

    List<AttachedFileDTO> attachedFilesToAttachedFileDTOs(List<AttachedFile> attachedFiles);

    AttachedFile attachedFileDTOToAttachedFile(AttachedFileDTO attachedFileDTO);

    List<AttachedFile> attachedFileDTOsToAttachedFiles(List<AttachedFileDTO> attachedFileDTOs);
}
