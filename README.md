# Firebase Studio - Device Rx

This is a Next.js starter app for a device repair shop, built in Firebase Studio. It includes features for creating repair tickets, tracking repair status, and an admin dashboard for managing the business.

## Getting Started

### 1. Set up Supabase

1.  Go to [Supabase](https://supabase.com/) and create a new project.
2.  Navigate to your project's **Settings > API**.
3.  Keep this page open. You'll need the **Project URL**, **public `anon` key**, and **`service_role` secret** for the next steps.
4.  Go to the **SQL Editor** in your Supabase dashboard and run the SQL queries from the "Database Schema" section below to create the necessary tables.

### 2. Set up your Local Environment

1.  This project uses a `.env` file to store your Supabase credentials for local development.
2.  The `.env` file in your project should contain the following variables. Replace the placeholder values with the credentials you copied from your Supabase API settings.

    ```bash
    # Supabase Project URL
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL_HERE
    # Supabase Public Anon Key
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE
    # Supabase Service Role Secret (Keep this secret!)
    SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_KEY_HERE
    ```

3.  Install dependencies and run the development server:
    ```bash
    npm install
    npm run dev
    ```

### 3. Deploy to Vercel (Optional)

1.  Push your code to a Git repository (GitHub, GitLab, Bitbucket) and import it into Vercel.
2.  Go to your project's **Settings > Environment Variables** in Vercel.
3.  Add the same environment variables from your `.env` file.
4.  Deploy!

## Database Schema

Run these queries in the **SQL Editor** in your Supabase dashboard.

**Products Table:**
```sql
CREATE TABLE products (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  price INT NOT NULL,
  stock INT NOT NULL,
  image TEXT,
  hint TEXT
);
-- Optional: Insert some sample data
INSERT INTO products (name, price, stock, image, hint) VALUES
('Premium Screen Protector', 1499, 150, 'https://placehold.co/300x300.png', 'screen protector'),
('USB-C Fast Charger', 1999, 80, 'https://placehold.co/300x300.png', 'charging cable');
```

**Users Table:**
```sql
-- Note: For a real application, you should use Supabase Auth for user management.
-- This table is a simplified example for the admin dashboard.
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  lastLogin TIMESTAMPTZ
);
-- Optional: Insert some sample data
INSERT INTO users (id, name, email, role, lastLogin) VALUES
('USR-001', 'Rohan Kumar', 'rohan.k@example.com', 'Admin', NOW()),
('USR-002', 'Priya Sharma', 'priya.s@example.com', 'Technician', NOW());
```

**Sales Table (for the chart):**
```sql
CREATE TABLE monthly_sales (
  month TEXT PRIMARY KEY,
  sales INT NOT NULL
);
-- Optional: Insert some sample data
INSERT INTO monthly_sales (month, sales) VALUES
('Jan', 400000), ('Feb', 300000), ('Mar', 500000),
('Apr', 450000), ('May', 600000), ('Jun', 550000);
```

**Tickets Table:**
```sql
CREATE TABLE tickets (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  ticket_id TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  address TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  problem_description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Received',
  notes TEXT[] DEFAULT ARRAY[]::TEXT[],
  estimated_completion DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Optional: Insert some sample data
INSERT INTO tickets (ticket_id, customer_name, mobile_number, address, brand, model, problem_description, status, notes, estimated_completion) VALUES
('DRX-123456', 'Rohan Kumar', '9876543210', '123 MG Road, Bangalore', 'Apple', 'iPhone 14 Pro', 'Screen is cracked.', 'In Repair', ARRAY['Screen replacement ordered.'], '2024-07-30'),
('DRX-654321', 'Priya Sharma', '8765432109', '456 Koramangala, Bangalore', 'Samsung', 'Galaxy S23', 'Battery drains very quickly.', 'Diagnosing', ARRAY['Initial tests running.'], '2024-07-28');
```
