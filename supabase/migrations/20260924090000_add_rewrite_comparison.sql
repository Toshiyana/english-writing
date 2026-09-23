alter table public.writing_attempts
  add column source_attempt_id uuid,
  add column assessment jsonb;

create index writing_attempts_source_attempt_idx
  on public.writing_attempts (user_id, source_attempt_id)
  where source_attempt_id is not null;

alter table public.writing_attempts
  add constraint writing_attempts_source_not_self
  check (source_attempt_id is null or source_attempt_id <> id);
