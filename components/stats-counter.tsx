"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Vote, CheckCircle } from "lucide-react"

interface StatsCounterProps {
  icon: React.ReactNode
  title: string
  value: number
  subtitle?: string
  duration?: number
}

function StatCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    const totalMilSecDur = duration
    const incrementTime = (totalMilSecDur / end) * 1000

    const timer = setInterval(() => {
      start += 1
      setCount(start)
      if (start >= end) clearInterval(timer)
    }, incrementTime)

    return () => {
      clearInterval(timer)
    }
  }, [value, duration])

  return <>{count.toLocaleString()}</>
}

export function StatCard({ icon, title, value, subtitle, duration }: StatsCounterProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          <StatCounter value={value} duration={duration} />
        </div>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}

export function StatsSection() {
  return (
    <section className="w-full py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">BlockVote in Numbers</h2>
            <p className="text-muted-foreground md:text-xl">Trusted by organizations and voters worldwide</p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Vote className="h-4 w-4 text-muted-foreground" />}
            title="Elections Conducted"
            value={1458}
            subtitle="Across 27 countries"
          />
          <StatCard
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            title="Registered Voters"
            value={3842567}
            subtitle="And growing every day"
          />
          <StatCard
            icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
            title="Votes Cast"
            value={2945631}
            subtitle="100% verifiable"
          />
          <StatCard
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            title="Organizations"
            value={342}
            subtitle="From governments to clubs"
          />
        </div>
      </div>
    </section>
  )
}
