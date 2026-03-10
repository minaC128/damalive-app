-- ============================================
-- DAMALIVE Supabase Schema
-- 在 Supabase SQL Editor 中執行此檔案
-- ============================================

-- 1. Profiles 表
create table if not exists profiles (
  uid uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  avatar text not null default '',
  lmp_date text,
  due_date text,
  birth_date text,
  baby_name text,
  is_postpartum boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;


-- Drop all existing policies on profiles
drop policy if exists "Users can view own profile" on profiles;
drop policy if exists "Users can insert own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;
drop policy if exists "Enable all for users based on user_id" on profiles;

-- Create a single, simple policy for all actions
create policy "Enable all for users based on user_id"
on profiles
for all
using (auth.uid() = uid);

-- 2. Moods 表
create table if not exists moods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date text not null,
  mood text not null check (mood in ('happy', 'calm', 'tired', 'sad')),
  created_at timestamptz not null default now(),
  unique(user_id, date)
);

alter table moods enable row level security;

drop policy if exists "Users can view own moods" on moods;
drop policy if exists "Users can insert own moods" on moods;
drop policy if exists "Users can update own moods" on moods;

create policy "Users can view own moods"
  on moods for select using (auth.uid() = user_id);
create policy "Users can insert own moods"
  on moods for insert with check (auth.uid() = user_id);
create policy "Users can update own moods"
  on moods for update using (auth.uid() = user_id);

-- 3. Chat Sessions 表
create table if not exists chat_sessions (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default '新對話',
  timestamp text not null,
  messages jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table chat_sessions enable row level security;

drop policy if exists "Users can view own chats" on chat_sessions;
drop policy if exists "Users can insert own chats" on chat_sessions;
drop policy if exists "Users can update own chats" on chat_sessions;

create policy "Users can view own chats"
  on chat_sessions for select using (auth.uid() = user_id);
create policy "Users can insert own chats"
  on chat_sessions for insert with check (auth.uid() = user_id);
create policy "Users can update own chats"
  on chat_sessions for update using (auth.uid() = user_id);

-- 4. Notes 表
create table if not exists notes (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null default '',
  category text not null check (category in ('task', 'meeting', 'note')),
  date text not null,
  target_date text,
  timestamp bigint not null,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

alter table notes enable row level security;

drop policy if exists "Users can view own notes" on notes;
drop policy if exists "Users can insert own notes" on notes;
drop policy if exists "Users can update own notes" on notes;
drop policy if exists "Users can delete own notes" on notes;

create policy "Users can view own notes"
  on notes for select using (auth.uid() = user_id);
create policy "Users can insert own notes"
  on notes for insert with check (auth.uid() = user_id);
create policy "Users can update own notes"
  on notes for update using (auth.uid() = user_id);
create policy "Users can delete own notes"
  on notes for delete using (auth.uid() = user_id);
