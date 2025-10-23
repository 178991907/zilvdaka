'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LucideIcon } from 'lucide-react';
import { ClientOnlyT } from '../layout/app-sidebar';

interface ProgressSummaryProps {
  icon: LucideIcon;
  titleTKey: string;
  value: string;
  valueTKey?: string;
  valueTPOptions?: any;
  descriptionTKey: string;
  descriptionTPOptions?: any;
  progress?: number;
}

export function ProgressSummaryContent({
  icon: Icon,
  titleTKey,
  value,
  valueTKey,
  valueTPOptions,
  descriptionTKey,
  descriptionTPOptions,
  progress,
}: ProgressSummaryProps) {
    return (
        <>
            <div className="flex items-center justify-between pb-2">
                <h3 className="text-base font-medium">
                    <ClientOnlyT tKey={titleTKey} />
                </h3>
                <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
                <div className="text-2xl font-bold">
                    {valueTKey ? <ClientOnlyT tKey={valueTKey} tOptions={valueTPOptions} /> : value}
                </div>
                <p className="text-xs text-muted-foreground">
                    <ClientOnlyT tKey={descriptionTKey} tOptions={descriptionTPOptions} />
                </p>
                {progress !== undefined && (
                    <Progress value={progress} className="mt-4 h-2" />
                )}
            </div>
        </>
    );
}


export default function ProgressSummary(props: ProgressSummaryProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <ProgressSummaryContent {...props} />
      </CardContent>
    </Card>
  );
}
