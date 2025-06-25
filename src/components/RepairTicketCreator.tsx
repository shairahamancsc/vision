"use client";

import { useState } from 'react';
import { DeviceForm, type DeviceFormValues } from '@/components/DeviceForm';
import { DiagnosticsResult } from '@/components/DiagnosticsResult';
import { createTicket, type DiagnosisData } from '@/app/actions';
import { diagnoseDevice, type DiagnoseDeviceOutput } from '@/ai/flows/diagnose-device-flow';
import { useToast } from "@/hooks/use-toast";

export function RepairTicketCreator() {
  const [diagnosis, setDiagnosis] = useState<DiagnosisData | null>(null);
  const [aiDiagnosis, setAiDiagnosis] = useState<DiagnoseDeviceOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleNewDiagnosis = () => {
    setDiagnosis(null);
    setAiDiagnosis(null);
  }

  const handleFormSubmit = async (values: DeviceFormValues) => {
    setIsLoading(true);
    setDiagnosis(null);
    setAiDiagnosis(null);

    try {
      // Step 1: Create the ticket
      const ticketResult = await createTicket(values);
      if (ticketResult) {
        setDiagnosis(ticketResult);
        toast({
          title: "Ticket Created",
          description: `Repair ticket ${ticketResult.ticketId} has been generated. Now running diagnostics...`,
        });

        // Step 2: Run AI Diagnosis
        try {
            const aiResult = await diagnoseDevice(values);
            setAiDiagnosis(aiResult);
             toast({
              title: "AI Diagnosis Complete",
              description: "Suggested issues and solutions are now available.",
            });
        } catch (aiError) {
            console.error("AI Diagnosis Error:", aiError);
            toast({
                variant: "destructive",
                title: "AI Diagnosis Failed",
                description: "Could not generate AI-powered suggestions.",
            });
            // Set aiDiagnosis to null to indicate failure in the UI
            setAiDiagnosis(null); 
        }

      } else {
        toast({
          variant: "destructive",
          title: "Ticket Creation Failed",
          description: "Could not create a ticket. Please try again.",
        });
      }
    } catch (error) {
      console.error("Form Submission Error:", error);
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: "Something went wrong while creating the ticket.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">New Repair Ticket</h1>
          <p className="text-muted-foreground mt-2">Enter device and customer details to generate a repair ticket and run an AI diagnosis.</p>
        </div>
        <DeviceForm onFormSubmit={handleFormSubmit} isLoading={isLoading} />
      </div>
      <div>
        <DiagnosticsResult 
          diagnosis={diagnosis} 
          aiDiagnosis={aiDiagnosis}
          isLoading={isLoading} 
          onNewDiagnosis={handleNewDiagnosis} 
        />
      </div>
    </div>
  );
}
