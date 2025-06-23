"use client";

import { useState } from 'react';
import { DeviceForm } from '@/components/DeviceForm';
import { DiagnosticsResult } from '@/components/DiagnosticsResult';
import type { DiagnoseDeviceOutput } from '@/ai/flows/diagnose-device-flow';
import { EcommerceSection } from '@/components/EcommerceSection';
import { Separator } from '@/components/ui/separator';

export type DiagnosisData = DiagnoseDeviceOutput & {
  ticketId: string;
  customerName: string;
};

export default function Home() {
  const [diagnosis, setDiagnosis] = useState<DiagnosisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleNewDiagnosis = () => {
    setDiagnosis(null);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">New Repair Ticket</h1>
            <p className="text-muted-foreground mt-2">Enter device and customer details to get an AI-powered diagnosis.</p>
          </div>
          <DeviceForm setDiagnosis={setDiagnosis} setIsLoading={setIsLoading} isLoading={isLoading} />
        </div>
        <div>
          <DiagnosticsResult diagnosis={diagnosis} isLoading={isLoading} onNewDiagnosis={handleNewDiagnosis} />
        </div>
      </div>

      <Separator className="my-12 md:my-16" />

      <EcommerceSection />
    </div>
  );
}
