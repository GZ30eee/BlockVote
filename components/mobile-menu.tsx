"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu, Vote, ArrowRight } from "lucide-react"
import WalletConnect from "@/components/wallet-connect"

export function MobileMenu({ isConnected }: { isConnected: boolean }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[85%] sm:w-[385px]">
        <SheetHeader className="text-left">
          <SheetTitle>
            <div className="flex items-center gap-2 font-bold text-xl">
              <Vote className="h-6 w-6" />
              <span>BlockVote</span>
            </div>
          </SheetTitle>
          <SheetDescription>Secure blockchain voting platform</SheetDescription>
        </SheetHeader>
        <div className="py-6 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <WalletConnect onConnectionChange={() => {}} />
            {isConnected ? (
              <Button asChild onClick={() => setOpen(false)}>
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" asChild onClick={() => setOpen(false)}>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <SheetClose asChild>
              <Link
                href="#features"
                className="flex h-10 items-center rounded-md px-4 text-sm font-medium transition-colors hover:bg-muted"
              >
                Features
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="#how-it-works"
                className="flex h-10 items-center rounded-md px-4 text-sm font-medium transition-colors hover:bg-muted"
              >
                How It Works
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="#security"
                className="flex h-10 items-center rounded-md px-4 text-sm font-medium transition-colors hover:bg-muted"
              >
                Security
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="#faq"
                className="flex h-10 items-center rounded-md px-4 text-sm font-medium transition-colors hover:bg-muted"
              >
                FAQ
              </Link>
            </SheetClose>
          </div>
        </div>
        <SheetFooter className="flex-col sm:flex-row sm:justify-between">
          <div className="flex gap-4 justify-center sm:justify-start">
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
              Privacy
            </Link>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4 sm:mt-0">
            © {new Date().getFullYear()} BlockVote
          </p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
