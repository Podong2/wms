package kr.wisestone.wms.web.rest.conversion;

import kr.wisestone.wms.common.util.ConvertUtil;
import kr.wisestone.wms.web.rest.dto.TaskRepeatScheduleDTO;

import java.beans.PropertyEditorSupport;

public class TaskRepeatScheduleDTOPropertyEditor extends PropertyEditorSupport {

    @Override
    public String getAsText() {
        return String.valueOf(ConvertUtil.convertObjectToJson(this.getValue()));
    }

    @Override
    public void setAsText(String text) throws IllegalArgumentException {
        this.setValue(ConvertUtil.convertJsonToObject(text, TaskRepeatScheduleDTO.class));
    }

    @Override
    public void setValue(Object value) {
        super.setValue(value);
    }

    @Override
    public Object getValue() {
        return super.getValue();
    }
}
