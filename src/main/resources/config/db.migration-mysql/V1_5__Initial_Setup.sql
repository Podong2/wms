CREATE TABLE owl_attached_file (
    id                   bigint,
	name                 varchar(1000) NOT NULL,
	content              LONGBLOB,
	content_type         varchar(50) NULL,
	size                 bigint NULL,
	created_by           varchar(50)  NOT NULL ,
	created_date         timestamp  NULL ,
	last_modified_by     varchar(50)  NULL ,
	last_modified_date   timestamp  NULL
)
ENGINE=InnoDB DEFAULT CHARSET=utf8;
