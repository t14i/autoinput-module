'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CopyIcon, CheckIcon } from "lucide-react"

export default function ThankYouMail() {
  const router = useRouter()
  const [to, setTo] = useState('aaa@example.com')
  const [cc, setCc] = useState('bbb@example.com, ccc@example.com')
  const [subject, setSubject] = useState('【データブル / 高岡】資料の送付・次回ご面談の案内')
  const [body, setBody] = useState('')
  const [minutes, setMinutes] = useState('')
  const [showCheckmark, setShowCheckmark] = useState(false)

  const bodyRef = useRef<HTMLTextAreaElement>(null)
  const minutesRef = useRef<HTMLTextAreaElement>(null)

  const fullBody = `株式会社XXX
YY様

お世話になっております。
株式会社データブルの高岡です。

本日はお忙しい中ご面談の時間をいただき、誠にありがとうございました。
説明に使用した資料を添付しましたので、お目通しいただけますと幸いです。

ご面談中に確認させていただいた次回日程をご案内させていただきます。

【次回お打ち合わせ】
日時：10月15日13時〜
Web会議リンク：https://us06web.zoom.us/j/xxxxxxxxxxx
パスコード：123456
※相違ございましたらご指摘ください

【お打ち合わせ内容（予定）】
・具体的な検証スケジュールのご提案、ディスカッション

また、今回MTGの議事録をご案内させていただきます。

以上、引き続き、よろしくお願いいたします。`

  const fullMinutes = `【議事録】
1. 会議概要
•   日時：2024年10月4日
•   場所：オンライン（Zoomミーティング）
•   参加者：
   •   XXX：YY氏
   •   データブル：高岡氏、鈴木氏、高松氏
•   人数：5名
•   目的：データブルのサービス紹介と導入検討

2. 要約
データブル社が提供する営業プロセス自動化ソリューションについて、デモンストレーションと説明が行われた。このソリューションは、商談の録音データから自動的に議事録を作成し、CRMシステムにデータを入力する機能を持つ。XXX社は、現在のCRM運用における課題（データ入力の負担、分析のしづらさ）を解決する可能性があるとして、高い関心を示した。次回のミーティングで具体的な検証プロセスについて議論することが決定した。

3. 議題一覧
1.  データブル社の会社紹介
2.  サービスのデモンストレーション
3.  XXX社の現状と課題
4.  検証プロセスの検討
5.  今後の進め方

4. 各議題の詳細

4.1 データブル社の会社紹介
データブル社は2020年設立のスタートアップ企業で、iPaaSと呼ばれるクラウドサービス間のデータ連携プラットフォームを提供している。最近は生成AIを組み合わせたソリューションも開発している。

高岡氏（1分54秒）: "弊社なんですが2020年設立のですねスタートアップとなっております。提供しているサービスとしてはもともとはですねiPaasというふうに呼ばれるクラウドサービスとクラウドサービス同士のデータ連携つなぎ先が基幹システムとかでも調整はできたりするんですが、このデータ連携のプラットフォームでデータブルというサービスを開発提供させていただいている会社でございました。"

•   データブル社は比較的新しい企業だが、強力なエンジニアリングチームを持つ
•   代表の高松氏は楽天のビッグデータエンジニア出身で、不動産向けSaaS企業のCTOを経験している
•   高岡氏は前職でクラウド会計ソフトのAPI連携を担当しており、顧客のニーズに応えるためにデータブルに参画した

4.2 サービスのデモンストレーション
データブル社のサービスは、商談のスケジュール調整から議事録作成、CRMデータ更新までを自動化する。

高岡氏（16分19秒）: "議事録というふうになっているのはこれはまあこれも一つの例にはなるんですがnotionで議事録を用意している例になるんですけどもnotion内にある議事録のテンプレートから今回の商談用のテンプレートっていうのを自動で作成を行った上でリンク付けしているような形になってます。"

•   カレンダーツールとCRMの自動連携
•   商談の録音データから自動で議事録を作成
•   生成AIを使用して議事録の要約と重要ポイントの抽出
•   CRMへのデータ自動入力（人間によるチェック機能あり）

4.3 XXX社の現状と課題
XXX社は現在、セールスフォースを使用しているが、データ入力の負担や分析のしづらさに課題を感じている。

YY氏（24分12秒）: "今ですねそのセールスフォースにしろどっちでもいいんですけどSFAに入れていく商談した情報っていうのをなるべく各項目ごとに選択肢とかですねにして残させようっていうふうにちょっと今変えようとしてるんですね。"

•   CRMへのデータ入力に多くの時間を費やしている
•   フリーフォーマットのデータが多く、分析が困難
•   選択式の項目を増やし、データの標準化を図りたい
•   営業担当者の入力負担を軽減したい

4.4 検証プロセスの検討
データブル社のサービス導入に向けて、検証プロセスについて議論された。

高岡氏（36分49秒）: "そうですね、もしよろしければ検証みたいな形で進めさせていただくのが良いのかなっていうふうには思っておりまして、御社として一番検証されたいところ、データの更新のところなのかなと、あとは議事録のところなのかなっていうふうに思っているんですが、例えば今やってらっしゃるそこの商談の録画録音データっていうのが共有をいただけるのであれば、それで実際やってみた時の結果みたいなものをまず一時でお渡しをさせていただいて。"

•   実際の商談データを用いた検証を行う
•   議事録作成とCRMデータ更新の精度を確認する
•   検証結果を基に、カスタマイズの必要性を検討する

4.5 今後の進め方
次回のミーティングで具体的な検証プロセスについて詳細を詰めることが決定した。
•   データブル社が検証プロセスの詳細案を作成し、提案する
•   XXX社は必要なデータや資料を準備する
•   検証結果を基に、導入の可否を判断する

5. タスク
•   データブル社：検証プロセスの詳細案を作成し、次回ミーティングで提案する（担当：高岡氏、期限：10月15日）
•   XXX社：検証に必要な商談データを準備する（担当：古谷氏、期限：10月15日）

6. 総括
本ミーティングでは、データブル社のサービスがXXX社の現在のCRM運用における課題を解決する可能性が高いことが確認された。特に、データ入力の自動化と分析しやすいデータ形式の実現に期待が寄せられた。次回のミーティングでは、具体的な検証プロセスを決定し、実際���データを用いた検証を開始する予定である。また、ヒューマンリソシア社との代理店契約の可について今後検討していくことが確認された。

7. 次回会議情報（日程、主要議題）
•   日時：2023年10月15日 13:00-
•   主要議題：検証プロセスの詳細決定、必要なデータや資料の確認`

  useEffect(() => {
    let bodyIndex = 0
    let minutesIndex = 0
    const bodyInterval = setInterval(() => {
      if (bodyIndex < fullBody.length) {
        setBody(fullBody.slice(0, bodyIndex + 1))
        bodyIndex++
      } else {
        clearInterval(bodyInterval)
      }
    }, 6)

    const minutesInterval = setInterval(() => {
      if (minutesIndex < fullMinutes.length) {
        setMinutes(fullMinutes.slice(0, minutesIndex + 1))
        minutesIndex++
      } else {
        clearInterval(minutesInterval)
      }
    }, 3)

    return () => {
      clearInterval(bodyInterval)
      clearInterval(minutesInterval)
    }
  }, [fullBody, fullMinutes])

  useEffect(() => {
    const adjustHeight = (ref: React.RefObject<HTMLTextAreaElement>) => {
      if (ref.current) {
        ref.current.style.height = 'auto'
        ref.current.style.height = `${ref.current.scrollHeight}px`
      }
    }

    adjustHeight(bodyRef)
    adjustHeight(minutesRef)
  }, [body, minutes])

  const handleAction = (action: 'send' | 'complete') => {
    console.log(action === 'send' ? 'メール送信:' : '完了にする:', { to, cc, subject, body, minutes })
    setShowCheckmark(true)
    setTimeout(() => {
      setShowCheckmark(false)
      router.push('/')
    }, 1500)
  }

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
    <div className="relative space-y-2">
      <Label htmlFor={label}>{label}</Label>
      <div className="relative">
        {isTextarea ? (
          <div className="relative">
            <textarea
              ref={ref}
              id={label}
              value={value}
              onChange={(e) => {
                onChange(e.target.value)
                if (ref && ref.current) {
                  ref.current.style.height = 'auto'
                  ref.current.style.height = `${ref.current.scrollHeight}px`
                }
              }}
              className="w-full min-h-[200px] p-2 pr-10 border rounded-md resize-none overflow-hidden"
              style={{ height: 'auto' }}
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
          <Input
            id={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pr-10"
          />
        )}
        {!isTextarea && !isEmail && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => copyToClipboard(value)}
          >
            <CopyIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <>
      <Card className="w-full max-w-7xl mx-auto mt-8">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl font-bold">株式会社XXX様商談（2024/10/1）</CardTitle>
          <div className="space-x-2">
            <Button onClick={() => handleAction('send')}>送信</Button>
            <Button variant="outline" onClick={() => handleAction('complete')}>完了にする</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-8">
            <div className="flex-1 space-y-4">
              {renderField("宛先", to, setTo, false, true)}
              {renderField("CC", cc, setCc, false, true)}
              {renderField("件名", subject, setSubject)}
              {renderField("本文", body, setBody, true, false, bodyRef)}
            </div>
            <div className="flex-1 space-y-4">
              {renderField("議事録", minutes, setMinutes, true, false, minutesRef)}
            </div>
          </div>
        </CardContent>
      </Card>
      {showCheckmark && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-full p-6 animate-bounce">
            <CheckIcon className="w-24 h-24 text-green-500" />
          </div>
        </div>
      )}
    </>
  )
}