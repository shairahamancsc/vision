"use client";

import { TicketStatusForm } from "@/components/TicketStatusForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminTicketsPage() {
  const handleTrack = (ticketId: string) => {
    // In a real app, you would fetch and display ticket details here
    // For now, we just log it. The form will show validation.
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Manage Tickets</h1>
      <Card>
        <CardHeader>
          <CardTitle>Find a Ticket</CardTitle>
          <CardDescription>
            Enter a ticket ID to view its status and history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Re-using the existing component for the search form */}
          <TicketStatusForm onTrack={handleTrack} isLoading={false} />
          {/* In a real application, a results section would appear below */}
        </CardContent>
      </Card>
    </div>
  )
}
