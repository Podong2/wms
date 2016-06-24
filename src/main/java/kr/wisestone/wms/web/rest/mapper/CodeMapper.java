package kr.wisestone.wms.web.rest.mapper;

import kr.wisestone.wms.domain.*;
import kr.wisestone.wms.web.rest.dto.CodeDTO;

import org.mapstruct.*;
import java.util.List;

/**
 * Mapper for the entity Code and its DTO CodeDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface CodeMapper {

    CodeDTO codeToCodeDTO(Code code);

    List<CodeDTO> codesToCodeDTOs(List<Code> codes);

    Code codeDTOToCode(CodeDTO codeDTO);

    List<Code> codeDTOsToCodes(List<CodeDTO> codeDTOs);
}
