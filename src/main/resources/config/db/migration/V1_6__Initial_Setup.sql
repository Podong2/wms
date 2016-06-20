CREATE TABLE owl_trace_log (
    id                   bigint,
	entity_id            bigint NULL,
	entity_name          varchar(255) NULL,
	entity_field         varchar(255) NULL,
	persist_type         varchar(255) NULL,
	old_value            varchar(1000) NULL,
	new_value            varchar(1000) NULL,
	created_by           varchar(50)  NULL ,
	created_date         timestamp  NULL ,
	last_modified_by     varchar(50)  NULL ,
	last_modified_date   timestamp  NULL
)
ENGINE=InnoDB DEFAULT CHARSET=utf8;
