-- Phase 2: 편집·검수·이미지 업로드

-- 낙관적 잠금 + 검수 필드
alter table public.manual_articles
  add column rev int not null default 0,
  add column review_status text not null default 'pending'
    check (review_status in ('pending', 'approved', 'needs_fix')),
  add column needs_attention text,          -- 우선 검수 사유 (merged-mechanical 등)
  add column reviewed_by text,
  add column review_note text;

alter table public.manual_categories add column assignee text;

-- 개별 편집자 허용 목록 (@clo3d.com 외 추가용)
create table public.manual_editors (
  email text primary key,
  added_at timestamptz not null default now()
);
alter table public.manual_editors enable row level security;
create policy "auth read editors" on public.manual_editors for select to authenticated using (true);

-- 편집 권한 판정 함수
create or replace function public.is_manual_editor()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(auth.jwt()->>'email', '') like '%@clo3d.com'
      or exists (select 1 from public.manual_editors where email = auth.jwt()->>'email');
$$;

-- 쓰기 정책 교체: 인증 + 편집자 판정
drop policy "auth write articles" on public.manual_articles;
create policy "editor update articles" on public.manual_articles
  for update to authenticated using (public.is_manual_editor()) with check (public.is_manual_editor());

drop policy "auth insert revisions" on public.manual_revisions;
create policy "editor insert revisions" on public.manual_revisions
  for insert to authenticated with check (public.is_manual_editor());

create policy "editor update categories" on public.manual_categories
  for update to authenticated using (public.is_manual_editor()) with check (public.is_manual_editor());

-- 이미지 버킷 (공개 읽기 / 편집자 쓰기)
insert into storage.buckets (id, name, public) values ('manual-images', 'manual-images', true)
  on conflict (id) do nothing;
create policy "public read manual images" on storage.objects
  for select using (bucket_id = 'manual-images');
create policy "editor upload manual images" on storage.objects
  for insert to authenticated with check (bucket_id = 'manual-images' and public.is_manual_editor());
