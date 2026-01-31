'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Heart,
  Shield,
  User,
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  Wallet,
  CheckCircle2,
} from 'lucide-react'
import Link from 'next/link'

export default function PatientRegister() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [isConnectingWallet, setIsConnectingWallet] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate registration delay
    setTimeout(() => {
      setIsLoading(false)
      router.push('/patient/dashboard')
    }, 1500)
  }

  const handleConnectWallet = async () => {
    setIsConnectingWallet(true)

    // Simulate wallet connection
    setTimeout(() => {
      const mockAddress = '0x' + Math.random().toString(16).substring(2, 42)
      setWalletAddress(mockAddress)
      setIsConnectingWallet(false)
    }, 1500)
  }

  const handleWalletLogin = async () => {
    if (!walletAddress) return
    setIsLoading(true)

    // Simulate wallet login
    setTimeout(() => {
      setIsLoading(false)
      router.push('/patient/dashboard')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/3 to-accent/8 flex items-center justify-center p-6">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 border-b border-border/50 bg-card/95 backdrop-blur-md shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
                <Heart className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground tracking-tight">
                MediChain
              </span>
            </Link>
            <Badge
              variant="outline"
              className="bg-gradient-to-r from-primary/10 to-primary/5 text-primary border-primary/20 px-4 py-1.5 shadow-sm"
            >
              <Shield className="h-3.5 w-3.5 mr-1.5" />
              Blockchain Secured
            </Badge>
          </div>
        </div>
      </div>

      {/* Register Card */}
      <Card className="w-full max-w-md p-10 bg-gradient-to-br from-card via-card to-accent/5 border-2 shadow-2xl relative overflow-hidden mt-20 mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
        
        <div className="relative space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex p-5 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/10 shadow-lg shadow-primary/5 mb-2">
              <User className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Create Patient Account
            </h1>
            <p className="text-muted-foreground">
              Join MediChain and secure your health records
            </p>
          </div>

          {/* Wallet Connection Option */}
          {!walletAddress ? (
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground font-semibold">
                    Quick Register with Wallet
                  </span>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleConnectWallet}
                disabled={isConnectingWallet}
                className="w-full h-12 bg-gradient-to-r from-foreground to-foreground/90 hover:from-foreground/90 hover:to-foreground/80 text-background shadow-lg font-semibold"
              >
                {isConnectingWallet ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    Connecting...
                  </div>
                ) : (
                  <>
                    <Wallet className="h-5 w-5 mr-2" />
                    Connect Wallet
                  </>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground font-semibold">
                    Or register with email
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/20">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
                      Wallet Connected
                    </p>
                    <p className="text-sm font-mono text-foreground truncate">
                      {walletAddress}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleWalletLogin}
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/20 font-semibold text-base"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Creating Account...
                  </div>
                ) : (
                  <>
                    Continue with Wallet
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setWalletAddress('')}
                className="w-full bg-transparent"
              >
                Disconnect Wallet
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground font-semibold">
                    Or register with email
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-semibold">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="h-12 bg-background/50 border-2 focus:border-primary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-background/50 border-2 focus:border-primary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 bg-background/50 border-2 focus:border-primary/50 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-12 bg-background/50 border-2 focus:border-primary/50 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary mt-0.5"
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the{' '}
                <button type="button" className="text-primary hover:underline font-medium">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="text-primary hover:underline font-medium">
                  Privacy Policy
                </button>
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !!walletAddress}
              className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/20 font-semibold text-base"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Creating Account...
                </div>
              ) : (
                <>
                  <Mail className="h-5 w-5 mr-2" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="space-y-4 pt-4 border-t">
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?
              <Link href="/patient/login" className="text-primary hover:underline font-medium ml-1">
                Sign in
              </Link>
            </p>
            
            <Link href="/" className="block">
              <Button
                variant="outline"
                className="w-full hover:bg-muted/50 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
