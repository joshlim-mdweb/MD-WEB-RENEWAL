-- MD Manual Studio — 매뉴얼 스키마
-- Version(29) → Category(21) → Article(456), 버전은 아티클 속성(text[])

create table public.manual_versions (
  code text primary key,          -- "2026.0", "12.2", "2.2" …
  sort int not null               -- 최신 = 0
);

create table public.manual_categories (
  slug text primary key,
  name text not null,
  sort int not null default 0
);

create table public.manual_articles (
  canonical_id text primary key,  -- Zendesk 원본 article id
  slug text not null,
  category_slug text not null references public.manual_categories(slug),
  title text not null,
  body_md text not null,
  versions text[] not null,       -- 명시적 유효 버전 리스트 (최신순)
  videos jsonb not null default '[]',
  tobe_action text not null default 'keep',
  source_ids jsonb not null default '[]',
  updated_at timestamptz not null default now(),
  updated_by text,
  unique (category_slug, slug)
);
create index manual_articles_versions_gin on public.manual_articles using gin (versions);
create index manual_articles_category on public.manual_articles (category_slug);

create table public.manual_revisions (
  id bigint generated always as identity primary key,
  canonical_id text not null references public.manual_articles(canonical_id) on delete cascade,
  title text not null,
  body_md text not null,
  edited_by text,
  edited_at timestamptz not null default now()
);
create index manual_revisions_article on public.manual_revisions (canonical_id, edited_at desc);

-- RLS: 읽기 공개, 쓰기는 인증 사용자만
alter table public.manual_versions enable row level security;
alter table public.manual_categories enable row level security;
alter table public.manual_articles enable row level security;
alter table public.manual_revisions enable row level security;

create policy "public read versions"   on public.manual_versions   for select using (true);
create policy "public read categories" on public.manual_categories for select using (true);
create policy "public read articles"   on public.manual_articles   for select using (true);
create policy "auth write articles"    on public.manual_articles   for update to authenticated using (true) with check (true);
create policy "auth read revisions"    on public.manual_revisions  for select to authenticated using (true);
create policy "auth insert revisions"  on public.manual_revisions  for insert to authenticated with check (true);
