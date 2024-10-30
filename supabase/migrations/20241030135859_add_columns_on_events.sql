ALTER TABLE events
ADD COLUMN title text,
ADD COLUMN occurred_at timestamptz,
ADD COLUMN reply_message text,
ADD COLUMN summary text;

-- 既存のレコードのoccurred_atとtitleにデフォルト値を設定
UPDATE events
SET occurred_at = CURRENT_TIMESTAMP,
    title = 'イベント'
WHERE occurred_at IS NULL OR title IS NULL;

-- occurred_atとtitleカラムを必須に設定
ALTER TABLE events
ALTER COLUMN occurred_at SET NOT NULL,
ALTER COLUMN title SET NOT NULL;

-- カラムにコメントを追加
COMMENT ON COLUMN events.title IS 'タイトル';
COMMENT ON COLUMN events.occurred_at IS '発生時間';
COMMENT ON COLUMN events.reply_message IS '返信メッセージ';
COMMENT ON COLUMN events.summary IS '内容の要約';
