
"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { getTicketByTicketId } from "@/lib/data";
import type { Ticket } from "@/lib/data";

export type DiagnosisData = {
    ticketId: string;
    customerName: string;
};

export type DeviceFormInput = {
    brand: string;
    model: string;
    customerName: string;
    mobileNumber: string;
    address: string;
    problemDescription: string;
};

export async function createTicket(input: DeviceFormInput): Promise<DiagnosisData | null> {
    const supabase = createAdminClient();
    if(!supabase) return null;
    
    const ticketId = `DRX-${Math.floor(100000 + Math.random() * 900000)}`;
    try {
        const { error } = await supabase.from('tickets').insert([
          { 
            ticket_id: ticketId,
            customer_name: input.customerName,
            mobile_number: input.mobileNumber,
            address: input.address,
            brand: input.brand,
            model: input.model,
            problem_description: input.problemDescription,
            status: 'Received', // Initial status
          }
        ]);

        if (error) {
            console.error("Error creating ticket:", error);
            // Could add more specific error handling here
            return null;
        }
        
        return {
            ticketId,
            customerName: input.customerName,
        };
    } catch (error) {
        console.error("Error creating ticket:", error);
        return null;
    }
}

export async function getTicketStatusAction(ticketId: string): Promise<Ticket | null> {
    try {
        const ticket = await getTicketByTicketId(ticketId);
        return ticket;
    } catch (error) {
        console.error("Error fetching ticket status:", error);
        return null;
    }
}
