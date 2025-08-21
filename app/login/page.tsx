"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, CheckCircle, Info, Wallet } from "lucide-react"
import WalletConnect from "@/components/wallet-connect"

export default function Login() {
  const router = useRouter()
  const [isConnected, setIsConnected] = useState(false)
  const [loginStatus, setLoginStatus] = useState<"idle" | "logging-in" | "success" | "error">("idle")

  const handleWalletConnection = (connected: boolean) => {
    setIsConnected(connected)

    if (connected) {
      // Simulate checking if the wallet is registered
      setLoginStatus("logging-in")
      setTimeout(() => {
        setLoginStatus("success")
      }, 1500)
    }
  }

  return (
    <div className="container max-w-md mx-auto flex flex-col items-center justify-center min-h-screen py-6 md:py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-2xl">Voter Login</CardTitle>
            <div className="w-8"></div> {/* Spacer for alignment */}
          </div>
          <CardDescription>Login with your Ethereum wallet to access the voting platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-4 py-4">
            <Wallet className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
              <h3 className="font-medium">Connect Your Wallet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Connect your Ethereum wallet to authenticate and access the platform
              </p>
              <WalletConnect onConnectionChange={handleWalletConnection} />
            </div>
          </div>

          {loginStatus === "logging-in" && (
            <div className="flex justify-center items-center py-2">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <span className="ml-2">Authenticating...</span>
            </div>
          )}

          {loginStatus === "success" && (
            <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Authentication Successful</AlertTitle>
              <AlertDescription>
                Your wallet has been authenticated. You can now access the voting platform.
              </AlertDescription>
            </Alert>
          )}

          {loginStatus === "error" && (
            <Alert variant="destructive">
              <Info className="h-4 w-4" />
              <AlertTitle>Authentication Failed</AlertTitle>
              <AlertDescription>
                We couldn't authenticate your wallet. Please make sure you're registered as a voter.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          {loginStatus === "success" && (
            <Button className="w-full" onClick={() => router.push("/dashboard")}>
              Go to Dashboard
            </Button>
          )}

          {!isConnected && (
            <Button variant="outline" className="w-full bg-transparent" onClick={() => router.push("/register")}>
              Register as a Voter
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
