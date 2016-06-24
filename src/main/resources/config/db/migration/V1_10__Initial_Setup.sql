INSERT INTO owl_sequence (seq_id, seq_value)
VALUES
    ('owl_task',10000),
    ('owl_code',10000),
    ('owl_task_attached_file',10000)
;

CREATE TABLE owl_task
(
    id                   bigint,
    name                 varchar(1000)  NULL ,
    contents             text  NULL ,
    assignee_id          bigint NULL,
    code_id              bigint NULL,
    due_date             timestamp NULL,
    created_by           varchar(50)  NOT NULL,
    created_date         timestamp  NULL,
    last_modified_by     varchar(50)  NULL,
    last_modified_date   timestamp  NULL
)
ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE owl_task_attached_file
(
    id                   bigint,
    task_id              bigint  NULL ,
    attached_file_id     bigint  NULL ,
    created_by           varchar(50)  NOT NULL,
    created_date         timestamp  NULL,
    last_modified_by     varchar(50)  NULL,
    last_modified_date   timestamp  NULL
)
ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE owl_code
(
    id                   bigint,
    name                 varchar(1000)  NULL ,
    default_yn           char(1)  NULL ,
    position             integer(10) NULL,
    color                varchar(255)  NULL ,
    code_type            varchar(50)  NULL ,
    created_by           varchar(50)  NOT NULL,
    created_date         timestamp  NULL,
    last_modified_by     varchar(50)  NULL,
    last_modified_date   timestamp  NULL
)
ENGINE=InnoDB DEFAULT CHARSET=utf8;
