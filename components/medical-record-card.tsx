'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { FileText, Download, Eye, Shield } from 'lucide-react'

type RecordType = 'Prescription' | 'Lab Report' | 'Diagnosis'

interface MedicalRecordCardProps {
  id: string
  doctorName: string
  hospital: string
  recordType: RecordType
  date: string
  isVisible: boolean
  onToggleVisibility?: (id: string) => void
  onViewReport?: (id: string) => void
  onDownloadReport?: (id: string) => void
}

const recordTypeColors = {
  Prescription: 'bg-blue-50 text-blue-700 border-blue-200',
  'Lab Report': 'bg-green-50 text-green-700 border-green-200',
  Diagnosis: 'bg-amber-50 text-amber-700 border-amber-200',
}

export function MedicalRecordCard({
  id,
  doctorName,
  hospital,
  recordType,
  date,
  isVisible,
  onToggleVisibility,
  onViewReport,
  onDownloadReport,
}: MedicalRecordCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.01] border border-border bg-gradient-to-br from-card via-card to-accent/5">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap mb-2">
                <h3 className="font-bold text-lg text-foreground">
                  {recordType}
                </h3>
                <Badge
                  variant="outline"
                  className="bg-gradient-to-r from-primary/10 to-primary/5 text-primary border-primary/20 flex items-center gap-1.5 px-2.5 py-0.5"
                >
                  <Shield className="h-3.5 w-3.5" />
                  Verified
                </Badge>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Dr. {doctorName} • {hospital}
              </p>
              <p className="text-xs text-muted-foreground mt-1.5">{date}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewReport?.(id)}
              className="h-9 px-4 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Report
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownloadReport?.(id)}
              className="h-9 px-4 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50 border border-border/50">
            <span className="text-xs font-medium text-muted-foreground">
              {isVisible ? 'Visible' : 'Hidden'}
            </span>
            <Switch
              checked={isVisible}
              onCheckedChange={() => onToggleVisibility?.(id)}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
