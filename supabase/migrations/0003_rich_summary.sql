-- Cat.Me: tóm tắt giàu hơn (ý chính, trích dẫn, việc có thể làm).
alter table public.items add column if not exists key_points   jsonb  not null default '[]'::jsonb;
alter table public.items add column if not exists quotes       text[] not null default '{}';
alter table public.items add column if not exists action_items text[] not null default '{}';
