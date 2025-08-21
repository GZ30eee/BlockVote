"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ElectionsRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.push("/dashboard")
  }, [router])

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-lg font-medium">Redirecting to elections dashboard...</p>
      </div>
    </div>
  )
}
