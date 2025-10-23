import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LucideIcon } from 'lucide-react';

interface ProgressSummaryProps {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
  progress?: number;
}

export default function ProgressSummary({
  icon: Icon,
  title,
  value,
  description,
  progress,
}: ProgressSummaryProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {progress !== undefined && (
          <Progress value={progress} className="mt-4 h-2" />
        )}
      </CardContent>
    </Card>
  );
}
