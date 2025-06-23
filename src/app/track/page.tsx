"use client";

import { useState } from 'react';
import { TicketStatusForm } from '@/components/TicketStatusForm';
import { TicketStatusDisplay } from '@/components/TicketStatusDisplay';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export type StatusInfo = {
  ticketId: string;
  status: 'Received' | 'Diagnosing' | 'Awaiting Parts' | 'In Repair' | 'Ready for Pickup' | 'Completed';
  progress: number;
  estimatedCompletion: string;
  notes: string[];
};

export default function TrackPage() {
  const [statusInfo, setStatusInfo] = useState<StatusInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // This function should be connected to your backend to fetch real ticket data
  const fetchTicketStatus = async (ticketId: string) => {
    setIsLoading(true);
    setStatusInfo(null);
    setHasSearched(true);

    // TODO: Replace this with an actual API call to your Supabase backend
    // For now, we simulate a "not found" state
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency
    
    // Example of what a real implementation might look like:
    // try {
    //   const { data, error } = await supabase
    //     .from('tickets')
    //     .select('*')
    //     .eq('ticketId', ticketId)
    //     .single();
    //   if (error || !data) {
    //     setStatusInfo(null);
    //   } else {
    //     setStatusInfo(data);
    //   }
    // } catch (e) {
    //   setStatusInfo(null);
    // }

    setStatusInfo(null); // Default to not found
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
