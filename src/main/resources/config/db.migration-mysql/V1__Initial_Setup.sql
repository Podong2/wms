CREATE TABLE owl_sequence
(
  seq_id varchar(255),
  seq_value bigint
)



CREATE TABLE owl_user
(
	id                   bigint,
	login                varchar(100) NOT NULL,
	password_hash        varchar(60) NOT NULL,
	first_name           varchar(50) NULL,
	last_name            varchar(50) NULL,
	email                varchar(100) NULL,
	activated            bit(1) NOT NULL,
	lang_key             varchar(5) NOT NULL,
	activation_key       varchar(20) NULL,
	reset_key            varchar(20) NULL,
	reset_date           timestamp NULL,
	created_by           varchar(50)  NOT NULL ,
	created_date         timestamp  NULL ,
	last_modified_by     varchar(50)  NULL ,
	last_modified_date   timestamp  NULL
)


CREATE INDEX idx_owl_user_login ON owl_user (login);

CREATE INDEX idx_owl_user_email ON owl_user (email);

CREATE TABLE owl_authority
(
	name                varchar(50) NOT NULL
)


CREATE TABLE owl_user_authority
(
	user_id             bigint NOT NULL,
	authority_name      varchar(50) NOT NULL
)


CREATE TABLE owl_persistent_token
(
    series             varchar(255) NOT NULL,
    user_id            bigint NOT NULL,
    token_value        varchar(255) NOT NULL,
    token_date         date,
    ip_address         varchar(39),
    user_agent         varchar(255)
)


CREATE TABLE owl_persistent_audit_event
(
    event_id           bigint NOT NULL,
    principal          varchar(255) NOT NULL,
    event_date         timestamp,
    event_type         varchar(255)
)


CREATE TABLE owl_persistent_audit_evt_data
(
    event_id           bigint NOT NULL,
    name               varchar(255) NOT NULL,
    value              varchar(255)
)


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
    referesh_token     varchar(255),
    expire_time        bigint
)


INSERT INTO owl_sequence (seq_id, seq_value)
VALUES
    ('owl_user_id',10000),
    ('owl_social_user_connection_id',10000),
    ('owl_persistent_audit_event_id',10000)
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

INSERT INTO owl_user (id, login, password_hash, first_name, last_name, email, activated, lang_key, created_by)
VALUES
    (1,'system','$2a$10$mE.qmcV0mFU5NcKh73TZx.z4ueI/.bDWbj0T1BYyqP481kGGarKLG','System','System','system@localhost',true,'ko','system'),
    (2,'anonymoususer','$2a$10$j8S5d7Sr7.8VTOYNviDPOeWX8KcYILUVJBsYV83Y5NtECayypx9lO','Anonymous','User','anonymous@localhost',true,'ko','system'),
    (3,'admin','$2a$10$gSAhZrxMllrbgj/kkK9UceBPpChGWJA7SYIb1Mqo.n5aNLq1/oRrC','Administrator','Administrator','admin@localhost',true,'ko','system'),
    (4,'user','$2a$10$VEjxo0jq2YG9Rbk2HmX9S.k1uZBGYUHdUcid3g/vfiEl7lwWgOH/K','User','User','user@localhost',true,'ko','system')

;
