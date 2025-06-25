
import { createAdminClient } from '@/lib/supabase/server';

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
  id: number;
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

export async function getProducts(): Promise<Product[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase.from('products').select('*').order('name');
    if (error) {
      console.error('Database Error (getProducts):', error.message);
      return [];
    }
    return data || [];
  } catch (error: any) {
    console.error('Data Fetching Error (getProducts):', error.message);
    return [];
  }
}

export async function getUsers(): Promise<User[]> {
    const supabase = createAdminClient();
    if (!supabase) return [];
    
    try {
        const { data, error } = await supabase.from('users').select('*').order('name');
        if (error) {
            console.error('Database Error (getUsers):', error.message);
            return [];
        }
        return data || [];
    } catch (error: any) {
        console.error('Data Fetching Error (getUsers):', error.message);
        return [];
    }
}

export async function getMonthlySales(): Promise<MonthlySale[]> {
    const supabase = createAdminClient();
    if (!supabase) return [];

    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    try {
        const { data, error } = await supabase.from('monthly_sales').select('*');
        if (error) {
            console.error('Database Error (getMonthlySales):', error.message);
            return [];
        }
        // Sort data based on monthOrder
        const sortedData = (data || []).sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
        return sortedData;
    } catch (error: any) {
        console.error('Data Fetching Error (getMonthlySales):', error.message);
        return [];
    }
}

export async function getTickets(): Promise<Ticket[]> {
    const supabase = createAdminClient();
    if (!supabase) return [];

    try {
        const { data, error } = await supabase.from('tickets').select('*').order('created_at', { ascending: false });
        if (error) {
            console.error('Database Error (getTickets):', error.message);
            return [];
        }
        return data || [];
    } catch (error: any) {
        console.error('Data Fetching Error (getTickets):', error.message);
        return [];
    }
}

export async function getTicketByTicketId(ticketId: string): Promise<Ticket | null> {
    const supabase = createAdminClient();
    if (!supabase) return null;

    try {
        const { data, error } = await supabase.from('tickets').select('*').eq('ticket_id', ticketId).single();
        if (error) {
            // .single() throws an error if no row is found, which is expected.
            if (error.code !== 'PGRST116') {
                console.error('Database Error (getTicketByTicketId):', error.message);
            }
            return null;
        }
        return data;
    } catch (error: any) {
        console.error('Data Fetching Error (getTicketByTicketId):', error.message);
        return null;
    }
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
