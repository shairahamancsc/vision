
import { createAdminClient } from '@/lib/supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';

// Define types for our data
export type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string | null;
  hint: string | null;
};

export type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    lastLogin: string | null;
};

export type MonthlySale = {
    month: string;
    sales: number;
}

export type Ticket = {
  id:number;
  ticket_id: string;
  customer_name: string;
  mobile_number: string;
  address: string;
  brand: string;
  model: string;
  problem_description: string;
  status: string;
  notes: string[] | null;
  estimated_completion: string | null;
  created_at: string;
};

/**
 * This generic function wraps Supabase queries to centralize client creation and error handling.
 * @param query A function that takes a Supabase client and returns a query promise.
 * @returns The data from the query, or null if an error occurs or the client isn't available.
 */
async function executeQuery<T>(
  query: (
    client: SupabaseClient
  ) => PromiseLike<{ data: T | null; error: any }>
): Promise<T | null> {
  const supabase = createAdminClient();
  if (!supabase) {
    // The warning is already logged in createAdminClient, so we just return null.
    return null;
  }

  try {
    const { data, error } = await query(supabase);

    if (error) {
      // Don't log an error if a single record is not found (PGRST116) or if a table doesn't exist (42P01),
      // as these are expected conditions during initial setup or for certain queries.
      if (error.code !== 'PGRST116' && error.code !== '42P01') {
        console.error('Database Error:', error.message);
      }
      return null;
    }
    return data;
  } catch (e: any) {
    console.error('Unexpected Data Fetching Error:', e.message);
    return null;
  }
}

export async function getProducts(): Promise<Product[]> {
  const data = await executeQuery(supabase => 
    supabase.from('products').select('*').order('name')
  );
  return data || [];
}

export async function getUsers(): Promise<User[]> {
  const data = await executeQuery(supabase =>
    supabase.from('users').select('*').order('name')
  );
  return data || [];
}

export async function getMonthlySales(): Promise<MonthlySale[]> {
  const data = await executeQuery(supabase =>
    supabase.from('monthly_sales').select('*')
  );
  
  if (!data) return [];

  // Sort data chronologically since the database doesn't guarantee order.
  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return [...data].sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
}

export async function getTickets(): Promise<Ticket[]> {
  const data = await executeQuery(supabase =>
    supabase.from('tickets').select('*').order('created_at', { ascending: false })
  );
  return data || [];
}

export async function getTicketByTicketId(ticketId: string): Promise<Ticket | null> {
  const data = await executeQuery(supabase =>
    supabase.from('tickets').select('*').eq('ticket_id', ticketId).single()
  );
  return data;
}

export async function getStats() {
    const [products, users, sales, tickets] = await Promise.all([
        getProducts(),
        getUsers(),
        getMonthlySales(),
        getTickets()
    ]);

    const totalRevenue = sales.reduce((sum, current) => sum + current.sales, 0);
    const activeUsers = users.length;
    const productsInStock = products.reduce((sum, current) => sum + current.stock, 0);
    const openTickets = tickets.filter(t => t.status !== 'Completed').length;

    // Hardcoded values for data not yet in the database
    const revenueGrowth = "+20.1%";
    const ticketGrowth = "+18.1%";

    return {
        totalRevenue,
        activeUsers,
        productsInStock,
        openTickets,
        revenueGrowth,
        ticketGrowth
    }
}
