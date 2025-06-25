
"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { getTicketByTicketId } from "@/lib/data";
import type { Ticket } from "@/lib/data";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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

// Schemas for validation
const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  price: z.coerce.number().int().positive("Price must be a positive number"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  image: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  hint: z.string().optional(),
});
export type ProductFormInput = z.infer<typeof productSchema>;

const userSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    role: z.enum(["Admin", "Technician"]),
});
export type UserFormInput = z.infer<typeof userSchema>;

const updateTicketSchema = z.object({
    status: z.string().min(1, "Status is required"),
    notes: z.string().optional(),
});
export type UpdateTicketFormInput = z.infer<typeof updateTicketSchema>;


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

// Product Actions
export async function addProduct(formData: ProductFormInput) {
  const supabase = createAdminClient();
  if (!supabase) return { error: "Supabase client not initialized." };

  const result = productSchema.safeParse(formData);
  if (!result.success) {
    return { error: "Invalid data provided." };
  }

  const { error } = await supabase.from("products").insert([{ ...result.data }]);

  if (error) {
    console.error("Error adding product:", error);
    return { error: "Failed to add product." };
  }

  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteProduct(productId: number) {
    const supabase = createAdminClient();
    if (!supabase) return { error: "Supabase client not initialized." };

    const { error } = await supabase.from("products").delete().eq("id", productId);
    
    if (error) {
        console.error("Error deleting product:", error);
        return { error: "Failed to delete product." };
    }

    revalidatePath("/admin/products");
    return { success: true };
}


// User Actions
export async function addUser(formData: UserFormInput) {
    const supabase = createAdminClient();
    if (!supabase) return { error: "Supabase client not initialized." };

    const result = userSchema.safeParse(formData);
    if (!result.success) {
        return { error: "Invalid data provided." };
    }
    
    const id = `USR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const { error } = await supabase.from("users").insert([{
        id,
        ...result.data
    }]);

    if (error) {
        console.error("Error adding user:", error);
        return { error: "Failed to add user." };
    }

    revalidatePath("/admin/users");
    return { success: true };
}

export async function deleteUser(userId: string) {
    const supabase = createAdminClient();
    if (!supabase) return { error: "Supabase client not initialized." };

    const { error } = await supabase.from("users").delete().eq("id", userId);
    
    if (error) {
        console.error("Error deleting user:", error);
        return { error: "Failed to delete user." };
    }

    revalidatePath("/admin/users");
    return { success: true };
}

// Ticket Actions
export async function updateTicketStatus(ticketId: string, formData: UpdateTicketFormInput) {
    const supabase = createAdminClient();
    if (!supabase) return { error: "Supabase client not initialized." };
    
    const result = updateTicketSchema.safeParse(formData);
    if (!result.success) {
        return { error: "Invalid data provided." };
    }
    
    const { data: currentTicket, error: fetchError } = await supabase
        .from('tickets')
        .select('notes')
        .eq('ticket_id', ticketId)
        .single();
    
    if (fetchError) {
        console.error("Error fetching ticket for update:", fetchError);
        return { error: "Failed to find ticket to update." };
    }

    let newNotes = currentTicket.notes || [];
    if (result.data.notes && result.data.notes.trim() !== "") {
        newNotes.push(result.data.notes.trim());
    }

    const { error } = await supabase
        .from("tickets")
        .update({
            status: result.data.status,
            notes: newNotes,
        })
        .eq("ticket_id", ticketId);

    if (error) {
        console.error("Error updating ticket:", error);
        return { error: "Failed to update ticket." };
    }

    revalidatePath(`/admin/tickets`);
    revalidatePath(`/admin/tickets/${ticketId}`);
    return { success: true };
}

export async function deleteTicket(ticketId: number) {
    const supabase = createAdminClient();
    if (!supabase) return { error: "Supabase client not initialized." };

    const { error } = await supabase.from("tickets").delete().eq("id", ticketId);

    if (error) {
        console.error("Error deleting ticket:", error);
        return { error: "Failed to delete ticket." };
    }

    revalidatePath("/admin/tickets");
    return { success: true };
}
