DROP TABLE owl_project_parent;

CREATE TABLE owl_project_relation
(
    id                   bigint,
    child_id             bigint  NULL ,
    parent_id            bigint  NULL ,
    created_by           varchar(50)  NOT NULL,
    created_date         timestamp  NULL,
    last_modified_by     varchar(50)  NULL,
    last_modified_date   timestamp  NULL
);


INSERT INTO owl_sequence (seq_id, seq_value)
VALUES
    ('owl_project_relation_id',10000);
