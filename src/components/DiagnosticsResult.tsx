import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Lightbulb, Ticket, User, Printer, Bot } from "lucide-react";
import type { DiagnosisData } from "@/app/page";

type DiagnosticsResultProps = {
  diagnosis: DiagnosisData | null;
  isLoading: boolean;
  onNewDiagnosis: () => void;
};

export function DiagnosticsResult({ diagnosis, isLoading, onNewDiagnosis }: DiagnosticsResultProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Skeleton className="h-6 w-1/3 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
          <div>
            <Skeleton className="h-6 w-1/3 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
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
          <CardTitle>Awaiting Diagnosis</CardTitle>
          <CardDescription>Your AI-powered diagnostic report will appear here once you submit the device details.</CardDescription>
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
                <CardDescription>Review the diagnosis and share the ticket with the customer.</CardDescription>
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

        <div>
          <h3 className="text-lg font-semibold flex items-center mb-2"><Lightbulb className="mr-2 h-5 w-5" />Suggested Issues</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            {diagnosis.suggestedIssues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold flex items-center mb-2"><CheckCircle className="mr-2 h-5 w-5" />Potential Solutions</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            {diagnosis.potentialSolutions.map((solution, index) => (
              <li key={index}>{solution}</li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="gap-2 justify-end">
        <Button onClick={onNewDiagnosis} variant="outline">Create New Ticket</Button>
        <Button onClick={() => window.print()}><Printer className="mr-2"/> Print Ticket</Button>
      </CardFooter>
    </Card>
  );
}
