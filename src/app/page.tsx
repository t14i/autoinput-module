'use client'

import React, { useState, useCallback, useEffect, useMemo } from 'react'
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

export default function Component() {
  const router = useRouter()
  
  const previousValues = useMemo(() => ({
    orderProbability: 'B',
    orderAmount: '1000000',
    budgetPrepDate: new Date('2023-05-01'),
    budgetRequestDate: new Date('2023-05-15'),
    budgetConfirmDate: new Date('2023-05-30'),
    customerIssue: '顧客企業では、従来の手作業による在庫管理システムが非効率であり、人的ミスも多発しています。これにより、在庫の過不足が頻繁に発生し、業務効率の低下と顧客満足度の悪化を招いています。早急な改善が求められています。',
    approvalProcess: '部長→本部長→社長',
    competitors: 'A社、B社、自社開発',
    salesStructure: '営業部→営業1課、営業2課、営業3課',
    salesPeople: '60',
    onlineOfflineRatio: '40:60',
    prepTime: '45',
    postMeetingTime: '30',
    sfaCrm: 'HubSpot',
    dwh: 'BigQuery',
    ma: 'Pardot',
    otherTools: 'Microsoft Teams, Google Meet',
    monthlyMeetings: '25',
    annualProductPrice: '6000000',
    targetIndustries: '製造業、小売業、サービス業'
  }), [])

  const initialValues = useMemo(() => ({
    orderProbability: 'A',
    orderAmount: '1200000',
    budgetPrepDate: new Date('2023-05-01'),
    budgetRequestDate: new Date('2023-05-20'),
    budgetConfirmDate: new Date('2023-05-30'),
    customerIssue: '顧客企業では、複数の部門間でのコミュニケーションが円滑に行われておらず、情報の共有が不十分です。これにより、業務の重複や遅延が発生し、全体的な生産性の低下を招いています。効果的な情報共有システムの導入が急務となっています。',
    approvalProcess: '部長→本部長→社長',
    competitors: 'C社、D社',
    salesStructure: '営業部→営業1課、営業2課、営業3課',
    salesPeople: '60',
    onlineOfflineRatio: '40:60',
    prepTime: '45',
    postMeetingTime: '30',
    sfaCrm: 'HubSpot',
    dwh: 'BigQuery',
    ma: 'Pardot',
    otherTools: 'Microsoft Teams, Google Meet',
    monthlyMeetings: '25',
    annualProductPrice: '6000000',
    targetIndustries: '製造業、小売業、サービス業'
  }), [])

  const [orderProbability, setOrderProbability] = useState('')
  const [orderAmount, setOrderAmount] = useState('')
  const [budgetPrepDate, setBudgetPrepDate] = useState<Date | undefined>(undefined)
  const [budgetRequestDate, setBudgetRequestDate] = useState<Date | undefined>(undefined)
  const [budgetConfirmDate, setBudgetConfirmDate] = useState<Date | undefined>(undefined)
  const [customerIssue, setCustomerIssue] = useState('')
  const [approvalProcess, setApprovalProcess] = useState('')
  const [competitors, setCompetitors] = useState('')

  const [showOnlyChanged, setShowOnlyChanged] = useState(false)
  const [userModifiedFields, setUserModifiedFields] = useState<Record<string, boolean>>({})

  const [typingFields, setTypingFields] = useState<Record<string, boolean>>({})
  const [typedTexts, setTypedTexts] = useState<Record<string, string>>({})

  const [showBorders, setShowBorders] = useState(false)

  const [aiSuggestions, setAiSuggestions] = useState<Record<string, string[]>>({})

  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})

  const [isOtherFieldsOpen, setIsOtherFieldsOpen] = useState(false)
  const [salesStructure, setSalesStructure] = useState('')
  const [salesPeople, setSalesPeople] = useState('')
  const [onlineOfflineRatio, setOnlineOfflineRatio] = useState('')
  const [prepTime, setPrepTime] = useState('')
  const [postMeetingTime, setPostMeetingTime] = useState('')
  const [sfaCrm, setSfaCrm] = useState('')
  const [dwh, setDwh] = useState('')
  const [ma, setMa] = useState('')
  const [otherTools, setOtherTools] = useState('')
  const [monthlyMeetings, setMonthlyMeetings] = useState('')
  const [annualProductPrice, setAnnualProductPrice] = useState('')
  const [targetIndustries, setTargetIndustries] = useState('')

  const isChanged = useCallback((key: string, currentValue: unknown, previousValue: unknown) => {
    if (currentValue instanceof Date && previousValue instanceof Date) {
      return currentValue.getTime() !== previousValue.getTime()
    }
    return currentValue !== previousValue
  }, [])

  useEffect(() => {
    // 前回と値が同じ項目を即座に設定
    Object.keys(initialValues).forEach((key) => {
      const initialValue = initialValues[key as keyof typeof initialValues]
      const previousValue = previousValues[key as keyof typeof previousValues]
      
      if (!isChanged(key, initialValue, previousValue)) {
        switch (key) {
          case 'orderProbability':
            setOrderProbability(previousValue as string)
            break
          case 'orderAmount':
            setOrderAmount(previousValue as string)
            break
          case 'budgetPrepDate':
            setBudgetPrepDate(previousValue as Date)
            break
          case 'budgetRequestDate':
            setBudgetRequestDate(previousValue as Date)
            break
          case 'budgetConfirmDate':
            setBudgetConfirmDate(previousValue as Date)
            break
          case 'customerIssue':
            setCustomerIssue(previousValue as string)
            break
          case 'approvalProcess':
            setApprovalProcess(previousValue as string)
            break
          case 'competitors':
            setCompetitors(previousValue as string)
            break
          case 'salesStructure':
            setSalesStructure(previousValue as string)
            break
          case 'salesPeople':
            setSalesPeople(previousValue as string)
            break
          case 'onlineOfflineRatio':
            setOnlineOfflineRatio(previousValue as string)
            break
          case 'prepTime':
            setPrepTime(previousValue as string)
            break
          case 'postMeetingTime':
            setPostMeetingTime(previousValue as string)
            break
          case 'sfaCrm':
            setSfaCrm(previousValue as string)
            break
          case 'dwh':
            setDwh(previousValue as string)
            break
          case 'ma':
            setMa(previousValue as string)
            break
          case 'otherTools':
            setOtherTools(previousValue as string)
            break
          case 'monthlyMeetings':
            setMonthlyMeetings(previousValue as string)
            break
          case 'annualProductPrice':
            setAnnualProductPrice(previousValue as string)
            break
          case 'targetIndustries':
            setTargetIndustries(previousValue as string)
            break
        }
      }
    })

    // 変更のある項目のみ遅延して設定
    const timer = setTimeout(() => {
      Object.keys(initialValues).forEach((key) => {
        const initialValue = initialValues[key as keyof typeof initialValues]
        const previousValue = previousValues[key as keyof typeof previousValues]
        
        if (isChanged(key, initialValue, previousValue)) {
          switch (key) {
            case 'orderProbability':
              setOrderProbability(initialValue as string)
              break
            case 'orderAmount':
              setOrderAmount(initialValue as string)
              break
            case 'budgetPrepDate':
              setBudgetPrepDate(initialValue as Date)
              break
            case 'budgetRequestDate':
              setBudgetRequestDate(initialValue as Date)
              break
            case 'budgetConfirmDate':
              setBudgetConfirmDate(initialValue as Date)
              break
            case 'customerIssue':
              setCustomerIssue(initialValue as string)
              break
            case 'approvalProcess':
              setApprovalProcess(initialValue as string)
              break
            case 'competitors':
              setCompetitors(initialValue as string)
              break
            case 'salesStructure':
              setSalesStructure(initialValue as string)
              break
            case 'salesPeople':
              setSalesPeople(initialValue as string)
              break
            case 'onlineOfflineRatio':
              setOnlineOfflineRatio(initialValue as string)
              break
            case 'prepTime':
              setPrepTime(initialValue as string)
              break
            case 'postMeetingTime':
              setPostMeetingTime(initialValue as string)
              break
            case 'sfaCrm':
              setSfaCrm(initialValue as string)
              break
            case 'dwh':
              setDwh(initialValue as string)
              break
            case 'ma':
              setMa(initialValue as string)
              break
            case 'otherTools':
              setOtherTools(initialValue as string)
              break
            case 'monthlyMeetings':
              setMonthlyMeetings(initialValue as string)
              break
            case 'annualProductPrice':
              setAnnualProductPrice(initialValue as string)
              break
            case 'targetIndustries':
              setTargetIndustries(initialValue as string)
              break
          }
          
          if (typeof initialValue === 'string') {
            setTypingFields(prev => ({ ...prev, [key]: true }))
            setTypedTexts(prev => ({ ...prev, [key]: '' }))
            typewriterEffect(key, initialValue)
          }
        }
      })
      
      // 0.5秒後に青枠を表示るフラグを設定
      setShowBorders(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [initialValues, previousValues, isChanged])

  const typewriterEffect = (field: string, fullText: string) => {
    let index = 0
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setTypedTexts(prev => ({ ...prev, [field]: fullText.slice(0, index + 1) }))
        index += 2  // 1文字ずつではなく2文字ずつ増やす
      } else {
        clearInterval(interval)
        setTypingFields(prev => ({ ...prev, [field]: false }))
      }
    }, 25)  // インターバルを50msから25msに短縮
  }

  const handleUserModification = (key: string) => {
    setUserModifiedFields(prev => ({ ...prev, [key]: true }))
  }

  const getAiSuggestions = (key: string) => {
    setIsLoading(prev => ({ ...prev, [key]: true }))
    
    setTimeout(() => {
      const suggestions = {
        orderProbability: ['A', 'B'],
        orderAmount: ['1200000', '1300000', '1100000'],
        budgetPrepDate: ['2023/05/01', '2024/05/10', '2024/05/15'],
        budgetRequestDate: ['2023/05/20', '2024/05/30', '2024/06/05'],
        budgetConfirmDate: ['2023/05/30', '2024/06/15', '2024/06/20'],
        customerIssue: [
          '顧客企業では、複数の部門間でのコミュニケーションが円滑に行われておらず、情報の共有が不十分です。これにより、業務の重複や遅延が発生し、全体的な生産性の低下を招いています。効果的な情報共有システムの導入が急務となっています。',
          '顧客企業では、従来顧客管理システム老朽化しており、顧客データの正確な把握や分析が困難になっています。これにより、効果的なマーケティング戦略の立案や顧客ニーズへの迅速な対応が阻害されており、競争力の低下につながっています。',
          '顧客企業では、急速なデジタル化に伴い、従業員のITスキルの不足が顕在化しています。これにより、新しいツールやシステムの導入が進まず、業務効率の改善が滞っています。従業員の能力開発と、使いやすいITソリューションの導入が課題となっています。'
        ],
        approvalProcess: ['部長→本部長→社長', '課長部長→社長', '部長→社長'],
        competitors: ['C社、D社', 'H社、I社', 'J社、K社、L社'],
        salesStructure: ['営業部→営業1課、営業2課、営業3課', '営業部→営業1課営業2課、営業3課、営業4課', '営業部→東日本営業部、西日本営業部'],
        salesPeople: ['60', '70', '55'],
        onlineOfflineRatio: ['40:60', '50:50', '35:65'],
        prepTime: ['45', '50', '40'],
        postMeetingTime: ['30', '35', '40'],
        sfaCrm: ['HubSpot', 'Microsoft Dynamics 365', 'Oracle CX Sales'],
        dwh: ['BigQuery', 'Amazon Redshift', 'Azure Synapse Analytics'],
        ma: ['Pardot', 'Adobe Marketing Cloud', 'Oracle Eloqua'],
        otherTools: ['Microsoft Teams, Google Meet', 'Asana, Trello', 'Jira, Confluence'],
        monthlyMeetings: ['25', '30', '22'],
        annualProductPrice: ['6000000', '5500000', '6500000'],
        targetIndustries: ['製造業、小売業、サービス業', '製造業、小売業、サービス業、IT業', '製造業、小売業、金融業']
      }
      setAiSuggestions(prev => ({ ...prev, [key]: suggestions[key as keyof typeof suggestions] || [] }))
      setIsLoading(prev => ({ ...prev, [key]: false }))
    }, 500)
  }

  const formatDate = (date: Date | undefined): string => {
    return date ? format(date, "yyyy/MM/dd") : ''
  }

  const renderField = (key: string, label: string, content: React.ReactNode, previousValue: unknown) => {
    const currentValue = {
      orderProbability,
      orderAmount,
      budgetPrepDate,
      budgetRequestDate,
      budgetConfirmDate,
      customerIssue,
      approvalProcess,
      competitors,
      salesStructure,
      salesPeople,
      onlineOfflineRatio,
      prepTime,
      postMeetingTime,
      sfaCrm,
      dwh,
      ma,
      otherTools,
      monthlyMeetings,
      annualProductPrice,
      targetIndustries
    }[key as keyof typeof previousValues]

    const isFieldChanged = isChanged(key, currentValue, previousValue)
    const isUserModified = userModifiedFields[key]
    const shouldShowBorder = showBorders && isFieldChanged && !isUserModified

    if (showOnlyChanged && !isFieldChanged && !isUserModified) {
      return null
    }

    const resetValue = () => {
      switch (key) {
        case 'orderProbability':
          setOrderProbability(previousValues.orderProbability)
          break
        case 'orderAmount':
          setOrderAmount(previousValues.orderAmount)
          break
        case 'budgetPrepDate':
          setBudgetPrepDate(previousValues.budgetPrepDate)
          break
        case 'budgetRequestDate':
          setBudgetRequestDate(previousValues.budgetRequestDate)
          break
        case 'budgetConfirmDate':
          setBudgetConfirmDate(previousValues.budgetConfirmDate)
          break
        case 'customerIssue':
          setCustomerIssue(previousValues.customerIssue)
          break
        case 'approvalProcess':
          setApprovalProcess(previousValues.approvalProcess)
          break
        case 'competitors':
          setCompetitors(previousValues.competitors)
          break
      }
      setUserModifiedFields(prev => ({ ...prev, [key]: false }))
    }

    const isTyping = typingFields[key]
    const typedText = typedTexts[key]

    return (
      <div className={cn(
        "flex min-h-[3rem] border-b border-gray-100 hover:bg-gray-50",
        key === 'customerIssue' ? "items-start py-3" : "items-center py-2"
      )}>
        {/* ラベル */}
        <div className="w-[18%] flex items-center min-h-full">
          <Label 
            htmlFor={key} 
            className="text-sm font-medium text-gray-600 leading-normal px-4 py-0.5"
          >
            {label}
          </Label>
        </div>
        
        {/* 元の値 */}
        <div className="w-[24%] flex items-center min-h-full">
          <span className="text-sm text-muted-foreground leading-normal px-4 py-0.5">
            {key.includes('Date') ? formatDate(previousValue as Date) : previousValue as string}
          </span>
        </div>

        {/* 矢印 */}
        <div className="w-[4%] flex items-center justify-center min-h-full">
          <span className="text-gray-400">→</span>
        </div>

        {/* 入力欄 */}
        <div className={cn(
          "w-[44%] flex flex-col",
          key === 'customerIssue' ? "pt-0.5" : "justify-center"
        )}>
          <div className={cn(
            "relative w-full",
            shouldShowBorder && "before:absolute before:-inset-1 before:border-2 before:border-blue-500 before:rounded-md"
          )}>
            {React.cloneElement(content as React.ReactElement, {
              onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | Date) => {
                if (e instanceof Date) {
                  (content as React.ReactElement).props.onSelect(e)
                  handleUserModification(key)
                } else {
                  (content as React.ReactElement).props.onChange(e)
                  handleUserModification(key)
                }
              },
              value: isTyping ? typedText : (content as React.ReactElement).props.value,
              className: cn(
                (content as React.ReactElement).props.className,
                "text-sm w-full",
                key === 'customerIssue' ? "min-h-[160px]" : "h-9"
              )
            })}
          </div>
          
          {isLoading[key] ? (
            <div className="mt-3 flex items-center space-x-2">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span className="text-xs text-muted-foreground">推定中...</span>
            </div>
          ) : aiSuggestions[key] && (
            <div className="mt-3 space-y-2">
              <div className="text-xs text-muted-foreground">AI推定値:</div>
              <div className="flex flex-wrap gap-2">
                {aiSuggestions[key].map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className={cn(
                      "text-xs cursor-pointer py-1 px-3",
                      index === 0 && "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200",
                      index === 1 && "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200",
                      index === 2 && "bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                    )}
                    onClick={() => {
                      switch (key) {
                        case 'orderProbability':
                          setOrderProbability(suggestion)
                          break
                        case 'orderAmount':
                          setOrderAmount(suggestion)
                          break
                        case 'budgetPrepDate':
                        case 'budgetRequestDate':
                        case 'budgetConfirmDate':
                          const date = new Date(suggestion)
                          if (key === 'budgetPrepDate') setBudgetPrepDate(date)
                          if (key === 'budgetRequestDate') setBudgetRequestDate(date)
                          if (key === 'budgetConfirmDate') setBudgetConfirmDate(date)
                          break
                        case 'customerIssue':
                          setCustomerIssue(suggestion)
                          break
                        case 'approvalProcess':
                          setApprovalProcess(suggestion)
                          break
                        case 'competitors':
                          setCompetitors(suggestion)
                          break
                      }
                      setUserModifiedFields(prev => ({ ...prev, [key]: true }))
                    }}
                  >
                    {key.includes('Date') ? formatDate(new Date(suggestion)) : suggestion}
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
                  onClick={resetValue}
                  className="h-8 w-8 px-0"
                >
                  <RotateCcwIcon className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>元に戻す</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => getAiSuggestions(key)}
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
  }

  const handleSave = () => {
    // ここで保存処理を行う（省略）
    router.push('/thankyou-mail')
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="py-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">株式会社XXX様商談（2024/10/1）</CardTitle>
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
          {/* 固定ヘッダー */}
          <div className="sticky top-0 z-10 flex items-center py-2 border-y border-gray-200 bg-gray-50 text-sm font-medium text-gray-500">
            <div className="w-[18%] px-4">項目</div>
            <div className="w-[24%] px-4">元の値</div>
            <div className="w-[48%] pl-6">更新する値</div>
            <div className="w-[10%]"></div>
          </div>

          {/* スクロール可能なコンテンツ */}
          <div className="max-h-[calc(100vh-16rem)] overflow-y-auto">
            <div className="divide-y divide-gray-100">
              {renderField('orderProbability', '受注確度', (
                <Select value={orderProbability} onValueChange={setOrderProbability}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="S">S</SelectItem>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                  </SelectContent>
                </Select>
              ), previousValues.orderProbability)}

              {renderField('orderAmount', '受注金額', (
                <Input
                  id="orderAmount"
                  type="number"
                  value={orderAmount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrderAmount(e.target.value)}
                  className="w-full"
                />
              ), previousValues.orderAmount)}

              {renderField('budgetPrepDate', '予算申請準備開始日', (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !budgetPrepDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {budgetPrepDate ? formatDate(budgetPrepDate) : <span>日付を選択</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={budgetPrepDate}
                      onSelect={setBudgetPrepDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              ), previousValues.budgetPrepDate)}

              {renderField('budgetRequestDate', '予算申請日', (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !budgetRequestDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {budgetRequestDate ? formatDate(budgetRequestDate) : <span>付を選択</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={budgetRequestDate}
                      onSelect={setBudgetRequestDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              ), previousValues.budgetRequestDate)}

              {renderField('budgetConfirmDate', '予算確定日', (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !budgetConfirmDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {budgetConfirmDate ? formatDate(budgetConfirmDate) : <span>日付を選択</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={budgetConfirmDate}
                      onSelect={setBudgetConfirmDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              ), previousValues.budgetConfirmDate)}

              {renderField('customerIssue', '顧客が抱えている課題', (
                <Textarea
                  id="customerIssue"
                  value={customerIssue}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCustomerIssue(e.target.value)}
                  className="min-h-[160px]"
                />
              ), previousValues.customerIssue)}

              {renderField('approvalProcess', '承認プロセス', (
                <Input
                  id="approvalProcess"
                  value={approvalProcess}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApprovalProcess(e.target.value)}
                  className="w-full"
                />
              ), previousValues.approvalProcess)}

              {renderField('competitors', '競合他社・代替手段', (
                <Input
                  id="competitors"
                  value={competitors}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompetitors(e.target.value)}
                  className="w-full"
                />
              ), previousValues.competitors)}
            </div>

            <Collapsible open={isOtherFieldsOpen} onOpenChange={setIsOtherFieldsOpen} className="mt-4">
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="flex items-center justify-between w-full h-8 text-sm">
                  その他の項目
                  <ChevronDownIcon className={cn("h-4 w-4 transition-transform", isOtherFieldsOpen && "rotate-180")} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="divide-y divide-gray-100">
                  {renderField('salesStructure', '営業組織の構造', (
                    <Input
                      id="salesStructure"
                      value={salesStructure}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSalesStructure(e.target.value)}
                      className="w-full"
                    />
                  ), previousValues.salesStructure)}

                  {renderField('salesPeople', '営業人数', (
                    <Input
                      id="salesPeople"
                      type="number"
                      value={salesPeople}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSalesPeople(e.target.value)}
                      className="w-full"
                    />
                  ), previousValues.salesPeople)}

                  {renderField('onlineOfflineRatio', 'オンライン/オフライン商談比率', (
                    <Input
                      id="onlineOfflineRatio"
                      value={onlineOfflineRatio}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOnlineOfflineRatio(e.target.value)}
                      className="w-full"
                    />
                  ), previousValues.onlineOfflineRatio)}

                  {renderField('prepTime', '商談前の準備時間(分)', (
                    <Input
                      id="prepTime"
                      type="number"
                      value={prepTime}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrepTime(e.target.value)}
                      className="w-full"
                    />
                  ), previousValues.prepTime)}

                  {renderField('postMeetingTime', '商談後の作業時間(分)', (
                    <Input
                      id="postMeetingTime"
                      type="number"
                      value={postMeetingTime}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPostMeetingTime(e.target.value)}
                      className="w-full"
                    />
                  ), previousValues.postMeetingTime)}

                  {renderField('sfaCrm', '使っているSFA/CRM', (
                    <Input
                      id="sfaCrm"
                      value={sfaCrm}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSfaCrm(e.target.value)}
                      className="w-full"
                    />
                  ), previousValues.sfaCrm)}

                  {renderField('dwh', '使っているDWH', (
                    <Input
                      id="dwh"
                      value={dwh}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDwh(e.target.value)}
                      className="w-full"
                    />
                  ), previousValues.dwh)}

                  {renderField('ma', '使っているMA', (
                    <Input
                      id="ma"
                      value={ma}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMa(e.target.value)}
                      className="w-full"
                    />
                  ), previousValues.ma)}

                  {renderField('otherTools', 'その他使っているツール', (
                    <Input
                      id="otherTools"
                      value={otherTools}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtherTools(e.target.value)}
                      className="w-full"
                    />
                  ), previousValues.otherTools)}

                  {renderField('monthlyMeetings', '一人当たりの月商談数', (
                    <Input
                      id="monthlyMeetings"
                      type="number"
                      value={monthlyMeetings}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMonthlyMeetings(e.target.value)}
                      className="w-full"
                    />
                  ), previousValues.monthlyMeetings)}

                  {renderField('annualProductPrice', '商材単価（年間）', (
                    <Input
                      id="annualProductPrice"
                      type="number"
                      value={annualProductPrice}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnnualProductPrice(e.target.value)}
                      className="w-full"
                    />
                  ), previousValues.annualProductPrice)}

                  {renderField('targetIndustries', '顧客ターゲット業界', (
                    <Input
                      id="targetIndustries"
                      value={targetIndustries}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTargetIndustries(e.target.value)}
                      className="w-full"
                    />
                  ), previousValues.targetIndustries)}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="py-6">
              <Button className="w-full" onClick={handleSave}>保存</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
