
CREATE TABLE owl_project_shared_attached_file
(
    id                   bigint,
    project_id           bigint  NULL ,
    attached_file_id     bigint  NULL ,
    created_by           varchar(50)  NOT NULL,
    created_date         timestamp  NULL,
    last_modified_by     varchar(50)  NULL,
    last_modified_date   timestamp  NULL
);
