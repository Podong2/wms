ALTER TABLE owl_task DROP COLUMN due_date;
ALTER TABLE owl_task ADD COLUMN due_date VARCHAR(50) null;
