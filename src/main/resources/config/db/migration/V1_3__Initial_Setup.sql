CREATE TABLE owl_task_project
(
    id                   bigint,
    task_id              bigint  NULL ,
    project              bigint  NULL ,
    created_by           varchar(50)  NOT NULL,
    created_date         timestamp  NULL,
    last_modified_by     varchar(50)  NULL,
    last_modified_date   timestamp  NULL
);
