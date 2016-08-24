CREATE TABLE owl_dashboard
(
    id                   bigint,
    name                 varchar(255) NULL,
    description          varchar(4000) NULL,
    dashboard_model      text NULL,
    use_yn               char(1),
    system_yn            char(1),
    created_by           varchar(50) NOT NULL,
    created_date         timestamp NULL,
    last_modified_by     varchar(50) NULL,
    last_modified_date   timestamp NULL
);

CREATE TABLE owl_user_dashboard
(
    id                   bigint,
    user_id              bigint NULL,
    dashboard_id         bigint NULL,
    default_yn           char(1),
    created_by           varchar(50) NOT NULL,
    created_date         timestamp NULL,
    last_modified_by     varchar(50) NULL,
    last_modified_date   timestamp NULL
);
