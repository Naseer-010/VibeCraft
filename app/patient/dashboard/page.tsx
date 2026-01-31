'use client'

import { useState } from 'react'
import { ProfileCard } from '@/components/profile-card'
import { MedicalRecordCard } from '@/components/medical-record-card'
import { MedicalTimeline } from '@/components/medical-timeline'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Activity,
  FileText,
  Shield,
  AlertCircle,
  Search,
  Filter,
} from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function PatientDashboard() {
  const [records, setRecords] = useState([
    {
      id: '1',
      doctorName: 'Sarah Johnson',
      hospital: 'City General Hospital',
      recordType: 'Prescription' as const,
      date: 'Jan 15, 2026',
      isVisible: true,
    },
    {
      id: '2',
      doctorName: 'Michael Chen',
      hospital: 'Wellness Medical Center',
      recordType: 'Lab Report' as const,
      date: 'Jan 10, 2026',
      isVisible: true,
    },
    {
      id: '3',
      doctorName: 'Emily Rodriguez',
      hospital: 'Heart Care Clinic',
      recordType: 'Diagnosis' as const,
      date: 'Dec 28, 2025',
      isVisible: false,
    },
    {
      id: '4',
      doctorName: 'David Williams',
      hospital: 'Metro Health Hospital',
      recordType: 'Lab Report' as const,
      date: 'Dec 20, 2025',
      isVisible: true,
    },
  ])

  const timelineItems = [
    {
      id: '1',
      title: 'Blood Pressure Medication',
      description: 'Prescribed Lisinopril 10mg daily for hypertension',
      doctor: 'Sarah Johnson',
      date: 'Jan 15, 2026',
      recordType: 'Prescription',
    },
    {
      id: '2',
      title: 'Complete Blood Count',
      description: 'Routine blood work showing normal results',
      doctor: 'Michael Chen',
      date: 'Jan 10, 2026',
      recordType: 'Lab Report',
    },
    {
      id: '3',
      title: 'Cardiac Assessment',
      description: 'ECG and stress test completed, mild arrhythmia detected',
      doctor: 'Emily Rodriguez',
      date: 'Dec 28, 2025',
      recordType: 'Diagnosis',
    },
    {
      id: '4',
      title: 'Cholesterol Panel',
      description: 'Lipid profile within acceptable range',
      doctor: 'David Williams',
      date: 'Dec 20, 2025',
      recordType: 'Lab Report',
    },
  ]

  const handleToggleVisibility = (id: string) => {
    setRecords(
      records.map((record) =>
        record.id === id ? { ...record, isVisible: !record.isVisible } : record
      )
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground text-balance">
              Patient Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your medical records securely on the blockchain
            </p>
          </div>
          <Badge className="bg-primary text-primary-foreground px-4 py-2">
            <Shield className="h-4 w-4 mr-1.5" />
            Blockchain Verified
          </Badge>
        </div>

        {/* Profile Section */}
        <ProfileCard
          name="John Anderson"
          role="patient"
          avatarFallback="JA"
          details={[
            { label: 'Age', value: '42 years' },
            { label: 'Health ID', value: 'MED-2024-8291' },
            { label: 'Wallet Address', value: '0x742d...9f3a' },
            { label: 'Blood Type', value: 'O+' },
          ]}
          statusBadge="Active"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {records.length}
                </p>
                <p className="text-sm text-muted-foreground">
                  Total Medical Records
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-50">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">3</p>
                <p className="text-sm text-muted-foreground">
                  Authorized Doctors
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-amber-50">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">On</p>
                <p className="text-sm text-muted-foreground">
                  Emergency Access
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Medical Records Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-2xl font-bold text-foreground">
              My Medical Records
            </h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search records..."
                  className="pl-9 w-[200px]"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {records.map((record) => (
              <MedicalRecordCard
                key={record.id}
                {...record}
                onToggleVisibility={handleToggleVisibility}
                onViewReport={(id) => console.log('View report:', id)}
                onDownloadReport={(id) => console.log('Download report:', id)}
              />
            ))}
          </div>
        </div>

        {/* Timeline Section */}
        <MedicalTimeline items={timelineItems} />
      </div>
    </div>
  )
}
