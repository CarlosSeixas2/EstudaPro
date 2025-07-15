import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { LucideIcon } from "lucide-react";

interface DailySummaryCardProps {
  title: string;
  icon: LucideIcon;
  value: string | number;
  footer: string;
  progress?: number;
}

export const DailySummaryCard = ({
  title,
  icon: Icon,
  value,
  footer,
  progress,
}: DailySummaryCardProps) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center justify-between text-sm font-medium">
        {title}
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{footer}</p>
      {progress !== undefined && (
        <Progress value={progress} className="mt-4 h-2" />
      )}
    </CardContent>
  </Card>
);
