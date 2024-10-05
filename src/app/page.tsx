'use client'

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { CalendarIcon, RotateCcwIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Component() {
  const router = useRouter()
  
  const previousValues = useMemo(() => ({
    orderProbability: 'B',
    orderAmount: '1000000',
    budgetPrepDate: new Date('2023-05-01'),
    budgetRequestDate: new Date('2023-05-15'),
    budgetConfirmDate: new Date('2023-05-30'),
    customerIssue: '顧客の生産性向上が必要',
    approvalProcess: '部長→本部長→社長',
    competitors: 'A社、B社、自社開発'
  }), [])

  const initialValues = useMemo(() => ({
    orderProbability: 'A',
    orderAmount: '1200000',
    budgetPrepDate: new Date('2023-05-01'),
    budgetRequestDate: new Date('2023-05-20'),
    budgetConfirmDate: new Date('2023-05-30'),
    customerIssue: '顧客の業務効率化が必要',
    approvalProcess: '部長→本部長→社長',
    competitors: 'C社、D社'
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
        index++
      } else {
        clearInterval(interval)
        setTypingFields(prev => ({ ...prev, [field]: false }))
      }
    }, 50)
  }

  const handleUserModification = (key: string) => {
    setUserModifiedFields(prev => ({ ...prev, [key]: true }))
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
      competitors
    }[key as keyof typeof previousValues]

    const isFieldChanged = isChanged(key, currentValue, previousValue)
    const isUserModified = userModifiedFields[key]

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

    const formatPreviousValue = (value: unknown): React.ReactNode => {
      if (value instanceof Date) {
        return format(value, "PPP")
      }
      if (typeof value === 'string' || typeof value === 'number') {
        return value.toString()
      }
      return JSON.stringify(value)
    }

    return (
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <Label htmlFor={key} className="text-sm font-medium">{label}</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={resetValue} className="flex items-center">
                  <RotateCcwIcon className="h-4 w-4 mr-1" />
                  <span className="text-xs">前回の値に戻す</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>元に戻す</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className={`p-2 rounded ${showBorders && isFieldChanged && !isUserModified ? 'border-2 border-blue-500' : 'border-2 border-transparent'}`}>
          {React.cloneElement(content as React.ReactElement, {
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string) => {
              if (typeof e === 'string') {
                // Select コンポーネントの場合
                (content as React.ReactElement).props.onValueChange(e)
                handleUserModification(key)
              } else {
                // Input や Textarea コンポーネントの場合
                (content as React.ReactElement).props.onChange(e)
                handleUserModification(key)
              }
            },
            onValueChange: (value: string) => {
              // Select コンポーネントの場合
              (content as React.ReactElement).props.onValueChange(value)
              handleUserModification(key)
            },
            value: isTyping ? typedText : (content as React.ReactElement).props.value,
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          前回の値: {formatPreviousValue(previousValue)}
        </p>
      </div>
    )
  }

  const handleSave = () => {
    // ここで保存処理を行う（省略）
    router.push('/thankyou-mail')
  }

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold">株式会社XXX様商談（2024/10/1）</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-6">
          <Switch
            id="show-changed"
            checked={showOnlyChanged}
            onCheckedChange={setShowOnlyChanged}
          />
          <Label htmlFor="show-changed" className="text-sm">
            変更された項目のみ表示
          </Label>
        </div>

        <div className="grid grid-cols-2 gap-x-8">
          <div>
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
                    {budgetPrepDate ? format(budgetPrepDate, "PPP") : <span>日付を選択</span>}
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
                    {budgetRequestDate ? format(budgetRequestDate, "PPP") : <span>日付を選択</span>}
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
          </div>

          <div>
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
                    {budgetConfirmDate ? format(budgetConfirmDate, "PPP") : <span>日付を選択</span>}
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
                className="min-h-[100px]"
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
        </div>

        <Button className="w-full mt-6" onClick={handleSave}>保存</Button>
      </CardContent>
    </Card>
  )
}