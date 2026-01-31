'use client'

import { useState } from 'react'
import { ProfileCard } from '@/components/profile-card'
import { MedicalTimeline } from '@/components/medical-timeline'
import { UploadRecordModal } from '@/components/upload-record-modal'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Plus,
  Users,
  FileText,
  Clock,
  Shield,
  AlertCircle,
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function DoctorDashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  const patientData = {
    name: 'John Anderson',
    age: 42,
    healthId: 'MED-2024-8291',
    walletAddress: '0x742d...9f3a',
  }

  const patientTimeline = [
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
  ]

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSelectedPatient(searchQuery)
    }
  }

  const handleUploadSubmit = (data: {
    recordType: string
    diagnosis: string
    file: File | null
  }) => {
    console.log('Upload submitted:', data)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground text-balance">
              Doctor Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Access and manage patient medical records
            </p>
          </div>
          <Badge className="bg-primary text-primary-foreground px-4 py-2">
            <Shield className="h-4 w-4 mr-1.5" />
            Licensed Practitioner
          </Badge>
        </div>

        {/* Doctor Profile */}
        <ProfileCard
          name="Dr. Sarah Johnson"
          role="doctor"
          avatarFallback="SJ"
          details={[
            { label: 'Specialization', value: 'Cardiology' },
            { label: 'License ID', value: 'MD-2019-4567' },
            { label: 'Hospital', value: 'City General Hospital' },
            { label: 'Patients', value: '247 Active' },
          ]}
          statusBadge="Active"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">247</p>
                <p className="text-sm text-muted-foreground">
                  Authorized Patients
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-50">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">1,234</p>
                <p className="text-sm text-muted-foreground">Records Created</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-50">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-sm text-muted-foreground">
                  Today's Appointments
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Patient Lookup */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Patient Lookup
          </h2>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter Patient ID or Wallet Address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-9"
              />
            </div>
            <Button onClick={handleSearch} className="bg-primary">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </Card>

        {/* Patient Information */}
        {selectedPatient && (
          <>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You have read-only access to this patient's medical records. New
                records can be added but existing records cannot be modified.
              </AlertDescription>
            </Alert>

            <Card className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Patient Information
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {patientData.name} • Health ID: {patientData.healthId}
                  </p>
                </div>
                <Button
                  onClick={() => setUploadModalOpen(true)}
                  className="bg-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Medical Record
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Patient Name
                  </p>
                  <p className="text-sm font-medium text-foreground mt-1">
                    {patientData.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Age
                  </p>
                  <p className="text-sm font-medium text-foreground mt-1">
                    {patientData.age} years
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Health ID
                  </p>
                  <p className="text-sm font-medium text-foreground mt-1">
                    {patientData.healthId}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Wallet Address
                  </p>
                  <p className="text-sm font-medium text-foreground mt-1">
                    {patientData.walletAddress}
                  </p>
                </div>
              </div>
            </Card>

            {/* Medical Timeline */}
            <MedicalTimeline items={patientTimeline} />
          </>
        )}

        {/* Empty State */}
        {!selectedPatient && (
          <Card className="p-12">
            <div className="text-center space-y-3">
              <div className="inline-flex p-4 rounded-full bg-muted">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                No Patient Selected
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Search for a patient using their Health ID or wallet address to
                view their medical records and add new entries.
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Upload Modal */}
      <UploadRecordModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onSubmit={handleUploadSubmit}
      />
    </div>
  )
}
