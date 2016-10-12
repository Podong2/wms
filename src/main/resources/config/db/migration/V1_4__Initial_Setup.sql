UPDATE owl_task_user SET user_type = 'SHARER' WHERE user_type = 'WATCHER';

UPDATE owl_trace_log SET etc_value = 'sharer' WHERE etc_value = 'watcher';
