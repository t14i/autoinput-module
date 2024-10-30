import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const revalidate = 0

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  const { data, error } = await supabase
    .from('events')
    .select('id, title, occurred_at, initial_form_data, submitted_form_data')
    .order('occurred_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
} 