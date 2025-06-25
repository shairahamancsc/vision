"use server";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
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

// We need a server-side client to perform mutations.
// It's safe to use the service role key here as this is a server action.
function getSupabaseClientForActions(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || supabaseUrl.includes('YOUR_SUPABASE_URL') || !serviceKey || serviceKey.includes('YOUR_SUPABASE_SERVICE_KEY')) {
    console.warn('Supabase credentials for actions are not set or are placeholders. Please update your .env file.');
    return null;
  }
  return createClient(supabaseUrl, serviceKey);
}

export async function createTicket(input: DeviceFormInput): Promise<DiagnosisData | null> {
    const supabase = getSupabaseClientForActions();
    if (!supabase) {
        console.error("Cannot create ticket. Supabase client could not be initialized. Check your environment variables.");
        return null;
    }
    
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
