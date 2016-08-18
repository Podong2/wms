ALTER TABLE owl_notification ADD COLUMN entity_id bigint null;
ALTER TABLE owl_notification ADD COLUMN entity_name varchar(255) null;
ALTER TABLE owl_notification ADD COLUMN entity_field varchar(255) null;
ALTER TABLE owl_notification ADD COLUMN entity_value varchar(4000) null;
ALTER TABLE owl_notification ADD COLUMN etc_value varchar(4000) null;
ALTER TABLE owl_notification ADD COLUMN attached_file_id bigint null;
