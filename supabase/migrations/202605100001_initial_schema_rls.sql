create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create type public.group_role as enum ('owner', 'editor', 'viewer');
create type public.spot_category as enum (
  'restaurant',
  'cafe',
  'bar',
  'shop',
  'culture',
  'outdoor',
  'lodging',
  'other'
);
create type public.revisit_intent as enum (
  'must-revisit',
  'would-revisit',
  'maybe',
  'avoid'
);
create type public.marker_meaning as enum (
  'strong-recommend',
  'good',
  'okay',
  'memory',
  'reconsider',
  'special-day',
  'low-revisit'
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(trim(display_name)) between 1 and 80),
  avatar_url text check (avatar_url is null or char_length(avatar_url) <= 2048),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.groups (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 80),
  created_by_user_id uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.group_members (
  id uuid primary key default extensions.gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.group_role not null default 'viewer',
  joined_at timestamptz not null default now(),
  unique (group_id, user_id)
);

create table public.spots (
  id uuid primary key default extensions.gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  created_by_user_id uuid not null references auth.users (id) on delete restrict,
  name text not null check (char_length(trim(name)) between 1 and 120),
  category public.spot_category not null,
  revisit_intent public.revisit_intent not null,
  marker_meaning public.marker_meaning not null,
  rating integer check (rating is null or rating between 1 and 5),
  address text check (address is null or char_length(trim(address)) between 1 and 240),
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  external_url text check (external_url is null or char_length(external_url) <= 2048),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.spot_memos (
  id uuid primary key default extensions.gen_random_uuid(),
  spot_id uuid not null references public.spots (id) on delete cascade,
  author_user_id uuid not null references auth.users (id) on delete restrict,
  body text not null check (char_length(trim(body)) between 1 and 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.spot_photos (
  id uuid primary key default extensions.gen_random_uuid(),
  spot_id uuid not null references public.spots (id) on delete cascade,
  uploaded_by_user_id uuid not null references auth.users (id) on delete restrict,
  bucket text not null default 'spot-photos' check (bucket = 'spot-photos'),
  storage_path text not null check (
    storage_path like 'groups/%/spots/%/%'
    and char_length(storage_path) <= 1024
  ),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  alt_text text check (alt_text is null or char_length(trim(alt_text)) <= 160),
  public_url text check (public_url is null or char_length(public_url) <= 2048),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

comment on column public.spot_photos.storage_path is
  'Storage object path must follow groups/{groupId}/spots/{spotId}/{photoId} so later Storage policies can derive group scope.';

create table public.spot_tags (
  id uuid primary key default extensions.gen_random_uuid(),
  spot_id uuid not null references public.spots (id) on delete cascade,
  created_by_user_id uuid not null references auth.users (id) on delete restrict,
  tag text not null check (char_length(trim(tag)) between 1 and 40),
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (spot_id, tag)
);

create table public.spot_visits (
  id uuid primary key default extensions.gen_random_uuid(),
  spot_id uuid not null references public.spots (id) on delete cascade,
  visited_by_user_id uuid not null references auth.users (id) on delete restrict,
  visited_at date not null,
  note text check (note is null or char_length(trim(note)) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index profiles_display_name_idx on public.profiles (display_name);
create index groups_created_by_user_id_idx on public.groups (created_by_user_id);
create index group_members_user_id_idx on public.group_members (user_id);
create index group_members_group_id_role_idx on public.group_members (group_id, role);
create index spots_group_id_idx on public.spots (group_id) where deleted_at is null;
create index spots_map_bounds_idx on public.spots (group_id, latitude, longitude) where deleted_at is null;
create index spots_category_idx on public.spots (group_id, category) where deleted_at is null;
create index spots_rating_idx on public.spots (group_id, rating) where deleted_at is null;
create index spots_marker_meaning_idx on public.spots (group_id, marker_meaning) where deleted_at is null;
create index spot_memos_spot_id_idx on public.spot_memos (spot_id) where deleted_at is null;
create index spot_photos_spot_id_idx on public.spot_photos (spot_id) where deleted_at is null;
create index spot_tags_spot_id_idx on public.spot_tags (spot_id) where deleted_at is null;
create index spot_tags_tag_idx on public.spot_tags (tag) where deleted_at is null;
create index spot_visits_spot_id_visited_at_idx on public.spot_visits (spot_id, visited_at desc) where deleted_at is null;
create index spot_visits_visited_by_user_id_idx on public.spot_visits (visited_by_user_id, visited_at desc) where deleted_at is null;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger groups_set_updated_at
before update on public.groups
for each row execute function public.set_updated_at();

create trigger spots_set_updated_at
before update on public.spots
for each row execute function public.set_updated_at();

create trigger spot_memos_set_updated_at
before update on public.spot_memos
for each row execute function public.set_updated_at();

create trigger spot_visits_set_updated_at
before update on public.spot_visits
for each row execute function public.set_updated_at();

create or replace function public.current_user_group_role(target_group_id uuid)
returns public.group_role
language sql
stable
security definer
set search_path = public
as $$
  select gm.role
  from public.group_members as gm
  where gm.group_id = target_group_id
    and gm.user_id = auth.uid()
  limit 1
$$;

create or replace function public.is_group_member(target_group_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_group_role(target_group_id) is not null
$$;

create or replace function public.can_edit_group(target_group_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_group_role(target_group_id) in ('owner', 'editor')
$$;

create or replace function public.can_manage_group_members(target_group_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_group_role(target_group_id) = 'owner'
$$;

create or replace function public.spot_group_id(target_spot_id uuid)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select s.group_id
  from public.spots as s
  where s.id = target_spot_id
  limit 1
$$;

create or replace function public.can_read_spot(target_spot_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.spots as s
    where s.id = target_spot_id
      and s.deleted_at is null
      and public.is_group_member(s.group_id)
  )
$$;

create or replace function public.can_edit_spot(target_spot_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.spots as s
    where s.id = target_spot_id
      and public.can_edit_group(s.group_id)
  )
$$;

alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.spots enable row level security;
alter table public.spot_memos enable row level security;
alter table public.spot_photos enable row level security;
alter table public.spot_tags enable row level security;
alter table public.spot_visits enable row level security;

create policy "profiles are readable by owner or group peers"
on public.profiles for select
to authenticated
using (
  id = auth.uid()
  or exists (
    select 1
    from public.group_members as mine
    join public.group_members as theirs on theirs.group_id = mine.group_id
    where mine.user_id = auth.uid()
      and theirs.user_id = profiles.id
  )
);

create policy "users can insert their own profile"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

create policy "users can update their own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "members can read their groups"
on public.groups for select
to authenticated
using (public.is_group_member(id));

create policy "authenticated users can create owned groups"
on public.groups for insert
to authenticated
with check (created_by_user_id = auth.uid());

create policy "owners can update groups"
on public.groups for update
to authenticated
using (public.can_manage_group_members(id))
with check (public.can_manage_group_members(id));

create policy "owners can delete groups"
on public.groups for delete
to authenticated
using (public.can_manage_group_members(id));

create policy "members can read group memberships"
on public.group_members for select
to authenticated
using (public.is_group_member(group_id));

create policy "group creators can add their first owner membership"
on public.group_members for insert
to authenticated
with check (
  user_id = auth.uid()
  and role = 'owner'
  and exists (
    select 1
    from public.groups as g
    where g.id = group_members.group_id
      and g.created_by_user_id = auth.uid()
  )
);

create policy "owners can add group members"
on public.group_members for insert
to authenticated
with check (public.can_manage_group_members(group_id));

create policy "owners can update group members"
on public.group_members for update
to authenticated
using (public.can_manage_group_members(group_id))
with check (public.can_manage_group_members(group_id));

create policy "owners can remove group members"
on public.group_members for delete
to authenticated
using (public.can_manage_group_members(group_id));

create policy "members can read active spots"
on public.spots for select
to authenticated
using (deleted_at is null and public.is_group_member(group_id));

create policy "editors can create spots"
on public.spots for insert
to authenticated
with check (created_by_user_id = auth.uid() and public.can_edit_group(group_id));

create policy "editors can update spots"
on public.spots for update
to authenticated
using (public.can_edit_group(group_id))
with check (public.can_edit_group(group_id));

create policy "editors can delete spots"
on public.spots for delete
to authenticated
using (public.can_edit_group(group_id));

create policy "members can read active memos"
on public.spot_memos for select
to authenticated
using (deleted_at is null and public.can_read_spot(spot_id));

create policy "editors can create memos"
on public.spot_memos for insert
to authenticated
with check (author_user_id = auth.uid() and public.can_edit_spot(spot_id));

create policy "editors can update memos"
on public.spot_memos for update
to authenticated
using (public.can_edit_spot(spot_id))
with check (public.can_edit_spot(spot_id));

create policy "editors can delete memos"
on public.spot_memos for delete
to authenticated
using (public.can_edit_spot(spot_id));

create policy "members can read active photos"
on public.spot_photos for select
to authenticated
using (deleted_at is null and public.can_read_spot(spot_id));

create policy "editors can create photos"
on public.spot_photos for insert
to authenticated
with check (uploaded_by_user_id = auth.uid() and public.can_edit_spot(spot_id));

create policy "editors can update photos"
on public.spot_photos for update
to authenticated
using (public.can_edit_spot(spot_id))
with check (public.can_edit_spot(spot_id));

create policy "editors can delete photos"
on public.spot_photos for delete
to authenticated
using (public.can_edit_spot(spot_id));

create policy "members can read active tags"
on public.spot_tags for select
to authenticated
using (deleted_at is null and public.can_read_spot(spot_id));

create policy "editors can create tags"
on public.spot_tags for insert
to authenticated
with check (created_by_user_id = auth.uid() and public.can_edit_spot(spot_id));

create policy "editors can update tags"
on public.spot_tags for update
to authenticated
using (public.can_edit_spot(spot_id))
with check (public.can_edit_spot(spot_id));

create policy "editors can delete tags"
on public.spot_tags for delete
to authenticated
using (public.can_edit_spot(spot_id));

create policy "members can read active visits"
on public.spot_visits for select
to authenticated
using (deleted_at is null and public.can_read_spot(spot_id));

create policy "editors can create visits"
on public.spot_visits for insert
to authenticated
with check (visited_by_user_id = auth.uid() and public.can_edit_spot(spot_id));

create policy "editors can update visits"
on public.spot_visits for update
to authenticated
using (public.can_edit_spot(spot_id))
with check (public.can_edit_spot(spot_id));

create policy "editors can delete visits"
on public.spot_visits for delete
to authenticated
using (public.can_edit_spot(spot_id));
