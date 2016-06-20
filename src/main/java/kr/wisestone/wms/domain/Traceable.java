package kr.wisestone.wms.domain;

public interface Traceable {

    String PERSIST_TYPE_INSERT = "INSERT";
    String PERSIST_TYPE_UPDATE = "UPDATE";
    String PERSIST_TYPE_DELETE = "DELETE";

    Long getId();

    TraceLog getTraceLog(String persisType);
}
