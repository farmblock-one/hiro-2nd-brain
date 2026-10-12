-- Cat.Me giai đoạn 2: bảng items, chỉ chủ sở hữu đọc/ghi được (Row Level Security).

create table if not exists public.items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  type        text not null default 'note'
              check (type in ('note', 'link', 'video', 'book', 'pdf')),
  content     text not null,
  source_url  text,
  status      text not null default 'inbox'
              check (status in ('inbox', 'processed')),
  summary     text,
  tags        text[] not null default '{}',
  created_at  timestamptz not null default now()
);

create index if not exists items_user_created_idx
  on public.items (user_id, created_at desc);

alter table public.items enable row level security;

-- Mỗi người chỉ thấy và sửa dòng của chính mình.
drop policy if exists "items_select_own" on public.items;
create policy "items_select_own" on public.items
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "items_insert_own" on public.items;
create policy "items_insert_own" on public.items
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "items_update_own" on public.items;
create policy "items_update_own" on public.items
  for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "items_delete_own" on public.items;
create policy "items_delete_own" on public.items
  for delete to authenticated using (user_id = auth.uid());
