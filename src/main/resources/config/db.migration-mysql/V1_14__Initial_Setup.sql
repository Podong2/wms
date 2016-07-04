INSERT INTO owl_sequence (seq_id, seq_value)
VALUES
    ('owl_notification_id',10000),
    ('owl_notification_recipient_id',10000)
;

CREATE TABLE owl_notification
(
    id                              bigint,
    title                           varchar(255) NOT NULL,
    contents                        text  NULL ,
    sender_id                       bigint null,
    notification_method             varchar(255) NULL,
    notification_config             varchar(255) NULL,
    notification_type               varchar(255) NULL,
    notification_level_name         varchar(255) NULL,
    notification_level_display_time int(3) NULL,
    notification_level_color        varchar(255) NULL,
    created_by                      varchar(50)  NOT NULL,
    created_date                    timestamp  NULL,
    last_modified_by                varchar(50)  NULL,
    last_modified_date              timestamp  NULL
)
ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE owl_notification_recipient
(
    id                   bigint,
    notification_id      bigint  NULL ,
    recipient_id         bigint  NULL ,
    read_yn              char(1) NULL ,
    created_by           varchar(50)  NOT NULL,
    created_date         timestamp  NULL,
    last_modified_by     varchar(50)  NULL,
    last_modified_date   timestamp  NULL
)
ENGINE=InnoDB DEFAULT CHARSET=utf8;

