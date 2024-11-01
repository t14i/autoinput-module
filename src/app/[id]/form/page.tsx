'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { CalendarIcon, RotateCcwIcon, SparklesIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDownIcon } from "lucide-react"

// フォームフィールドの型定義
type FieldType = {
  label: string
  key: string
  type: 'select' | 'number' | 'date' | 'textarea' | 'text'
  previousValue: string | number | Date
  updateValue: string | number | Date
  aiSuggestions?: (string | number | Date)[]
  options?: { value: string, label: string }[] // selectの場合のオプション
}

type FormData = {
  title: string
  mainFields: FieldType[]
  otherFields: FieldType[]
}

// 型定義を追加
type SuggestionValue = string | number | Date;

// フォームデータの初期値（ローディング中やエラー時に使用）
const defaultFormData: FormData = {
  title: "",
  mainFields: [],
  otherFields: []
}

// テキストエリアの自動リサイズ用のカスタムフック
const useAutoResize = (value: string) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  return textareaRef;
};

// 数値フォーマット用の関数を修正
const formatNumber = (value: string | number | Date): string => {
  if (!value) return '';
  if (value instanceof Date) return '';
  if (typeof value === 'string' && !value) return '';
  return Number(value).toLocaleString();
}

// 数値の入力処理用の関数を追加
const handleNumberInput = (value: string): string => {
  return value.replace(/[^\d]/g, '');
}

