'use client'

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
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
  initialValue: string | number | Date
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

// 正確なinitialFormDataを再現
const initialFormData: FormData = {
  title: "株式会社XXX様商談（2024/10/1）",
  mainFields: [
    {
      label: "受注確度",
      key: "orderProbability",
      type: "select",
      previousValue: "B",
      initialValue: "A",
      aiSuggestions: ["A", "B", "C"],
      options: [
        { value: "S", label: "S" },
        { value: "A", label: "A" },
        { value: "B", label: "B" },
        { value: "C", label: "C" }
      ]
    },
    {
      label: "受注金額",
      key: "orderAmount",
      type: "number",
      previousValue: 1000000,
      initialValue: 1200000,
      aiSuggestions: [1200000, 1500000, 900000]
    },
    {
      label: "予算策定時期",
      key: "budgetPrepDate",
      type: "date",
      previousValue: new Date("2023-05-01"),
      initialValue: new Date("2023-05-01"),
      aiSuggestions: [new Date("2023-05-02"), new Date("2023-05-03"), new Date("2023-05-04")]
    },
    {
      label: "予算申請時期",
      key: "budgetRequestDate",
      type: "date",
      previousValue: new Date("2023-05-15"),
      initialValue: new Date("2023-05-20"),
      aiSuggestions: [new Date("2023-05-18"), new Date("2023-05-22"), new Date("2023-05-25")]
    },
    {
      label: "予算確定時期",
      key: "budgetConfirmDate",
      type: "date",
      previousValue: new Date("2023-05-30"),
      initialValue: new Date("2023-05-30"),
      aiSuggestions: [new Date("2023-06-01"), new Date("2023-06-05"), new Date("2023-06-10")]
    },
    {
      label: "顧客が抱えている課題",
      key: "customerIssue",
      type: "textarea",
      previousValue: "顧客企業では、従来の手作業による在庫管理システムが非効率であり、人的ミスも多発しています。これにより、在庫の過不足が頻繁に発生し、業務効率の低下と顧客満足度の悪化を招いています。早急な改善が求められています。",
      initialValue: "顧客企業では、数の部門間でのコミュニケーションが円滑に行われておらず、情報の共有が不十分です。これにより、業務の重複や遅延が発生し、全体的な生産性の低下を招いています。効果的な情報共有システムの導入が急務となっています。",
      aiSuggestions: [
        "顧客企業では、部門間の連携不足により情報の一元管理ができておらず、業務効率が低下しています。統合的な情報共有プラットフォームの導入が必要です。",
        "部門間のコミュニケーション不足により、プロジェクトの進行が遅延しています。改善策として、定期的なミーティングと情報共有ツールの導入が考えられます。",
        "情報共有の不備が原因で、業務の重複やミスが発生しています。クラウドベースのコラボレーションツールを導入し、リアルタイムでの情報共有を促進する必要があります。"
      ]
    },
    {
      label: "承認プロセス",
      key: "approvalProcess",
      type: "text",
      previousValue: "部長→本部長→社長",
      initialValue: "部長→本部長→社長",
      aiSuggestions: ["課長→部長→本部長→社長", "部長→本部長→取締役会"]
    },
    {
      label: "競合他社・代替手段",
      key: "competitors",
      type: "text",
      previousValue: "A社、B社、自社開発",
      initialValue: "C社、D社",
      aiSuggestions: [
        "C社、D社が競合として参入",
        "新たな競合としてE社が出現",
        "競合他社としてF社が市場に登場"
      ]
    }
  ],
  otherFields: [
    {
      label: "営業組織の構造",
      key: "salesStructure",
      type: "text",
      previousValue: "営業部→営業1課、営業2課、営業3課",
      initialValue: "営業部→営業1課、営業2課、営業3課",
      aiSuggestions: [
        "営業部→営業1課、営業2課、営業4課",
        "営業部→営業1課、営業3課、営業4課",
        "営業部→営業1課、営業2課、営業5課"
      ]
    },
    {
      label: "営業人数",
      key: "salesPeople",
      type: "number",
      previousValue: "60",
      initialValue: "60",
      aiSuggestions: ["55", "65", "70"]
    },
    {
      label: "オンライン/オフライン商談比",
      key: "onlineOfflineRatio",
      type: "text",
      previousValue: "40:60",
      initialValue: "40:60",
      aiSuggestions: ["45:55", "35:65", "50:50"]
    },
    {
      label: "商談前の準備時間(分)",
      key: "prepTime",
      type: "number",
      previousValue: "45",
      initialValue: "45",
      aiSuggestions: ["30", "60", "90"]
    },
    {
      label: "商談後の作業時間(分)",
      key: "postMeetingTime",
      type: "number",
      previousValue: "30",
      initialValue: "30",
      aiSuggestions: ["20", "40", "50"]
    },
    {
      label: "使っているSFA/CRM",
      key: "sfaCrm",
      type: "text",
      previousValue: "HubSpot",
      initialValue: "HubSpot",
      aiSuggestions: ["Salesforce", "Zoho CRM", "Microsoft Dynamics"]
    },
    {
      label: "使っているDWH",
      key: "dwh",
      type: "text",
      previousValue: "BigQuery",
      initialValue: "BigQuery",
      aiSuggestions: ["Redshift", "Snowflake", "Snowplow"]
    },
    {
      label: "使っているMA",
      key: "ma",
      type: "text",
      previousValue: "Pardot",
      initialValue: "Pardot",
      aiSuggestions: ["Marketo", "HubSpot MA", "Mailchimp"]
    },
    {
      label: "その他使っているツール",
      key: "otherTools",
      type: "text",
      previousValue: "Microsoft Teams, Google Meet",
      initialValue: "Microsoft Teams, Zoom",
      aiSuggestions: [
        "Slack, Google Meet",
        "Microsoft Teams, Zoom, Asana",
        "Slack, Zoom, Trello"
      ]
    },
    {
      label: "一人当たりの月商談数",
      key: "monthlyMeetings",
      type: "number",
      previousValue: "25",
      initialValue: "25",
      aiSuggestions: ["20", "30", "35"]
    },
    {
      label: "商材単価（年間）",
      key: "annualProductPrice",
      type: "number",
      previousValue: "6000000",
      initialValue: "6000000",
      aiSuggestions: ["6500000", "5500000", "7000000"]
    },
    {
      label: "顧客ターゲット業界",
      key: "targetIndustries",
      type: "text",
      previousValue: "製造業、小売業、サービス業",
      initialValue: "製造業、小売業、IT業界",
      aiSuggestions: [
        "製造業、小売業、金融業",
        "IT業界、サービス業、ヘルスケア",
        "製造業、IT業界、エネルギー"
      ]
    }
  ]
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

export default function Component() {
  const router = useRouter()

  // フォームデータをメモ化
  const formData = useMemo(() => initialFormData, [])

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
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})
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

    setIsLoading(prev => ({ ...prev, [fieldKey]: true }))
    try {
      // 実際のAPIコールはここに追加
      await new Promise(resolve => setTimeout(resolve, 1000)) // デモ用の遅延

      // ダミーデータをAI推奨値として設定
      setAiSuggestions(prev => ({
        ...prev,
        [fieldKey]: field.aiSuggestions || []
      }))
    } catch (error) {
      console.error('AI推奨値の取得に失敗しました:', error)
    } finally {
      setIsLoading(prev => ({ ...prev, [fieldKey]: false }))
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
              type="number"
              value={String(currentValue)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setValues(prev => ({ ...prev, [field.key]: e.target.value }))
                handleUserModification(field.key)
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
            {field.type === 'date' ? formatDate(new Date(previousValue as Date)) : previousValue as string}
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
          {isLoading[field.key] ? (
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
  }, [values, userModifiedFields, typingFields, typedTexts, showBorders, isChanged, handleUserModification, resetValue, getAiSuggestions, formatDate, isLoading, aiSuggestions, showOnlyChanged])

  useEffect(() => {
    // 初期値の設定
    const initialValues: Record<string, string | number | Date> = {}
    formData.mainFields.forEach(field => {
      initialValues[field.key] = field.previousValue
    })
    formData.otherFields.forEach(field => {
      initialValues[field.key] = field.previousValue
    })
    setValues(initialValues)

    // 変更のある項目のみ遅延して設定
    const timer = setTimeout(() => {
      const updatedValues: Record<string, string | number | Date> = {}
      const updatedTypingFields: Record<string, boolean> = {}
      const updatedTypedTexts: Record<string, string> = {}

      formData.mainFields.forEach(field => {
        if (isChanged(field.key, field.initialValue, field.previousValue)) {
          if (typeof field.initialValue === 'string') {
            updatedTypingFields[field.key] = true
            updatedTypedTexts[field.key] = ''
            typewriterEffect(field.key, field.initialValue as string)
          }
          updatedValues[field.key] = field.initialValue
        }
      })

      formData.otherFields.forEach(field => {
        if (isChanged(field.key, field.initialValue, field.previousValue)) {
          if (typeof field.initialValue === 'string') {
            updatedTypingFields[field.key] = true
            updatedTypedTexts[field.key] = ''
            typewriterEffect(field.key, field.initialValue as string)
          }
          updatedValues[field.key] = field.initialValue
        }
      })

      // バッチ更新
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

  const handleSave = useCallback(() => {
    // ここで保存処理を行う（省略）
    router.push('/thankyou-mail')
  }, [router])

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="py-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">{formData.title}</CardTitle>
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

          {/* コンテンツ（高さ制限を削除） */}
          <div>
            <div className="divide-y divide-gray-100">
              {/* メインフィールド */}
              {formData.mainFields.map(field => renderField(field))}
            </div>

            {/* その他の項目 */}
            <Collapsible open={isOtherFieldsOpen} onOpenChange={setIsOtherFieldsOpen} className="mt-4">
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="flex items-center justify-between w-full h-8 text-sm">
                  その他の項目
                  <ChevronDownIcon className={cn("h-4 w-4 transition-transform", isOtherFieldsOpen && "rotate-180")} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="divide-y divide-gray-100">
                  {formData.otherFields.map(field => renderField(field))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          <div className="py-6">
            <Button className="w-full" onClick={handleSave}>保存</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
