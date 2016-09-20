CREATE TABLE owl_sequence
(
  seq_id varchar(255),
  seq_value bigint
);



CREATE TABLE owl_user
(
	id                   bigint,
	login                varchar(100) NOT NULL,
	password_hash        varchar(60) NOT NULL,
	name                 varchar(100) NULL,
	email                varchar(100) NULL,
	company_id           bigint,
	department_id        bigint,
	profile_image_id     bigint,
	status               varchar(50),
	fail_count           integer,
	activated            char(1) NOT NULL,
	lang_key             varchar(5) NOT NULL,
	activation_key       varchar(20) NULL,
	reset_key            varchar(20) NULL,
	reset_date           timestamp NULL,
	phone                varchar(50) null,
	created_by           varchar(50)  NOT NULL ,
	created_date         timestamp  NULL ,
	last_modified_by     varchar(50)  NULL ,
	last_modified_date   timestamp  NULL
);


CREATE INDEX idx_owl_user_login ON owl_user (login);

CREATE INDEX idx_owl_user_email ON owl_user (email);

CREATE TABLE owl_authority
(
	name                varchar(50) NOT NULL
);


CREATE TABLE owl_user_authority
(
	user_id             bigint NOT NULL,
	authority_name      varchar(50) NOT NULL
);


CREATE TABLE owl_persistent_token
(
    series             varchar(255) NOT NULL,
    user_id            bigint NOT NULL,
    token_value        varchar(255) NOT NULL,
    token_date         date,
    ip_address         varchar(39),
    user_agent         varchar(255)
);


CREATE TABLE owl_persistent_audit_event
(
    event_id           bigint NOT NULL,
    principal          varchar(255) NOT NULL,
    event_date         timestamp,
    event_type         varchar(255)
);


CREATE TABLE owl_persistent_audit_evt_data
(
    event_id           bigint NOT NULL,
    name               varchar(255) NOT NULL,
    value              varchar(255)
);


CREATE TABLE owl_social_user_connection
(
    id                 bigint NOT NULL,
    user_id            bigint NOT NULL,
    provider_id        varchar(255) NOT NULL,
    provider_user_id   varchar(255) NOT NULL,
    rank               bigint NOT NULL,
    display_name       varchar(255),
    profile_url        varchar(255),
    image_url          varchar(255),
    access_token       varchar(255) NOT NULL,
    secret             varchar(255),
    refresh_token      varchar(255),
    expire_time        bigint
);

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
);


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
);

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
    mobile_yn            char(1)  NULL DEFAULT  'Y',
    hr_include_yn        char(1)  NULL DEFAULT  'N',
    url_path             varchar(255)  NULL ,
    permission_url       varchar(100),
    display_yn           char(1) NULL DEFAULT 'Y',
    created_by           varchar(50)  NOT NULL,
    created_date         timestamp  NULL,
    last_modified_by     varchar(50)  NULL,
    last_modified_date   timestamp  NULL
);


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
);


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
);


CREATE TABLE owl_permission_category
(
    id                   bigint,
    name                 varchar(1000)  NULL ,
    description          text  NULL ,
    created_by           varchar(50)  NOT NULL,
    created_date         timestamp  NULL,
    last_modified_by     varchar(50)  NULL,
    last_modified_date   timestamp  NULL
);


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
);


CREATE TABLE owl_system_role_permission
(
    id                   bigint,
    system_role_id       bigint  NULL ,
    permission_id        bigint  NULL ,
    created_by           varchar(50)  NOT NULL,
    created_date         timestamp  NULL,
    last_modified_by     varchar(50)  NULL,
    last_modified_date   timestamp  NULL
);


CREATE TABLE owl_system_role_user
(
    id                   bigint,
    system_role_id       bigint  NULL ,
    user_id              bigint  NULL ,
    created_by           varchar(50)  NOT NULL,
    created_date         timestamp  NULL,
    last_modified_by     varchar(50)  NULL,
    last_modified_date   timestamp  NULL
);

CREATE TABLE owl_attached_file (
    id                   bigint,
	name                 varchar(1000) NOT NULL,
	content              bytea,
	content_type         varchar(255) NULL,
	size                 bigint NULL,
	created_by           varchar(50)  NOT NULL ,
	created_date         timestamp  NULL ,
	last_modified_by     varchar(50)  NULL ,
	last_modified_date   timestamp  NULL
);

CREATE TABLE owl_trace_log (
    id                   bigint,
	entity_id            bigint NULL,
	entity_name          varchar(255) NULL,
	entity_field         varchar(255) NULL,
	persist_type         varchar(255) NULL,
	reply_yn             char(1) NULL,
	old_value            text NULL,
	new_value            text NULL,
	etc_value            varchar(1000) NULL,
	attached_file_id     bigint NULL,
	task_id              bigint NULL,
	project_id           bigint NULL,
	created_by           varchar(50)  NULL ,
	created_date         timestamp  NULL ,
	last_modified_by     varchar(50)  NULL ,
	last_modified_date   timestamp  NULL
);


