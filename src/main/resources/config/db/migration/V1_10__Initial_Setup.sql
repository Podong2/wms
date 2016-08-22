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
    created_by              varchar(50)  NOT NULL,
    created_date            timestamp  NULL,
    last_modified_by        varchar(50)  NULL,
    last_modified_date      timestamp  NULL
);
