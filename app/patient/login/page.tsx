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
} from 'lucide-react'
import Link from 'next/link'

export default function PatientLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login delay
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

      {/* Login Card */}
      <Card className="w-full max-w-md p-10 bg-gradient-to-br from-card via-card to-accent/5 border-2 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
        
        <div className="relative space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex p-5 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/10 shadow-lg shadow-primary/5 mb-2">
              <User className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Patient Login
            </h1>
            <p className="text-muted-foreground">
              Access your medical records securely
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
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
                  placeholder="Enter your password"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-muted-foreground">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-sm text-primary hover:underline font-medium"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/20 font-semibold text-base"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                <>
                  <Lock className="h-5 w-5 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="space-y-4 pt-4 border-t">
            <p className="text-center text-sm text-muted-foreground">
              {"Don't have an account?"}
              <Link href="/patient/register" className="text-primary hover:underline font-medium ml-1">
                Register now
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
