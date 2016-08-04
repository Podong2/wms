ALTER TABLE owl_task_project DROP COLUMN project;
ALTER TABLE owl_task_project ADD COLUMN project_id bigint NULL;
