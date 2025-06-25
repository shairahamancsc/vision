"use client";

import { useState } from 'react';
import { TicketStatusForm } from '@/components/TicketStatusForm';
import { TicketStatusDisplay } from '@/components/TicketStatusDisplay';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getTicketStatusAction } from '@/app/actions';
import { format } from 'date-fns';

export type Status = 'Received' | 'Diagnosing' | 'Awaiting Parts' | 'In Repair' | 'Ready for Pickup' | 'Completed';

export type StatusInfo = {
  ticketId: string;
  status: Status;
  progress: number;
  estimatedCompletion: string;
  notes: string[];
};

const statusToProgress: Record<Status, number> = {
    'Received': 10,
    'Diagnosing': 30,
    'Awaiting Parts': 50,
    'In Repair': 70,
    'Ready for Pickup': 90,
    'Completed': 100,
};

export default function TrackPage() {
  const [statusInfo, setStatusInfo] = useState<StatusInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchTicketStatus = async (ticketId: string) => {
    setIsLoading(true);
    setStatusInfo(null);
    setHasSearched(true);
    
    const ticket = await getTicketStatusAction(ticketId);

    if (ticket) {
        const status = ticket.status as Status;
        setStatusInfo({
            ticketId: ticket.ticket_id,
            status: status,
            progress: statusToProgress[status] || 0,
            estimatedCompletion: ticket.estimated_completion ? format(new Date(ticket.estimated_completion), 'PPP') : 'Not available',
            notes: ticket.notes && ticket.notes.length > 0 ? ticket.notes : ['No notes yet.'],
        });
    } else {
        setStatusInfo(null);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Check Repair Status</h1>
                <p className="text-muted-foreground mt-2">Enter your ticket number below to see the latest updates on your device repair.</p>
            </div>

            <TicketStatusForm onTrack={fetchTicketStatus} isLoading={isLoading} />
            
            <div className="mt-8">
                {isLoading && (
                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <Skeleton className="h-8 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-12 w-full mt-4" />
                                <Skeleton className="h-24 w-full" />
                            </div>
                        </CardContent>
                    </Card>
                )}
                
                {statusInfo && !isLoading && (
                    <TicketStatusDisplay statusInfo={statusInfo} />
                )}

                {!isLoading && !statusInfo && hasSearched && (
                    <Card className="text-center p-8 border-dashed">
                        <p className="text-muted-foreground">Could not find a ticket with that ID. Please check the number and try again.</p>
                    </Card>
                )}
            </div>
        </div>
    </div>
  );
}
