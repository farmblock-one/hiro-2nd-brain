-- Cat.Me giai đoạn 3: thêm trường do AI điền.
alter table public.items add column if not exists title  text;
alter table public.items add column if not exists domain text;
