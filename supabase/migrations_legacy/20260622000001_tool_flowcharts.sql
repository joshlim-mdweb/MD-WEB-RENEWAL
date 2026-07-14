-- Internal tool: flowchart sessions
-- Used by the /flowchart internal tool (no auth, internal only)

create table if not exists tool_flowcharts (
  id         uuid primary key default gen_random_uuid(),
  title      text not null default 'Untitled',
  data       jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function update_tool_flowcharts_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tool_flowcharts_updated_at
  before update on tool_flowcharts
  for each row execute function update_tool_flowcharts_updated_at();
