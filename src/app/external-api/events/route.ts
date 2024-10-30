import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 0

export async function POST(request: NextRequest) {
  try {
    // Supabaseクライアントの初期化
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const body = await request.json()
    
    // リクエストボディのバリデーション
    const { initial_form_data, title, occurred_at, reply_message, content } = body
    
    if (!title || !occurred_at) {
      return NextResponse.json(
        { error: '必須フィールドが不足しています' },
        { status: 400 }
      )
    }

    // Supabaseにデータを挿入
    const { data, error } = await supabase
      .from('events')
      .insert([
        {
          initial_form_data,
          title,
          occurred_at: new Date(occurred_at).toISOString(),
          reply_message,
          content,
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'データの保存に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })

  } catch (error) {
    console.error('イベント作成エラー:', error)
    return NextResponse.json(
      { error: 'リクエストの処理に失敗しました' },
      { status: 500 }
    )
  }
} 