
"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getTicketByTicketId } from "@/lib/data";
import type { Ticket } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";
import { ArrowLeft, Badge, FileText, Wrench, Loader2, Save } from "lucide-react";
import { updateTicketStatus, UpdateTicketFormInput } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

const updateSchema = z.object({
    status: z.string().min(1, "Status is required"),
    notes: z.string().optional(),
});

const statusOptions = ['Received', 'Diagnosing', 'Awaiting Parts', 'In Repair', 'Ready for Pickup', 'Completed'];

export default function TicketDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const ticketId = typeof params.id === 'string' ? params.id : '';

    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<UpdateTicketFormInput>({
        resolver: zodResolver(updateSchema),
    });

    useEffect(() => {
        if (ticketId) {
            getTicketByTicketId(ticketId)
                .then(data => {
                    setTicket(data);
                    if (data) {
                        form.reset({ status: data.status, notes: '' });
                    }
                })
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, [ticketId, form]);

    const onSubmit = async (values: UpdateTicketFormInput) => {
        if (!ticket) return;
        setIsSubmitting(true);
        const result = await updateTicketStatus(ticket.ticket_id, values);
        if (result.success) {
            toast({ title: "Ticket Updated" });
            const updatedTicket = await getTicketByTicketId(ticketId);
            setTicket(updatedTicket);
            form.reset({ status: updatedTicket?.status, notes: '' });
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
        setIsSubmitting(false);
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <div className="grid gap-8 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-6">
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-48 w-full" />
                    </div>
                    <div className="space-y-6">
                        <Skeleton className="h-96 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="text-center">
                <h1 className="text-2xl font-bold">Ticket Not Found</h1>
                <p className="text-muted-foreground">The ticket with ID "{ticketId}" could not be found.</p>
                <Button onClick={() => router.push('/admin/tickets')} variant="outline" className="mt-4">
                    <ArrowLeft className="mr-2" />
                    Back to Tickets
                </Button>
            </div>
        );
    }
    
    const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
          case 'Completed': return 'default';
          case 'Ready for Pickup': return 'secondary';
          case 'Awaiting Parts': return 'destructive';
          case 'In Repair': case 'Diagnosing': return 'outline';
          default: return 'outline';
        }
    };


    return (
        <div className="space-y-6">
             <Button onClick={() => router.push('/admin/tickets')} variant="outline" size="sm">
                <ArrowLeft className="mr-2" />
                Back to All Tickets
            </Button>

            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Ticket <span className="font-mono text-primary">{ticket.ticket_id}</span></h1>
                    <p className="text-muted-foreground">Created on {format(new Date(ticket.created_at), 'PPP')}</p>
                </div>
                <Badge variant={getStatusVariant(ticket.status)} className="text-base capitalize">{ticket.status}</Badge>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Problem Details</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{ticket.problem_description}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Technician Notes</CardTitle></CardHeader>
                        <CardContent>
                            {ticket.notes && ticket.notes.length > 0 ? (
                                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                    {ticket.notes.map((note, index) => <li key={index}>{note}</li>)}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground">No notes have been added yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                     <Card>
                        <CardHeader><CardTitle>Customer & Device</CardTitle></CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div>
                                <p className="font-medium">Customer</p>
                                <p className="text-muted-foreground">{ticket.customer_name}</p>
                            </div>
                            <div>
                                <p className="font-medium">Contact</p>
                                <p className="text-muted-foreground">{ticket.mobile_number}</p>
                            </div>
                             <div>
                                <p className="font-medium">Address</p>
                                <p className="text-muted-foreground">{ticket.address}</p>
                            </div>
                             <div>
                                <p className="font-medium">Device</p>
                                <p className="text-muted-foreground">{ticket.brand} {ticket.model}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Update Status</CardTitle></CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                     <FormField control={form.control} name="status" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    {statusOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                    <FormField control={form.control} name="notes" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Add a Note (optional)</FormLabel>
                                            <FormControl><Textarea placeholder="e.g., Screen replacement completed." {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                                        {isSubmitting ? <Loader2 className="mr-2 animate-spin" /> : <Save className="mr-2" />}
                                        Save Update
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

