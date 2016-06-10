package kr.wisestone.wms.config.metric;

import com.codahale.metrics.health.HealthCheck;

public class CustomHealthCheck extends HealthCheck{

    @Override
    protected Result check() throws Exception {
        return null;
    }
}
