"use client";

import { useState } from 'react';
import { TicketStatusForm } from '@/components/TicketStatusForm';
import { TicketStatusDisplay } from '@/components/TicketStatusDisplay';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';

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

  // Mock function to "fetch" ticket status
  const fetchTicketStatus = (ticketId: string) => {
    setIsLoading(true);
    setStatusInfo(null);
    setHasSearched(true);

    // Simulate network delay
    setTimeout(() => {
        // Simple hash to get a deterministic but "random" status
        const hash = ticketId.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
        const statuses: StatusInfo['status'][] = ['Received', 'Diagnosing', 'Awaiting Parts', 'In Repair', 'Ready for Pickup', 'Completed'];
        const notesByStatus = {
            'Received': ['Device checked in and ticket created.'],
            'Diagnosing': ['Our technician is currently diagnosing the issue.', 'Initial tests are being run.'],
            'Awaiting Parts': ['A required component has been ordered.', 'Expected arrival in 3-5 business days.'],
            'In Repair': ['Repair is in progress.', 'The faulty component is being replaced.'],
            'Ready for Pickup': ['Your device has been repaired and is ready for pickup.', 'Please bring your ticket for collection.'],
            'Completed': ['Device collected by customer.'],
        };
        const statusIndex = Math.abs(hash) % statuses.length;
        const currentStatus = statuses[statusIndex];

        const today = new Date();
        const completionDate = new Date(today);
        completionDate.setDate(today.getDate() + (Math.abs(hash) % 5) + 1);
        
        const newStatus: StatusInfo = {
            ticketId,
            status: currentStatus,
            progress: (statusIndex + 1) / statuses.length * 100,
            estimatedCompletion: completionDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            notes: notesByStatus[currentStatus] || ['No updates at this time.'],
        };

        setStatusInfo(newStatus);
        setIsLoading(false);
    }, 1000);
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
