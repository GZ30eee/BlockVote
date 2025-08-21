"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  CheckCircle,
  Lock,
  ShieldCheck,
  Vote,
  Building2,
  GraduationCap,
  Building,
  Users,
  Database,
  FileSearch,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import WalletConnect from "@/components/wallet-connect"
import { MobileMenu } from "@/components/mobile-menu"
import { StatsSection } from "@/components/stats-counter"

export default function LandingPage() {
  const [isConnected, setIsConnected] = useState(false)

  const handleWalletConnection = (connected: boolean) => {
    setIsConnected(connected)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl mx-auto px-4 md:px-6 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Vote className="h-6 w-6" />
            <span>BlockVote</span>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-6">
              <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm font-medium transition-colors hover:text-primary">
                How It Works
              </Link>
              <Link href="#security" className="text-sm font-medium transition-colors hover:text-primary">
                Security
              </Link>
              <Link href="#faq" className="text-sm font-medium transition-colors hover:text-primary">
                FAQ
              </Link>
            </nav>
            <ThemeToggle />
            <div className="hidden sm:block">
              <WalletConnect onConnectionChange={handleWalletConnection} />
            </div>
            {isConnected ? (
              <Button asChild size="sm" className="hidden sm:flex">
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" asChild className="hidden sm:flex bg-transparent">
                <Link href="/login">Login</Link>
              </Button>
            )}
            <MobileMenu isConnected={isConnected} />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8 xl:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  {/* Developer credit pill added here */}
                  <div className="flex justify-start mb-4">
                    <a
                      href="https://linktr.ee/ghza3006"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-200 border border-primary/20 hover:border-primary/30"
                    >
                      <span className="mr-1">👨‍💻</span>
                      Developed by Ghanshyamsinh Zala
                    </a>
                  </div>

                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Secure Voting on the Blockchain
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Transparent, tamper-proof, and accessible voting system powered by Ethereum blockchain technology.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/register">
                      Register to Vote
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/dashboard">View Active Elections</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[500px] aspect-square overflow-hidden rounded-xl border bg-muted p-2">
                  <div className="flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 p-6">
                    <div className="grid gap-4 text-white">
                      <div className="flex items-center justify-center">
                        <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center">
                          <Vote className="h-12 w-12" />
                        </div>
                      </div>
                      <div className="text-center">
                        <h3 className="text-xl font-bold">Blockchain Voting</h3>
                        <p className="text-white/80">Secure, Transparent, Immutable</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <StatsSection />

        <section className="w-full py-12 md:py-16 bg-gradient-to-b from-background to-muted/30">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 max-w-[85%] md:max-w-[60%]">
                <h2 className="text-2xl md:text-3xl font-bold">Trusted by Organizations Worldwide</h2>
                <p className="text-muted-foreground">
                  BlockVote is the preferred choice for secure, transparent elections across various sectors
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 py-8 md:py-12">
              <div className="flex flex-col items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <p className="mt-2 text-center font-medium">Government</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <p className="mt-2 text-center font-medium">Universities</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <p className="mt-2 text-center font-medium">Corporations</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <p className="mt-2 text-center font-medium">Communities</p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Key Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our blockchain voting system offers unparalleled security and transparency
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 py-8 md:py-12 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <Lock className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Secure Authentication</h3>
                <p className="text-center text-muted-foreground">
                  Authenticate with your digital wallet for secure, private access to voting
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <ShieldCheck className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Tamper-Proof Ballots</h3>
                <p className="text-center text-muted-foreground">
                  All votes are recorded on the blockchain, making them immutable and verifiable
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <CheckCircle className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Transparent Results</h3>
                <p className="text-center text-muted-foreground">
                  Real-time vote tallying with complete transparency and auditability
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  A simple, secure process from registration to voting
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 py-8 md:py-12 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold">Connect Wallet</h3>
                <p className="text-center text-muted-foreground">
                  Connect your MetaMask or other Ethereum wallet to authenticate
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold">Register to Vote</h3>
                <p className="text-center text-muted-foreground">
                  Complete the registration process to verify your eligibility
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold">Cast Your Vote</h3>
                <p className="text-center text-muted-foreground">
                  Select your candidate and confirm your vote on the blockchain
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/30 to-background">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Why Choose BlockVote?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform offers advantages that traditional voting systems can't match
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 py-8 md:py-12 sm:grid-cols-2">
              <div className="flex flex-col space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold">Eliminates Fraud</h3>
                </div>
                <p className="text-muted-foreground">
                  Blockchain technology prevents double-voting and tampering with results
                </p>
              </div>
              <div className="flex flex-col space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold">Increases Participation</h3>
                </div>
                <p className="text-muted-foreground">
                  Remote voting capabilities make participation easier and more accessible
                </p>
              </div>
              <div className="flex flex-col space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold">Real-time Results</h3>
                </div>
                <p className="text-muted-foreground">
                  See voting results as they happen with automatic, transparent counting
                </p>
              </div>
              <div className="flex flex-col space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold">Cost-Effective</h3>
                </div>
                <p className="text-muted-foreground">
                  Reduces the costs associated with traditional paper-based voting systems
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="security" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Security Measures</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Multiple layers of security to ensure vote integrity
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-5xl py-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <div className="flex gap-4 items-start">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Wallet Verification</h3>
                    <p className="text-muted-foreground">
                      Secure authentication using cryptographic wallet signatures ensures only authorized voters can
                      participate in elections.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Double-Vote Prevention</h3>
                    <p className="text-muted-foreground">
                      Smart contract logic prevents multiple votes from the same address, ensuring the integrity of each
                      election.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Immutable Records</h3>
                    <p className="text-muted-foreground">
                      All votes are permanently recorded on the Ethereum blockchain, making them tamper-proof and
                      verifiable by anyone.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <FileSearch className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Audit Trail</h3>
                    <p className="text-muted-foreground">
                      Complete transaction history available for verification, allowing for transparent post-election
                      audits.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 max-w-[85%] md:max-w-[60%]">
                <h2 className="text-2xl md:text-3xl font-bold">Frequently Asked Questions</h2>
                <p className="text-muted-foreground">Find answers to common questions about blockchain voting</p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl space-y-4 py-12">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-bold">Is blockchain voting secure?</h3>
                <p className="mt-2 text-muted-foreground">
                  Yes, blockchain voting is highly secure. The decentralized nature of blockchain technology makes it
                  extremely difficult to tamper with votes. Each vote is cryptographically secured and the entire voting
                  record is transparent and immutable.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-bold">How do I know my vote was counted?</h3>
                <p className="mt-2 text-muted-foreground">
                  After casting your vote, you'll receive a transaction confirmation. You can verify your vote on the
                  blockchain using the transaction hash, ensuring your vote was recorded exactly as you intended.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-bold">What if I don't have a digital wallet?</h3>
                <p className="mt-2 text-muted-foreground">
                  We provide guidance on setting up a digital wallet like MetaMask. The process is simple and takes just
                  a few minutes. Our support team is also available to help if you encounter any difficulties.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-bold">Can votes be traced back to me?</h3>
                <p className="mt-2 text-muted-foreground">
                  While votes are recorded on the public blockchain, they are associated with your wallet address, not
                  your personal identity. This provides a balance between transparency and privacy.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to Get Started?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of voters using blockchain technology for secure, transparent elections
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" asChild>
                  <Link href="/register">
                    Register Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/login">
                    Login
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container max-w-7xl mx-auto px-4 md:px-6 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 font-bold">
            <Vote className="h-6 w-6" />
            <span>BlockVote</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © {new Date().getFullYear()} BlockVote. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
