import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface ProfileCardProps {
  name: string
  role: 'patient' | 'doctor'
  avatarFallback: string
  details: Array<{ label: string; value: string }>
  statusBadge?: string
}

export function ProfileCard({
  name,
  role,
  avatarFallback,
  details,
  statusBadge,
}: ProfileCardProps) {
  return (
    <Card className="p-8 bg-gradient-to-br from-card via-card to-accent/5 border-2 shadow-sm">
      <div className="flex items-start gap-6">
        <Avatar className="h-20 w-20 border-2 border-primary/20 shadow-md">
          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xl font-bold">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-5">
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-1.5">
              <h2 className="text-2xl font-bold text-foreground">{name}</h2>
              {statusBadge && (
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-primary/10 to-primary/5 text-primary border-primary/20 px-3 py-1"
                >
                  {statusBadge}
                </Badge>
              )}
            </div>
            <p className="text-sm font-medium text-muted-foreground capitalize tracking-wide">
              {role}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {details.map((detail, index) => (
              <div key={index} className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {detail.label}
                </p>
                <p className="text-base font-semibold text-foreground">
                  {detail.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
