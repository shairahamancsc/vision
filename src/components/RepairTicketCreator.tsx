"use client";

import { useState } from 'react';
import { DeviceForm } from '@/components/DeviceForm';
import { DiagnosticsResult } from '@/components/DiagnosticsResult';
import type { DiagnosisData } from '@/app/actions';

export function RepairTicketCreator() {
  const [diagnosis, setDiagnosis] = useState<DiagnosisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleNewDiagnosis = () => {
    setDiagnosis(null);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">New Repair Ticket</h1>
          <p className="text-muted-foreground mt-2">Enter device and customer details to generate a repair ticket.</p>
        </div>
        <DeviceForm setDiagnosis={setDiagnosis} setIsLoading={setIsLoading} isLoading={isLoading} />
      </div>
      <div>
        <DiagnosticsResult diagnosis={diagnosis} isLoading={isLoading} onNewDiagnosis={handleNewDiagnosis} />
      </div>
    </div>
  );
}