export default function Component() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  // フォームデータの状態管理を更新
  const [formData, setFormData] = useState<FormData & { id?: string }>(defaultFormData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // AI推奨値の読み込み状態を管理（名前を変更）
  const [aiLoadingStates, setAiLoadingStates] = useState<Record<string, boolean>>({})

  // フォームデータの取得
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        if (!id) {
          setError('IDが指定されていません')
          router.push('/')
          return
        }

        const response = await fetch(`/api/events/${id}`)
        if (!response.ok) {
          throw new Error('データの取得に失敗しました')
        }

        const data = await response.json()
        if (!data) {
          setError('データが見つかりません')
          router.push('/')
          return
        }

        const formDataToUse = data.submitted_form_data || data.initial_form_data
        
        setFormData({
          ...formDataToUse,
          id: data.id,
          title: data.title,
          mainFields: formDataToUse.mainFields || [],
          otherFields: formDataToUse.otherFields || []
        })

        const initialValues: Record<string, string | number | Date> = {}
        formDataToUse.mainFields?.forEach((field: FieldType) => {
          initialValues[field.key] = data.submitted_form_data 
            ? field.updateValue 
            : field.previousValue
        })
        formDataToUse.otherFields?.forEach((field: FieldType) => {
          initialValues[field.key] = data.submitted_form_data 
            ? field.updateValue 
            : field.previousValue
        })
        setValues(initialValues)

      } catch (err) {
        console.error('データ取得エラー:', err)
        setError('フォームデータの取得に失敗しました')
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFormData()
  }, [id, router])

  // 日付フォーマット関数を追加
  const formatDate = useCallback((date: Date) => {
    return format(date, "yyyy/MM/dd")
  }, [])

  // 状態管理を動的に設定
  const [values, setValues] = useState<Record<string, string | number | Date>>({})
  const [userModifiedFields, setUserModifiedFields] = useState<Record<string, boolean>>({})
  const [typingFields, setTypingFields] = useState<Record<string, boolean>>({})
  const [typedTexts, setTypedTexts] = useState<Record<string, string>>({})
  const [showBorders, setShowBorders] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, SuggestionValue[]>>({})
  const [showOnlyChanged, setShowOnlyChanged] = useState(false)
  const [isOtherFieldsOpen, setIsOtherFieldsOpen] = useState(false)

  const isChanged = useCallback((key: string, currentValue: unknown, previousValue: unknown) => {
    if (currentValue instanceof Date && previousValue instanceof Date) {
      return currentValue.getTime() !== previousValue.getTime()
    }
    return currentValue !== previousValue
  }, [])

  const typewriterEffect = useCallback((field: string, fullText: string) => {
    let index = 0
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setTypedTexts(prev => ({ ...prev, [field]: fullText.slice(0, index + 1) }))
        index += 2
      } else {
        clearInterval(interval)
        setTypingFields(prev => ({ ...prev, [field]: false }))
      }
    }, 25)

    return () => clearInterval(interval)
  }, [])

  const resetValue = useCallback((fieldKey: string) => {
    const field = formData.mainFields.find(f => f.key === fieldKey) || formData.otherFields.find(f => f.key === fieldKey)
    if (field) {
      setValues(prev => ({ ...prev, [fieldKey]: field.previousValue }))
      setUserModifiedFields(prev => ({ ...prev, [fieldKey]: false }))
    }
  }, [formData.mainFields, formData.otherFields])

  const getAiSuggestions = useCallback(async (fieldKey: string) => {
    const field = formData.mainFields.find(f => f.key === fieldKey) || formData.otherFields.find(f => f.key === fieldKey)
    if (!field || !field.aiSuggestions) return

    setAiLoadingStates(prev => ({ ...prev, [fieldKey]: true }))
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // デモ用の遅延

      setAiSuggestions(prev => ({
        ...prev,
        [fieldKey]: field.aiSuggestions || []
      }))
    } catch (error) {
      console.error('AI推奨値の取得に失敗しました:', error)
    } finally {
      setAiLoadingStates(prev => ({ ...prev, [fieldKey]: false }))
    }
  }, [formData.mainFields, formData.otherFields])

  const handleUserModification = useCallback((fieldKey: string) => {
    setUserModifiedFields(prev => ({ ...prev, [fieldKey]: true }))
  }, [])

  const renderField = useCallback((field: FieldType) => {
    const currentValue = values[field.key]
    const previousValue = field.previousValue
    const isFieldChanged = isChanged(field.key, currentValue, previousValue)
    const isUserModified = userModifiedFields[field.key]
    const shouldShowBorder = showBorders && isFieldChanged && !isUserModified
    const isTyping = typingFields[field.key]
    const typedText = typedTexts[field.key]

    if (showOnlyChanged && !isFieldChanged && !isUserModified) {
      return null
    }

    const TextareaWithAutoResize = () => {
      const textareaRef = useAutoResize(currentValue as string);
      return (
        <Textarea
          ref={textareaRef}
          value={isTyping ? typedText : String(currentValue)}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setValues(prev => ({ ...prev, [field.key]: e.target.value }))
            handleUserModification(field.key)
          }}
          className="w-full min-h-[100px] overflow-hidden resize-none"
        />
      )
    }

    // 元の値の表示を修正
    const getPreviousValueDisplay = (field: FieldType): string => {
      if (!field.previousValue) return '値なし';
      
      if (field.type === 'select') {
        const option = field.options?.find(opt => opt.value === String(field.previousValue));
        return option?.label || String(field.previousValue);
      }
      if (field.type === 'number') {
        if (typeof field.previousValue === 'number' || typeof field.previousValue === 'string') {
          return formatNumber(field.previousValue);
        }
        return '値なし';
      }
      if (field.type === 'date') {
        return formatDate(new Date(field.previousValue as Date));
      }
      return String(field.previousValue);
    }

    const getFieldContent = () => {
      switch (field.type) {
        case 'select':
          return (
            <Select
              value={String(currentValue)}
              onValueChange={(value) => {
                setValues(prev => ({ ...prev, [field.key]: value }))
                handleUserModification(field.key)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        case 'number':
          return (
            <Input
              type="text"
              value={formatNumber(currentValue as string)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const rawValue = handleNumberInput(e.target.value);
                setValues(prev => ({ ...prev, [field.key]: rawValue }));
                handleUserModification(field.key);
              }}
              className="w-full"
            />
          )
        case 'date':
          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {currentValue ? formatDate(new Date(currentValue)) : "日付を選択"}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={currentValue ? new Date(currentValue) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      setValues(prev => ({ ...prev, [field.key]: date }))
                      handleUserModification(field.key)
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )
        case 'textarea':
          return <TextareaWithAutoResize />
        case 'text':
        default:
          return (
            <Input
              value={String(currentValue || '')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setValues(prev => ({ ...prev, [field.key]: e.target.value }))
                handleUserModification(field.key)
              }}
              className="w-full"
            />
          )
      }
    }

    return (
      <div 
        key={field.key}
        className={cn(
          "flex min-h-[3rem] border-b border-gray-100 hover:bg-gray-50",
          field.key === 'customerIssue' ? "items-start py-3" : "items-center py-2"
        )}
      >
        {/* 項目ラベル */}
        <div className="w-[18%] px-4">
          <span className="text-sm">{field.label}</span>
        </div>

        {/* 元の値 */}
        <div className="w-[24%] flex items-center min-h-full">
          <span className="text-sm text-muted-foreground leading-normal px-4 py-0.5">
            {getPreviousValueDisplay(field)}
          </span>
        </div>

        {/* 矢印 */}
        <div className="w-[4%] flex items-center justify-center">
          <span className="text-sm text-muted-foreground">→</span>
        </div>

        {/* 更新する値 */}
        <div className={cn(
          "w-[44%] flex flex-col",
          field.key === 'customerIssue' ? "pt-0.5" : "justify-center"
        )}>
          <div className={cn(
            "relative w-full",
            shouldShowBorder && "before:absolute before:-inset-1 before:border-2 before:border-blue-500 before:rounded-md"
          )}>
            {getFieldContent()}
          </div>

          {/* AI推奨値の表示部分 */}
          {aiLoadingStates[field.key] ? (
            <div className="mt-3 flex items-center space-x-2">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span className="text-xs text-muted-foreground">推定中...</span>
            </div>
          ) : aiSuggestions[field.key] && (
            <div className="mt-3 space-y-2">
              <div className="text-xs text-muted-foreground">AI推定値:</div>
              <div className="flex flex-wrap gap-2">
                {aiSuggestions[field.key].map((suggestion: SuggestionValue, index: number) => (
                  <Badge
                    key={`${field.key}-${index}`}
                    variant="outline"
                    className={cn(
                      "text-xs cursor-pointer py-1 px-3",
                      index === 0 && "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200",
                      index === 1 && "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200",
                      index === 2 && "bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                    )}
                    onClick={() => {
                      if (field.type === 'date' && suggestion instanceof Date) {
                        setValues(prev => ({ ...prev, [field.key]: suggestion }))
                      } else {
                        setValues(prev => ({ ...prev, [field.key]: suggestion }))
                      }
                      setUserModifiedFields(prev => ({ ...prev, [field.key]: true }))
                    }}
                  >
                    {field.type === 'date' 
                      ? formatDate(suggestion instanceof Date ? suggestion : new Date(suggestion)) 
                      : String(suggestion)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* アクションボタン */}
        <div className="w-[10%] flex items-center justify-end space-x-1 pl-2 min-h-full">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => resetValue(field.key)}
                  className="h-8 w-8 px-0"
                >
                  <RotateCcwIcon className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>元の値に戻す</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => getAiSuggestions(field.key)}
                  className="h-8 w-8 px-0"
                >
                  <SparklesIcon className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>AIの推定値を取得</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    )
  }, [values, userModifiedFields, typingFields, typedTexts, showBorders, isChanged, handleUserModification, resetValue, getAiSuggestions, formatDate, aiLoadingStates, aiSuggestions, showOnlyChanged, formatNumber, handleNumberInput])

  useEffect(() => {
    if (!formData) return

    const timer = setTimeout(() => {
      const updatedValues: Record<string, string | number | Date> = {}
      const updatedTypingFields: Record<string, boolean> = {}
      const updatedTypedTexts: Record<string, string> = {}

      formData.mainFields.forEach(field => {
        const targetValue = field.updateValue || field.previousValue
        if (isChanged(field.key, targetValue, field.previousValue)) {
          if (typeof targetValue === 'string') {
            updatedTypingFields[field.key] = true
            updatedTypedTexts[field.key] = ''
            typewriterEffect(field.key, targetValue as string)
          }
          updatedValues[field.key] = targetValue
        }
      })

      formData.otherFields.forEach(field => {
        const targetValue = field.updateValue || field.previousValue
        if (isChanged(field.key, targetValue, field.previousValue)) {
          if (typeof targetValue === 'string') {
            updatedTypingFields[field.key] = true
            updatedTypedTexts[field.key] = ''
            typewriterEffect(field.key, targetValue as string)
          }
          updatedValues[field.key] = targetValue
        }
      })

      if (Object.keys(updatedValues).length > 0) {
        setValues(prev => ({ ...prev, ...updatedValues }))
      }
      if (Object.keys(updatedTypingFields).length > 0) {
        setTypingFields(prev => ({ ...prev, ...updatedTypingFields }))
      }
      if (Object.keys(updatedTypedTexts).length > 0) {
        setTypedTexts(prev => ({ ...prev, ...updatedTypedTexts }))
      }
      setShowBorders(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [formData, isChanged, typewriterEffect])

  const handleSave = useCallback(async () => {
    try {
      if (!formData.id) {
        throw new Error('フォームデータのIDが見つかりません')
      }

      const submittedFormData = {
        mainFields: formData.mainFields.map(field => ({
          ...field,
          updateValue: values[field.key] || field.previousValue
        })),
        otherFields: formData.otherFields.map(field => ({
          ...field,
          updateValue: values[field.key] || field.previousValue
        }))
      }

      const response = await fetch(`/api/events/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ submitted_form_data: submittedFormData }),
      })

      if (!response.ok) {
        throw new Error('保存に失敗しました')
      }

      router.push(`/${formData.id}/mail`)
    } catch (err) {
      console.error('保存エラー:', err)
      // エラー処理を追加
    }
  }, [formData, values, router])

  // ローディング中の表示
  if (isLoading) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  // エラー時の表示
  if (error) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardContent className="py-8">
          <div className="text-center text-red-500">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-6xl mx-auto mt-8">
      <CardHeader className="flex flex-row items-center justify-between py-6">
        <CardTitle className="text-2xl font-bold">{formData.title}</CardTitle>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-changed"
              checked={showOnlyChanged}
              onCheckedChange={setShowOnlyChanged}
            />
            <Label htmlFor="show-changed" className="text-sm">
              変更項目のみ
            </Label>
          </div>
          <Button onClick={handleSave}>保存</Button>
        </div>
      </CardHeader>
      <CardContent className="py-0">
        <div className="relative">
          {/* ヘッダー */}
          <div className="flex items-center py-2 border-y border-gray-200 bg-gray-50 text-sm font-medium text-gray-500">
            <div className="w-[18%] px-4">項目</div>
            <div className="w-[24%] px-4">元の値</div>
            <div className="w-[4%]"></div>
            <div className="w-[44%] pl-6">更新する値</div>
            <div className="w-[10%]"></div>
          </div>

          {/* コンテンツ */}
          <div>
            <div className="divide-y divide-gray-100">
              {/* メインフィールド */}
              {formData.mainFields.map(field => renderField(field))}
            </div>

            {/* otherFieldsが存在し、かつ空でない場合のみ表示 */}
            {formData.otherFields && formData.otherFields.length > 0 && (
              <Collapsible open={isOtherFieldsOpen} onOpenChange={setIsOtherFieldsOpen} className="mt-4">
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-between w-full h-8 text-sm bg-gray-50 hover:bg-gray-100 border-gray-200"
                  >
                    その他の項目
                    <ChevronDownIcon className={cn("h-4 w-4 transition-transform", isOtherFieldsOpen && "rotate-180")} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 rounded-b-lg border-gray-200">
                  <div className="divide-y divide-gray-200">
                    {formData.otherFields.map(field => renderField(field))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* 下部のスペースを追加 */}
            <div className="h-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
 