package kr.wisestone.wms.domain;

import org.flywaydb.core.internal.util.StringUtils;

import javax.persistence.Embeddable;

@Embeddable
public class Period {

    private String startDate;

    private String endDate;

    public Period() {}

    public Period(String startDate, String endDate) {
        this.setStartDate(startDate);
        this.setEndDate(endDate);
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    @Override
    public String toString() {

        StringBuilder period = new StringBuilder();

        if(StringUtils.hasText(startDate) && StringUtils.hasText(endDate)) {
            period.append(startDate)
                .append(" ~ ")
                .append(endDate);
        } else if(StringUtils.hasText(startDate) && !StringUtils.hasText(endDate)) {
            period.append(startDate)
                .append(" ~ ");
        } else if(!StringUtils.hasText(startDate) && StringUtils.hasText(endDate)) {
            period.append(" ~ ")
                .append(endDate);
        }

        return period.toString();
    }
}
