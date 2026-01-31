import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Clock } from 'lucide-react'

interface TimelineItem {
  id: string
  title: string
  description: string
  doctor: string
  date: string
  recordType: string
}

interface MedicalTimelineProps {
  items: TimelineItem[]
}

export function MedicalTimeline({ items }: MedicalTimelineProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">
          Medical History Timeline
        </h3>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="relative">
            {index !== items.length - 1 && (
              <div className="absolute left-2 top-8 bottom-0 w-0.5 bg-border" />
            )}
            <div className="flex gap-4">
              <div className="relative">
                <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                  <Shield className="h-3 w-3 text-primary-foreground" />
                </div>
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="font-semibold text-sm text-foreground">
                        {item.title}
                      </h4>
                      <Badge
                        variant="outline"
                        className="text-xs bg-secondary text-secondary-foreground"
                      >
                        {item.recordType}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Dr. {item.doctor}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {item.date}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
