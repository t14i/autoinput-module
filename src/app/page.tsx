'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sun } from "lucide-react"
import { format } from "date-fns"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// イベントの型定義
type Event = {
  id: string
  title: string
  occurred_at: string
  status: string
  submitted_form_data?: {
    mainFields: Array<{
      key: string
      label: string
      previousValue: string | number | Date
      updateValue: string | number | Date
    }>
    otherFields: Array<{
      key: string
      label: string
      previousValue: string | number | Date
      updateValue: string | number | Date
    }>
  }
  // 他の必要なプロパティがあれば追加
}

export default function Page() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCompleted, setShowCompleted] = useState(false)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/events')
        if (!response.ok) {
          throw new Error('データの取得に失敗しました')
        }

        const data = await response.json()
        setEvents(data)
      } catch (err) {
        console.error('データ取得エラー:', err)
        setError('イベントの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const filteredEvents = events.filter(event => 
    showCompleted ? true : !event.submitted_form_data
  )

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="py-8">
          <div className="text-center text-red-500">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>タスク一覧</CardTitle>
        <div className="flex items-center space-x-2">
          <Switch
            id="show-completed"
            checked={showCompleted}
            onCheckedChange={setShowCompleted}
          />
          <Label htmlFor="show-completed" className="text-sm text-muted-foreground">
            対応済も表示
          </Label>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <Link
              key={event.id}
              href={`/${event.id}/form`}
              className="block p-4 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{event.title}</h3>
                  <p className="text-sm text-gray-500">
                    {format(new Date(event.occurred_at), 'yyyy/MM/dd HH:mm')}
                  </p>
                </div>
                <Badge variant={event.submitted_form_data ? "secondary" : "default"}>
                  {event.submitted_form_data ? "対応済" : "未対応"}
                </Badge>
              </div>
            </Link>
          ))}
          
          {filteredEvents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Sun className="h-12 w-12 mx-auto mb-4" />
              今日のタスクは終了しましたお疲れ様でした。
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}