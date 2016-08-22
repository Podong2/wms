ALTER TABLE owl_project DROP COLUMN admin_id;

ALTER TABLE owl_project_user ADD COLUMN user_type varchar(255) null;
