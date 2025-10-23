'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProgressChart from '@/components/reports/progress-chart';
import { useTranslation } from 'react-i18next';
import { ClientOnlyT } from '@/components/layout/app-sidebar';

export default function ReportsPage() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col">
       <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-semibold"><ClientOnlyT tKey='reports.title' /></h1>
        </header>
      <main className="flex-1 p-4 md:p-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle><ClientOnlyT tKey='reports.performanceTitle' /></CardTitle>
            <Select defaultValue="weekly">
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={<ClientOnlyT tKey='reports.selectRange' />} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="weekly"><ClientOnlyT tKey='reports.thisWeek' /></SelectItem>
                    <SelectItem value="monthly"><ClientOnlyT tKey='reports.thisMonth' /></SelectItem>
                    <SelectItem value="yearly"><ClientOnlyT tKey='reports.thisYear' /></SelectItem>
                </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <ProgressChart />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
