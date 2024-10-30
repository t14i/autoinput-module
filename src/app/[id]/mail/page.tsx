'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CopyIcon, CheckIcon } from "lucide-react"

type Event = {
  id: string
  title: string
  occurred_at: string
  reply_message: {
    to: string
    cc: string
    subject: string
    body: string
  }
  content: {
    minutes: string
  }
}

// タイピングアニメーション用のカスタムフック
const useTypewriter = (text: string, speed: number = 10) => {
  const [displayText, setDisplayText] = useState<string>('')
  const [isTyping, setIsTyping] = useState<boolean>(false)

  useEffect(() => {
    if (!text) {
      setDisplayText('');
      return;
    }
    
    setIsTyping(true);
    let currentIndex = 0;
    const characters = text.split('');

    const typeNextCharacter = () => {
      if (currentIndex < characters.length) {
        setDisplayText(characters.slice(0, currentIndex + 1).join(''));
        currentIndex++;
        setTimeout(typeNextCharacter, speed);
      } else {
        setIsTyping(false);
      }
    };

    setDisplayText('');
    typeNextCharacter();

    return () => {
      setDisplayText('');
      currentIndex = characters.length;
    };
  }, [text, speed]);

  return { displayText, isTyping };
};

export default function ThankYouMail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showCheckmark, setShowCheckmark] = useState(false)
  const [startTyping, setStartTyping] = useState(false)

  const bodyRef = useRef<HTMLTextAreaElement>(null)
  const minutesRef = useRef<HTMLTextAreaElement>(null)

  // タイピング効果を適用
  const { displayText: bodyDisplayText } = useTypewriter(
    startTyping && event?.reply_message?.body ? event.reply_message.body : '',
    5
  );
  const { displayText: minutesDisplayText } = useTypewriter(
    startTyping && event?.content?.minutes ? event.content.minutes : '',
    5
  );

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch event')
        const data = await response.json()
        setEvent(data)
        // データ取得後、少し遅延してタイピングを開始
        setTimeout(() => setStartTyping(true), 500);
      } catch (error) {
        console.error('Error fetching event:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvent()
  }, [params.id])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const useEmailInput = (value: string, onChange: (value: string) => void) => {
    const inputRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.innerHTML = formatEmailContent(value)
      }
    }, [value])

    const formatEmailContent = (content: string) => {
      return content.split(/,\s*/).map(email => {
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        if (isValidEmail) {
          return `<span class="inline-flex items-center bg-secondary text-secondary-foreground rounded-full px-2 py-1 text-xs mr-1 mb-1">
            ${email}
          </span>`
        }
        return `<span>${email}</span>`
      }).join(', ')
    }

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
      const newValue = e.currentTarget.innerText
      onChange(newValue)
    }

    return { inputRef, handleInput }
  }

  const EmailInput = ({ value, onChange }: { value: string, onChange: (value: string) => void }) => {
    const { inputRef, handleInput } = useEmailInput(value, onChange)

    return (
      <div
        ref={inputRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[40px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        style={{ lineHeight: '2' }}
      />
    )
  }

  const renderField = (label: string, value: string, onChange: (value: string) => void, isTextarea = false, isEmail = false, ref?: React.RefObject<HTMLTextAreaElement>) => (
    <div className={`relative ${isTextarea ? 'h-full' : ''} space-y-2`}>
      <Label htmlFor={label}>{label}</Label>
      {isTextarea ? (
        <div className="relative h-[calc(100%-2rem)] overflow-hidden">
          <textarea
            ref={ref}
            id={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full p-2 pr-10 border rounded-md resize-none overflow-auto"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => copyToClipboard(value)}
          >
            <CopyIcon className="h-4 w-4" />
          </Button>
        </div>
      ) : isEmail ? (
        <EmailInput value={value} onChange={onChange} />
      ) : (
        <div className="relative">
          <Input
            id={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pr-10"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => copyToClipboard(value)}
          >
            <CopyIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )

  if (isLoading || !event) {
    return <div>Loading...</div>
  }

  const handleAction = async (action: 'send' | 'complete') => {
    // TODO: API経由で送信または完了処理を実装
    setShowCheckmark(true)
    setTimeout(() => {
      setShowCheckmark(false)
      router.push('/')
    }, 1500)
  }

  return (
    <Card className="w-full max-w-7xl mx-auto mt-8 h-[calc(100vh-4rem)]">
      <CardHeader className="flex flex-row items-center justify-between py-6">
        <CardTitle className="text-2xl font-bold">{event.title}</CardTitle>
        <div className="flex items-center space-x-2">
          <Button onClick={() => handleAction('send')}>
            送信
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAction('complete')}
          >
            対応済にする
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 h-[calc(100vh-16rem)] overflow-hidden">
        <div className="flex gap-8 h-full">
          <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
            <div className="space-y-4">
              {renderField("宛先", event.reply_message.to, (value) => {
                setEvent(prev => prev ? {
                  ...prev,
                  reply_message: { ...prev.reply_message, to: value }
                } : null)
              }, false, true)}
              {renderField("CC", event.reply_message.cc, (value) => {
                setEvent(prev => prev ? {
                  ...prev,
                  reply_message: { ...prev.reply_message, cc: value }
                } : null)
              }, false, true)}
              {renderField("件名", event.reply_message.subject, (value) => {
                setEvent(prev => prev ? {
                  ...prev,
                  reply_message: { ...prev.reply_message, subject: value }
                } : null)
              })}
            </div>
            <div className="flex-1 min-h-0">
              <div className="relative h-full space-y-2">
                <Label htmlFor="body">本文</Label>
                <div className="relative h-[calc(100%-2rem)] overflow-hidden">
                  <textarea
                    ref={bodyRef}
                    id="body"
                    value={bodyDisplayText || ''}
                    readOnly
                    className="w-full h-full p-2 pr-10 border rounded-md resize-none overflow-auto"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(event?.reply_message?.body || '')}
                  >
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
            <div className="flex-1 min-h-0">
              <div className="relative h-full space-y-2">
                <Label htmlFor="minutes">議事録</Label>
                <div className="relative h-[calc(100%-2rem)] overflow-hidden">
                  <textarea
                    ref={minutesRef}
                    id="minutes"
                    value={minutesDisplayText || ''}
                    readOnly
                    className="w-full h-full p-2 pr-10 border rounded-md resize-none overflow-auto"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(event?.content?.minutes || '')}
                  >
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      {showCheckmark && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-full p-6 animate-bounce">
            <CheckIcon className="w-24 h-24 text-green-500" />
          </div>
        </div>
      )}
    </Card>
  )
}