CREATE TABLE owl_trace_log_attached_file
(
    id                   bigint,
    trace_log_id         bigint  NULL ,
    attached_file_id     bigint  NULL ,
    created_by           varchar(50)  NOT NULL,
    created_date         timestamp  NULL,
    last_modified_by     varchar(50)  NULL,
    last_modified_date   timestamp  NULL
);

CREATE TABLE owl_task
(
    id                   bigint,
    name                 varchar(1000) NOT NULL ,
    contents             text NULL,
    status_id            bigint NULL,
    parent_id            bigint NULL,
    start_date           varchar(20) NULL,
    end_date             varchar(20) NULL,
    important_yn         char(1) NULL,
    template_yn          char(1) NULL,
    private_yn           char(1) NULL,
    created_by           varchar(50) NOT NULL,
    created_date         timestamp NULL,
    last_modified_by     varchar(50) NULL,
    last_modified_date   timestamp NULL
);

CREATE TABLE owl_related_task
(
    id                   bigint,
    task_id              bigint  NULL ,
    related_task_id      bigint  NULL ,
    created_by           varchar(50)  NOT NULL,
    created_date         timestamp  NULL,
    last_modified_by     varchar(50)  NULL,
    last_modified_date   timestamp  NULL
);

CREATE TABLE owl_task_user
(
    id                   bigint,
    task_id              bigint  NULL ,
    user_id              bigint  NULL ,
    user_type            varchar(50),
    created_by           varchar(50)  NOT NULL,
    created_date         timestamp  NULL,
    last_modified_by     varchar(50)  NULL,
    last_modified_date   timestamp  NULL
);

CREATE TABLE owl_task_trace_log
(
    id                   bigint,
    task_id              bigint NULL ,
    trace_log_id         bigint NULL ,
    created_by           varchar(50)  NOT NULL,
    created_date         timestamp  NULL,
    last_modified_by     varchar(50)  NULL,
    last_modified_date   timestamp  NULL
);

CREATE TABLE owl_task_approval
(
    id                   bigint,
    task_id              bigint NULL ,
    requestor_id         bigint NULL ,
    approval_status      varchar(100),
    created_by           varchar(50)  NOT NULL,
    created_date         timestamp  NULL,
    last_modified_by     varchar(50)  NULL,
    last_modified_date   timestamp  NULL
);

CREATE TABLE owl_task_approver
(
    id                   bigint,
    task_approval_id     bigint NULL ,
    approver_id          bigint NULL ,
    approval_status      varchar(100),
    created_by           varchar(50)  NOT NULL,
    created_date         timestamp  NULL,
    last_modified_by     varchar(50)  NULL,
    last_modified_date   timestamp  NULL
);

CREATE TABLE owl_task_attached_file
(
    id                   bigint,
    task_id              bigint  NULL ,
    attached_file_id     bigint  NULL ,
    created_by           varchar(50)  NOT NULL,
    created_date         timestamp  NULL,
    last_modified_by     varchar(50)  NULL,
    last_modified_date   timestamp  NULL
);

CREATE TABLE owl_task_repeat_schedule
(
    id                      bigint,
    task_id                 bigint  NULL ,
    repeat_yn               char(1),
    repeat_type             varchar(50),
    weekdays                varchar(100),
    advent_date_start_time  varchar(10),
    start_date              varchar(20),
    end_date                varchar(20),
    permanent_yn            char(1),
    monthly_criteria        varchar(255) null,
    execute_date            varchar(255) null,
    created_by              varchar(50)  NOT NULL,
    created_date            timestamp  NULL,
    last_modified_by        varchar(50)  NULL,
    last_modified_date      timestamp  NULL
);


CREATE TABLE owl_project
(
    id                   bigint,
    name                 varchar(1000)  NULL ,
    contents             text NULL ,
    folder_yn            char(1) NULL,
    start_date           varchar(20) NULL,
    end_date             varchar(20) NULL,
    parent_id            bigint NULL,
    status_id            bigint NULL,
    color                varchar(50) null,
    created_by           varchar(50) NOT NULL,
    created_date         timestamp NULL,
    last_modified_by     varchar(50) NULL,
    last_modified_date   timestamp NULL
);

CREATE TABLE owl_task_project
(
    id                   bigint,
    task_id              bigint  NULL ,
    project_id           bigint  NULL ,
    created_by           varchar(50)  NOT NULL,
    created_date         timestamp  NULL,
    last_modified_by     varchar(50)  NULL,
    last_modified_date   timestamp  NULL
);


CREATE TABLE owl_project_trace_log
(
    id                   bigint,
    project_id           bigint NULL ,
    trace_log_id         bigint NULL ,
    created_by           varchar(50)  NOT NULL,
    created_date         timestamp  NULL,
    last_modified_by     varchar(50)  NULL,
    last_modified_date   timestamp  NULL
);

CREATE TABLE owl_project_attached_file
(
    id                   bigint,
    project_id           bigint  NULL ,
    attached_file_id     bigint  NULL ,
    created_by           varchar(50)  NOT NULL,
    created_date         timestamp  NULL,
    last_modified_by     varchar(50)  NULL,
    last_modified_date   timestamp  NULL
);

