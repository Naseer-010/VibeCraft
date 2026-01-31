'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Heart,
  Shield,
  Users,
  Stethoscope,
  ArrowRight,
  Lock,
  Globe,
  Zap,
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/3 to-accent/8">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
                <Heart className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground tracking-tight">
                MediChain
              </span>
            </div>
            <Badge
              variant="outline"
              className="bg-gradient-to-r from-primary/10 to-primary/5 text-primary border-primary/20 px-4 py-1.5 shadow-sm"
            >
              <Shield className="h-3.5 w-3.5 mr-1.5" />
              Blockchain Secured
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="text-center space-y-6 mb-16">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
            Next-Generation Healthcare
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground text-balance">
            Secure Medical Records on the{' '}
            <span className="text-primary">Blockchain</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
            Experience the future of healthcare data management with
            decentralized, immutable, and patient-controlled medical records.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-10 mb-24 max-w-5xl mx-auto">
          {/* Patient Card */}
          <Card className="p-10 hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/40 group bg-gradient-to-br from-card via-card to-accent/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative space-y-7">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 w-fit group-hover:scale-110 transition-transform duration-300 border border-primary/10 shadow-lg shadow-primary/5">
                <Users className="h-11 w-11 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-3 text-balance">
                  Patient Portal
                </h2>
                <p className="text-muted-foreground leading-relaxed text-base">
                  Access and manage your complete medical history. Control who
                  views your records with blockchain-verified security.
                </p>
              </div>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">
                    View all medical records
                  </span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">
                    Control access permissions
                  </span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">
                    Download verified reports
                  </span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">
                    Medical history timeline
                  </span>
                </li>
              </ul>
              <Link href="/patient/login" className="block pt-2">
                <Button className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 group-hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20 font-semibold text-base">
                  Enter Patient Dashboard
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </Card>

          {/* Doctor Card */}
          <Card className="p-10 hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/40 group bg-gradient-to-br from-card via-card to-accent/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative space-y-7">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 w-fit group-hover:scale-110 transition-transform duration-300 border border-primary/10 shadow-lg shadow-primary/5">
                <Stethoscope className="h-11 w-11 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-3 text-balance">
                  Doctor Portal
                </h2>
                <p className="text-muted-foreground leading-relaxed text-base">
                  Access authorized patient records and add new verified medical
                  entries to the blockchain network.
                </p>
              </div>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">
                    Search patient records
                  </span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">
                    Add new medical records
                  </span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">
                    View patient history
                  </span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">
                    Blockchain verification
                  </span>
                </li>
              </ul>
              <Link href="/doctor/login" className="block pt-2">
                <Button className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 group-hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20 font-semibold text-base">
                  Enter Doctor Dashboard
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Features Section */}
        <div className="space-y-10">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">
              Why Choose MediChain?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              Built on cutting-edge blockchain technology for unparalleled
              security and transparency
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center bg-gradient-to-b from-card to-accent/5 hover:shadow-lg transition-all duration-300 hover:scale-105 border-2">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 mb-6 border border-primary/10 shadow-lg shadow-primary/5">
                <Lock className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-3">
                Immutable Records
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Medical records stored on the blockchain cannot be altered or
                tampered with, ensuring complete data integrity.
              </p>
            </Card>

            <Card className="p-8 text-center bg-gradient-to-b from-card to-accent/5 hover:shadow-lg transition-all duration-300 hover:scale-105 border-2">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 mb-6 border border-primary/10 shadow-lg shadow-primary/5">
                <Globe className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-3">
                Global Access
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Access your medical records from anywhere in the world with
                secure authentication and encryption.
              </p>
            </Card>

            <Card className="p-8 text-center bg-gradient-to-b from-card to-accent/5 hover:shadow-lg transition-all duration-300 hover:scale-105 border-2">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 mb-6 border border-primary/10 shadow-lg shadow-primary/5">
                <Zap className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-3">
                Instant Verification
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every medical record is instantly verified and timestamped on
                the blockchain for authenticity.
              </p>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 MediChain. Blockchain-powered healthcare records.
            </p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              <span>Secured by Blockchain Technology</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
