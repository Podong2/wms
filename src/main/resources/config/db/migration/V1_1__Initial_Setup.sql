INSERT INTO owl_sequence (seq_id, seq_value)
VALUES
    ('owl_company_id',10000),
    ('owl_department_id',10000)
;

CREATE TABLE owl_company
(
	id                   bigint,
	name                 varchar(100) NOT NULL,
	description          text NULL,
	type                 varchar(50) NULL,
	created_by           varchar(50)  NOT NULL,
	created_date         timestamp  NULL,
	last_modified_by     varchar(50)  NULL,
	last_modified_date   timestamp  NULL
)
ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE owl_department
(
	id                   bigint,
	name                 varchar(100) NOT NULL,
	description          text NULL,
	status               varchar(100) NULL,
	parent_id            bigint NULL,
	company_id           bigint NOT NULL,
	created_by           varchar(50)  NOT NULL,
	created_date         timestamp  NULL,
	last_modified_by     varchar(50)  NULL,
	last_modified_date   timestamp  NULL
)
ENGINE=InnoDB DEFAULT CHARSET=utf8;
