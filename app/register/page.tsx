"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, CheckCircle, Info, Wallet } from "lucide-react"
import WalletConnect from "@/components/wallet-connect"

export default function Register() {
  const router = useRouter()
  const [isConnected, setIsConnected] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [registrationStatus, setRegistrationStatus] = useState<"idle" | "registering" | "success" | "error">("idle")

  const handleWalletConnection = (connected: boolean) => {
    setIsConnected(connected)
  }

  const handleRegister = async () => {
    if (!name || !email || !agreeTerms) return

    setRegistrationStatus("registering")

    try {
      // This would be replaced with actual contract interaction
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setRegistrationStatus("success")
    } catch (error) {
      console.error("Error registering:", error)
      setRegistrationStatus("error")
    }
  }

  return (
    <div className="container max-w-md mx-auto flex flex-col items-center justify-center min-h-screen py-6 md:py-12 px-4">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-2xl">Voter Registration</CardTitle>
            <div className="w-8"></div> {/* Spacer for alignment */}
          </div>
          <CardDescription>Register to participate in blockchain-based elections</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isConnected ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <Wallet className="h-12 w-12 text-muted-foreground" />
              <div className="text-center">
                <h3 className="font-medium">Connect Your Wallet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect your Ethereum wallet to verify your identity
                </p>
                <WalletConnect onConnectionChange={handleWalletConnection} />
              </div>
            </div>
          ) : (
            <>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Wallet Connected</AlertTitle>
                <AlertDescription>Your wallet is connected. Complete the registration form below.</AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={registrationStatus === "registering" || registrationStatus === "success"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={registrationStatus === "registering" || registrationStatus === "success"}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                    disabled={registrationStatus === "registering" || registrationStatus === "success"}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the terms and conditions and privacy policy
                  </Label>
                </div>
              </div>

              {registrationStatus === "success" && (
                <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Registration Successful</AlertTitle>
                  <AlertDescription>
                    You have successfully registered as a voter. You can now participate in elections.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </CardContent>
        <CardFooter>
          {isConnected && registrationStatus !== "success" && (
            <Button
              className="w-full"
              onClick={handleRegister}
              disabled={!name || !email || !agreeTerms || registrationStatus === "registering"}
            >
              {registrationStatus === "registering" ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                  Registering...
                </>
              ) : (
                "Complete Registration"
              )}
            </Button>
          )}

          {registrationStatus === "success" && (
            <Button className="w-full" onClick={() => router.push("/dashboard")}>
              Go to Dashboard
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