CREATE TABLE owl_project_user
(
    id                   bigint,
    project_id           bigint  NULL ,
    user_id              bigint  NULL ,
    user_type            varchar(255) null,
    created_by           varchar(50)  NOT NULL,
    created_date         timestamp  NULL,
    last_modified_by     varchar(50)  NULL,
    last_modified_date   timestamp  NULL
);

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


CREATE TABLE owl_code
(
    id                   bigint,
    name                 varchar(1000)  NULL ,
    default_yn           char(1)  NULL ,
    position             integer NULL,
    color                varchar(255)  NULL ,
    code_type            varchar(50)  NULL ,
    created_by           varchar(50)  NOT NULL,
    created_date         timestamp  NULL,
    last_modified_by     varchar(50)  NULL,
    last_modified_date   timestamp  NULL
);

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
    notification_level_display_time integer NULL,
    notification_level_color        varchar(255) NULL,
    entity_id                       bigint null,
    entity_name                     varchar(255) null,
    entity_field                    varchar(255) null,
    entity_value                    varchar(4000) null,
    etc_value                       varchar(4000) null,
    attached_file_id                bigint null,
    persist_type                    varchar(50) null,
    created_by                      varchar(50)  NOT NULL,
    created_date                    timestamp  NULL,
    last_modified_by                varchar(50)  NULL,
    last_modified_date              timestamp  NULL
);


CREATE TABLE owl_notification_recipient
(
    id                   bigint,
    notification_id      bigint  NULL ,
    recipient_id         bigint  NULL ,
    read_yn              char(1) NULL ,
    confirm_yn           char(1) null,
    created_by           varchar(50)  NOT NULL,
    created_date         timestamp  NULL,
    last_modified_by     varchar(50)  NULL,
    last_modified_date   timestamp  NULL
);

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


INSERT INTO owl_sequence (seq_id, seq_value)
VALUES
    ('owl_user_id',10000),
    ('owl_social_user_connection_id',10000),
    ('owl_persistent_audit_event_id',10000),
    ('owl_company_id',10000),
    ('owl_department_id',10000),
    ('owl_menu_id',10000),
    ('owl_menu_permission_id',10000),
    ('owl_permission_id',10000),
    ('owl_permission_category_id',10000),
    ('owl_system_role_id',10000),
    ('owl_system_role_permission_id',10000),
    ('owl_system_role_user_id',10000),
    ('owl_task',10000),
    ('owl_code',10000),
    ('owl_task_attached_file',10000),
    ('owl_task_id',10000),
    ('owl_code_id',10000),
    ('owl_task_attached_file_id',10000),
    ('owl_notification_id',10000),
    ('owl_notification_recipient_id',10000),
    ('owl_project_relation_id',10000)
;

INSERT INTO owl_authority (name)
VALUES
    ('ROLE_ADMIN'),
    ('ROLE_USER')
;

INSERT INTO owl_user_authority (user_id, authority_name)
VALUES
    (1, 'ROLE_ADMIN'),
    (1, 'ROLE_USER'),
    (3, 'ROLE_ADMIN'),
    (3, 'ROLE_ADMIN'),
    (4, 'ROLE_USER')
;

INSERT INTO owl_user (id, login, password_hash, name, email, activated, lang_key, created_by)
VALUES
    (1,'system','$2a$10$mE.qmcV0mFU5NcKh73TZx.z4ueI/.bDWbj0T1BYyqP481kGGarKLG','System','system@localhost',B'1'::bit(1),'ko','system'),
    (2,'anonymoususer','$2a$10$j8S5d7Sr7.8VTOYNviDPOeWX8KcYILUVJBsYV83Y5NtECayypx9lO','Anonymous','anonymous@localhost',B'1'::bit(1),'ko','system'),
    (3,'admin','$2a$10$gSAhZrxMllrbgj/kkK9UceBPpChGWJA7SYIb1Mqo.n5aNLq1/oRrC','Administrator','admin@localhost',B'1'::bit(1),'ko','system'),
    (4,'user','$2a$10$VEjxo0jq2YG9Rbk2HmX9S.k1uZBGYUHdUcid3g/vfiEl7lwWgOH/K','User','user@localhost',B'1'::bit(1),'ko','system')
;

INSERT INTO owl_code (id, name, default_yn, position, color, code_type, created_by, created_date, last_modified_by, last_modified_date) VALUES
	(1, '활성', 'Y', 1, '#9b9b9b', 'TASK_STATUS', 'admin', '2016-08-01 00:00:00.000', NULL, '2016-08-01 00:00:00.000'),
	(2, '완료', 'N', 2, '#9b9b9b', 'TASK_STATUS', 'admin', '2016-08-01 00:00:00.000', NULL, '2016-08-01 00:00:00.000'),
	(3, '보류', 'N', 3, '#9b9b9b', 'TASK_STATUS', 'admin', '2016-08-01 00:00:00.000', NULL, '2016-08-01 00:00:00.000'),
	(4, '취소', 'N', 4, '#9b9b9b', 'TASK_STATUS', 'admin', '2016-08-01 00:00:00.000', NULL, '2016-08-01 00:00:00.000')
	;
