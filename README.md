# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Deployment with Vercel and Supabase

This project is set up for easy deployment with Vercel and Supabase.

### 1. Set up Supabase

1.  Go to [Supabase](https://supabase.com/) and create a new project.
2.  Navigate to your project's **Settings > API**.
3.  You will find your **Project URL** and **public anon key**.

### 2. Deploy to Vercel

1.  Click the "Deploy with Vercel" button or push your code to a Git repository (GitHub, GitLab, Bitbucket).
2.  Import your project into Vercel.
3.  Vercel will detect that you are using Next.js and configure the build settings automatically.
4.  Go to your project's **Settings > Environment Variables** in Vercel.
5.  Add the following environment variables using the values you got from Supabase:
    *   `NEXT_PUBLIC_SUPABASE_URL`
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    *   `GOOGLE_API_KEY` (if you are using Google AI services)
6.  Deploy! Vercel will build and deploy your application.
