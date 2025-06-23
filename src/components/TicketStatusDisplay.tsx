"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, FileText } from 'lucide-react';
import type { StatusInfo } from '@/app/track/page';
import { useEffect, useState } from 'react';

type TicketStatusDisplayProps = {
  statusInfo: StatusInfo;
};

export function TicketStatusDisplay({ statusInfo }: TicketStatusDisplayProps) {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    // This will only run on the client, after initial hydration
    setLastUpdated(new Date().toLocaleString());
  }, []); // Empty dependency array ensures this runs once on mount

  const getStatusBadgeVariant = (status: StatusInfo['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Completed':
      case 'Ready for Pickup':
        return 'default';
      case 'Awaiting Parts':
        return 'destructive';
      case 'In Repair':
      case 'Diagnosing':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center flex-wrap gap-2">
          <CardTitle>Status for Ticket: {statusInfo.ticketId}</CardTitle>
          <Badge variant={getStatusBadgeVariant(statusInfo.status)}>{statusInfo.status}</Badge>
        </div>
        <CardDescription>Last updated: {lastUpdated}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Repair Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(statusInfo.progress)}%</span>
          </div>
          <Progress value={statusInfo.progress} className="h-2" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-primary mt-1 shrink-0" />
                <div>
                    <h4 className="font-semibold">Estimated Completion</h4>
                    <p className="text-muted-foreground">{statusInfo.estimatedCompletion}</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <FileText className="h-6 w-6 text-primary mt-1 shrink-0" />
                <div>
                    <h4 className="font-semibold">Technician Notes</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        {statusInfo.notes.map((note, index) => <li key={index}>{note}</li>)}
                    </ul>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
