-- eventsテーブルの作成
create table events (
  id uuid default gen_random_uuid() primary key,
  initial_form_data jsonb not null,
  submitted_form_data jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLSポリシーの設定（必要に応じて）
alter table events enable row level security;

-- 読み取りポリシー
create policy "Enable read access for all users" on events for
    select using (true);

-- 書き込みポリシー
create policy "Enable insert access for authenticated users" on events for
    insert with check (true);

-- 更新ポリシー
create policy "Enable update access for all users" on events for
    update using (true);

-- 削除ポリシー
create policy "Enable delete access for all users" on events for
    delete using (true);

-- インデックスを作成
CREATE INDEX idx_events_initial_form_data ON events USING GIN (initial_form_data);
CREATE INDEX idx_events_submitted_form_data ON events USING GIN (submitted_form_data);

-- コメントを追加
COMMENT ON COLUMN events.initial_form_data IS 'フォームの初期データ';
COMMENT ON COLUMN events.submitted_form_data IS 'ユーザーが送信したフォームデータ';