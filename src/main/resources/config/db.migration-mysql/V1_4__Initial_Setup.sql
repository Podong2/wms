ALTER TABLE owl_user CHANGE first_name name VARCHAR(50) null;
ALTER TABLE owl_user DROP COLUMN last_name;
