import { createClient } from '@supabase/supabase-js';

// This client is used for server-side data fetching.
// It uses the service role key, which bypasses RLS.
// Ensure this code is only run on the server.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Define types for our data
export type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
  hint: string;
};

export type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    lastLogin: string;
};

export type MonthlySale = {
    month: string;
    sales: number;
}

export async function getProducts(): Promise<Product[]> {
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

export async function getStats() {
    const [products, users, sales] = await Promise.all([
        getProducts(),
        getUsers(),
        getMonthlySales()
    ]);

    const totalRevenue = sales.reduce((sum, current) => sum + current.sales, 0);
    const activeUsers = users.length;
    const productsInStock = products.reduce((sum, current) => sum + current.stock, 0);

    // Hardcoded values for data not yet in the database
    const openTickets = 235;
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
