INSERT INTO owl_sequence (seq_id, seq_value)
VALUES
    ('owl_menu_id',10000),
    ('owl_menu_permission_id',10000),
    ('owl_permission_id',10000),
    ('owl_permission_category_id',10000),
    ('owl_system_role_id',10000),
    ('owl_system_role_permission_id',10000),
    ('owl_system_role_user_id',10000)
;

CREATE TABLE owl_menu
(
    id                   bigint,
    parent_id            bigint  NULL ,
    name                 varchar(1000)  NULL ,
    description          text  NULL ,
    area                 varchar(50)  NULL ,
    position             integer  NULL ,
    status               varchar(50)  NULL ,
    project_yn           char(1)  NULL ,
    system_yn            char(1)  NULL ,
    mobile_yn            char(1)  NULL
        DEFAULT  'Y',
    hr_include_yn        char(1)  NULL
        DEFAULT  'N',
    url_path             varchar(255)  NULL ,
    created_by           varchar(50)  NOT NULL,
    created_date         timestamp  NULL,
    last_modified_by     varchar(50)  NULL,
    last_modified_date   timestamp  NULL
)
ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE owl_menu_permission
(
    id                   bigint,
    menu_id              bigint  NULL ,
    permission_id        bigint  NULL ,
    default_yn           char(1)  NULL ,
    created_by           varchar(50)  NOT NULL,
    created_date         timestamp  NULL,
    last_modified_by     varchar(50)  NULL,
    last_modified_date   timestamp  NULL
)
ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE owl_permission
(
    id                   bigint,
    parent_id            bigint  NULL ,
    permission_category_id bigint  NULL ,
    name                 varchar(1000)  NULL ,
    description          text  NULL ,
    status               varchar(50)  NULL ,
    action               varchar(255)  NULL ,
    role_gubun           varchar(50)  NULL ,
    role_permission_yn   char(1)  NULL ,
    created_by           varchar(50)  NOT NULL,
    created_date         timestamp  NULL,
    last_modified_by     varchar(50)  NULL,
    last_modified_date   timestamp  NULL
)
ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE owl_permission_category
(
    id                   bigint,
    name                 varchar(1000)  NULL ,
    description          text  NULL ,
    created_by           varchar(50)  NOT NULL,
    created_date         timestamp  NULL,
    last_modified_by     varchar(50)  NULL,
    last_modified_date   timestamp  NULL
)
ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE owl_system_role
(
    id                   bigint,
    name                 varchar(1000)  NULL ,
    description          text  NULL ,
    role_gubun           varchar(50)  NULL ,
    created_by           varchar(50)  NOT NULL,
    created_date         timestamp  NULL,
    last_modified_by     varchar(50)  NULL,
    last_modified_date   timestamp  NULL
)
ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE owl_system_role_permission
(
    id                   bigint,
    system_role_id       bigint  NULL ,
    permission_id        bigint  NULL ,
    created_by           varchar(50)  NOT NULL,
    created_date         timestamp  NULL,
    last_modified_by     varchar(50)  NULL,
    last_modified_date   timestamp  NULL
)
ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE owl_system_role_user
(
    id                   bigint,
    system_role_id       bigint  NULL ,
    user_id              bigint  NULL ,
    created_by           varchar(50)  NOT NULL,
    created_date         timestamp  NULL,
    last_modified_by     varchar(50)  NULL,
    last_modified_date   timestamp  NULL
)
ENGINE=InnoDB DEFAULT CHARSET=utf8;
