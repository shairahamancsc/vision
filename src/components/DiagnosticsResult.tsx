"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ticket, User, Printer, Bot, WandSparkles, AlertTriangle } from "lucide-react";
import type { DiagnosisData } from "@/app/actions";
import type { DiagnoseDeviceOutput } from "@/ai/flows/diagnose-device-flow";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type DiagnosticsResultProps = {
  diagnosis: DiagnosisData | null;
  aiDiagnosis: DiagnoseDeviceOutput | null;
  isLoading: boolean;
  onNewDiagnosis: () => void;
};

export function DiagnosticsResult({ diagnosis, aiDiagnosis, isLoading, onNewDiagnosis }: DiagnosticsResultProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div>
            <Skeleton className="h-6 w-1/3 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!diagnosis) {
    return (
      <Card className="flex flex-col items-center justify-center h-full text-center p-8 border-dashed min-h-[400px]">
        <CardHeader>
            <div className="mx-auto bg-secondary rounded-full p-3 mb-4">
                <Bot className="h-8 w-8 text-secondary-foreground" />
            </div>
          <CardTitle>Awaiting Ticket Generation</CardTitle>
          <CardDescription>Your repair ticket and AI diagnosis will appear here once you submit the device details.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-card">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-2xl font-bold text-primary">Repair Ticket Generated</CardTitle>
                <CardDescription>Review the ticket and AI-powered diagnosis below.</CardDescription>
            </div>
            <Badge variant="secondary" className="flex items-center gap-2 text-base">
                <Ticket className="h-4 w-4" />
                {diagnosis.ticketId}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
            <h3 className="text-lg font-semibold flex items-center mb-2"><User className="mr-2 h-5 w-5" />Customer</h3>
            <p className="text-muted-foreground">{diagnosis.customerName}</p>
        </div>

        <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center"><WandSparkles className="mr-2 h-5 w-5 text-primary" />AI-Powered Diagnosis</h3>
            
            {!aiDiagnosis && (
                 <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Diagnosis Failed</AlertTitle>
                    <AlertDescription>
                        The AI diagnosis could not be generated. Please check the server logs. You can still print the ticket.
                    </AlertDescription>
                </Alert>
            )}

            {aiDiagnosis && (
                 <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Suggested Issues</AccordionTrigger>
                        <AccordionContent>
                            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                {aiDiagnosis.suggestedIssues.map((issue, index) => <li key={index}>{issue}</li>)}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Potential Solutions</AccordionTrigger>
                        <AccordionContent>
                           <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                {aiDiagnosis.potentialSolutions.map((solution, index) => <li key={index}>{solution}</li>)}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            )}
        </div>
      </CardContent>
      <CardFooter className="gap-2 justify-end">
        <Button onClick={onNewDiagnosis} variant="outline">Create New Ticket</Button>
        <Button onClick={() => window.print()}><Printer className="mr-2"/> Print Ticket</Button>
      </CardFooter>
    </Card>
  );
}
