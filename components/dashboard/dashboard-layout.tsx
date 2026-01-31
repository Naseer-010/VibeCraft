'use client'

import React from "react"

import { useState } from 'react'
import { 
  LayoutDashboard, 
  FileText, 
  Clock, 
  ShieldCheck, 
  Activity, 
  Settings,
  ShieldCheckIcon,
  User
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const patientNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/patient' },
  { icon: FileText, label: 'Medical Records', href: '/dashboard/records' },
  { icon: Clock, label: 'Timeline', href: '/dashboard/timeline' },
  { icon: ShieldCheck, label: 'Access Control', href: '/dashboard/access' },
  { icon: Activity, label: 'Activity Logs', href: '/dashboard/activity' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
]

const doctorNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/doctor' },
  { icon: User, label: 'My Patients', href: '/dashboard/doctor/patients' },
  { icon: FileText, label: 'Add Record', href: '/dashboard/doctor/add-record' },
  { icon: Clock, label: 'Recent Activity', href: '/dashboard/doctor/activity' },
  { icon: ShieldCheck, label: 'Verifications', href: '/dashboard/doctor/verifications' },
  { icon: Settings, label: 'Settings', href: '/dashboard/doctor/settings' },
]

interface DashboardLayoutProps {
  children: React.ReactNode
  userName: string
  userRole: 'Patient' | 'Doctor'
  healthId: string
  currentPage?: string
}

export function DashboardLayout({ 
  children, 
  userName, 
  userRole, 
  healthId,
  currentPage = '/dashboard'
}: DashboardLayoutProps) {
  const [activePage, setActivePage] = useState(currentPage)
  const navItems = userRole === 'Doctor' ? doctorNavItems : patientNavItems;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <ShieldCheckIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">HealthSecure</h1>
              <p className="text-xs text-muted-foreground">Lifetime Records</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activePage === item.href
            return (
              <Button
                key={item.href}
                variant={isActive ? 'default' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3',
                  isActive && 'bg-primary text-primary-foreground'
                )}
                onClick={() => {
                  setActivePage(item.href)
                  window.location.href = item.href
                }}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            <ShieldCheckIcon className="w-3 h-3 inline mr-1" />
            Blockchain Secured
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-foreground">
              {navItems.find(item => item.href === activePage)?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/50 border border-primary/20">
              <ShieldCheckIcon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{healthId}</span>
              <Badge variant="outline" className="text-xs border-primary/30 text-primary">Verified</Badge>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{userName}</p>
                <Badge 
                  variant="secondary" 
                  className={cn(
                    'text-xs',
                    userRole === 'Doctor' && 'bg-primary/10 text-primary border-primary/20'
                  )}
                >
                  {userRole}
                </Badge>
              </div>
              <Avatar className="w-9 h-9 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {userName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
