'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
    return (
        <>
            <div className="flex items-center justify-between pb-2">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                    {t(titleTKey)}
                </h3>
                <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
                <div className="text-2xl font-bold">
                    {valueTKey ? t(valueTKey, valueTPOptions) : value}
                </div>
                <p className="text-xs text-muted-foreground">
                    {t(descriptionTKey, descriptionTPOptions)}
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
    <div className="p-6">
        <ProgressSummaryContent {...props} />
    </div>
  );
}
