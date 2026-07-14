-- Add(신규 문서 insert) + Archive(soft delete)

alter table public.manual_articles add column archived_at timestamptz;
alter table public.manual_articles add column archived_by text;

create index manual_articles_active on public.manual_articles (category_slug) where archived_at is null;

-- 신규 문서 insert 정책 (편집자만)
create policy "editor insert articles" on public.manual_articles
  for insert to authenticated with check (public.is_manual_editor());
