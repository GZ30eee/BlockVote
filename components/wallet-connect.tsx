"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { ethers } from "ethers"

interface WalletConnectProps {
  onConnectionChange?: (connected: boolean, address?: string) => void
}

export default function WalletConnect({ onConnectionChange }: WalletConnectProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum)
          setProvider(provider)

          const accounts = await provider.listAccounts()
          if (accounts.length > 0) {
            setWalletAddress(accounts[0].address)
            setIsConnected(true)
            onConnectionChange?.(true, accounts[0].address)
          }
        } else {
          console.log("Please install MetaMask!")
        }
      } catch (error) {
        console.error(error)
      }
    }

    checkIfWalletIsConnected()
  }, [onConnectionChange])

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!")
        return
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      setProvider(provider)

      const accounts = await provider.send("eth_requestAccounts", [])
      if (accounts.length > 0) {
        setWalletAddress(accounts[0])
        setIsConnected(true)
        onConnectionChange?.(true, accounts[0])
      }
    } catch (error) {
      console.error(error)
    }
  }

  const disconnectWallet = () => {
    setWalletAddress("")
    setIsConnected(false)
    onConnectionChange?.(false)
  }

  return (
    <div className="w-full sm:w-auto">
      {isConnected ? (
        <Button variant="outline" onClick={disconnectWallet} className="flex items-center gap-2 w-full sm:w-auto">
          <Wallet className="h-4 w-4" />
          <span className="hidden sm:inline">
            {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
          </span>
          <span className="sm:hidden">Disconnect</span>
        </Button>
      ) : (
        <Button variant="outline" onClick={connectWallet} className="flex items-center gap-2 w-full sm:w-auto">
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </Button>
      )}
    </div>
  )
}
