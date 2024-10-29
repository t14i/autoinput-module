'use client'

import React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, CalendarIcon, SunIcon } from "lucide-react"

type Task = {
  id: string
  title: string
  date: string
}

const TaskList: React.FC = () => {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([
    { id: '9a42b851-31f4-415e-bf79-05e76ea67ede', title: '株式会社YYY様商談（2024/9/30）', date: '2024-09-30 14:00' },
    { id: '2', title: '株式会社ZZZ様商談（2024/10/1）', date: '2024-10-01 10:00' },
  ])

  const handleAction = (action: 'respond' | 'complete', taskId: string) => {
    if (action === 'respond') {
      router.push(`/${taskId}/form`)
    } else if (action === 'complete') {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
    }
  }

  const handleDelete = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
  }

  if (tasks.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto mt-8">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <SunIcon className="w-24 h-24 text-yellow-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">今日のタスクは終了しました</h2>
          <p className="text-lg text-gray-600">お疲れ様でした</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">タスク一覧</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map(task => (
            <Card key={task.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    {task.date}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" onClick={() => handleAction('respond', task.id)}>対応する</Button>
                  <Button size="sm" variant="outline" onClick={() => handleAction('complete', task.id)}>完了にする</Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">メニューを開く</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDelete(task.id)}>
                        削除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default TaskList