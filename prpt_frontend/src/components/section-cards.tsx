import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DashboardCard } from "@/types/dashboard"

const fallbackCards: DashboardCard[] = [
  {
    label: "Total Revenue",
    value: "$0.00",
    trend: "0%",
    trend_direction: "up",
    title: "No payments collected yet",
    description: "Collected from successful payments",
  },
  {
    label: "Occupied Units",
    value: "0/0",
    trend: "0%",
    trend_direction: "down",
    title: "No occupied units",
    description: "Current occupancy rate",
  },
  {
    label: "Active Leases",
    value: "0",
    trend: "+0",
    trend_direction: "up",
    title: "0 draft leases",
    description: "Ready for signature or move-in",
  },
  {
    label: "Outstanding Rent",
    value: "$0.00",
    trend: "0",
    trend_direction: "up",
    title: "No overdue payments",
    description: "0 pending applications",
  },
]

export function SectionCards({ cards = fallbackCards }: { cards?: DashboardCard[] }) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map((card) => {
        const TrendIcon = card.trend_direction === "up" ? IconTrendingUp : IconTrendingDown

        return (
          <Card className="@container/card" key={card.label}>
            <CardHeader>
              <CardDescription>{card.label}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {card.value}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <TrendIcon />
                  {card.trend}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {card.title} <TrendIcon className="size-4" />
              </div>
              <div className="text-muted-foreground">{card.description}</div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
