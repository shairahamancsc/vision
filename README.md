# Firebase Studio - Device Rx

This is a Next.js starter app for a device repair shop, built in Firebase Studio. It includes features for creating repair tickets, tracking repair status, and an admin dashboard for managing the business.

## Deployment with Vercel and Supabase

This project is set up for easy deployment with Vercel and Supabase.

### 1. Set up Supabase

1.  Go to [Supabase](https://supabase.com/) and create a new project.
2.  Navigate to your project's **Settings > API**.
3.  Copy your **Project URL** and **public anon key**. You will need these for your environment variables.
4.  Go to the **SQL Editor** in your Supabase dashboard and run the following queries to create the necessary tables.

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

### 2. Deploy to Vercel

1.  Click the "Deploy with Vercel" button or push your code to a Git repository (GitHub, GitLab, Bitbucket).
2.  Import your project into Vercel.
3.  Vercel will detect that you are using Next.js and configure the build settings automatically.
4.  Go to your project's **Settings > Environment Variables** in Vercel.
5.  Add the following environment variables using the values you got from Supabase:
    *   `NEXT_PUBLIC_SUPABASE_URL` (Your project URL)
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Your public anon key)
    *   `GOOGLE_API_KEY` (if you are using Google AI services)
6.  Deploy! Vercel will build and deploy your application. You can now connect the frontend components to fetch data from your new Supabase tables.
