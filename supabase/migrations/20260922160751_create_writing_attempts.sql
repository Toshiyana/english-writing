create table public.writing_attempts (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  task text not null check (task in ('task1', 'task2')),
  prompt_id text not null,
  prompt_title text not null,
  prompt_type text not null check (
    prompt_type in (
      'bar', 'line', 'pie', 'table', 'process', 'map', 'mixed',
      'opinion', 'discussion', 'problem-solution', 'two-part'
    )
  ),
  prompt_visual jsonb,
  body text not null default '',
  started_at timestamptz not null,
  submitted_at timestamptz,
  elapsed_seconds integer not null default 0 check (elapsed_seconds >= 0),
  duration_seconds integer not null check (duration_seconds > 0),
  word_count integer not null default 0 check (word_count >= 0),
  status text not null check (status in ('in_progress', 'completed', 'time_up')),
  created_at timestamptz not null default now()
);

create index writing_attempts_user_started_idx
  on public.writing_attempts (user_id, started_at desc);

alter table public.writing_attempts enable row level security;

grant select, insert, update, delete
  on table public.writing_attempts
  to authenticated;

create policy "Users can read their own writing attempts"
  on public.writing_attempts
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own writing attempts"
  on public.writing_attempts
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own writing attempts"
  on public.writing_attempts
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own writing attempts"
  on public.writing_attempts
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
