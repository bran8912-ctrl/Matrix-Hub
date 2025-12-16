---
title: Set up Supabase database
---

1. Create Supabase account at [Supabase.com](https://supabase.com).
2. After signing up to your Supabase account, click New project from your dashboard. Select your organization, give the project a name, generate a new password for the database, and select the us-east-1 region.

## Create the frameworks table

Once the database is provisioned, we can create the **frameworks** table. From your project dashboard, open the SQL editor.

![Create the frameworks table](/images/guides/supabase-sql-editor.png)

Run the following commands in the SQL editor to create the **frameworks** table.

```sql
CREATE TABLE frameworks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT NOT NULL,
  logo TEXT NOT NULL,
  likes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Add data

Next, let’s add some starter data to the **frameworks** table. From the Table Editor in Supabase (1), choose the **frameworks** table from the list (2) and then select **Insert > Import** data from CSV (3).

![Create the frameworks table](/images/guides/supabase-import-csv.png)

Paste the following data:

```sql
name,url,logo,likes,description
Astro,https://astro.build/,astro.svg,0,"Astro is a fresh but familiar approach to building websites. Astro combines decades of proven performance best practices with the DX improvements of the component-oriented era."
Eleventy,https://svelte.dev/,eleventy.svg,0,"Eleventy (11ty) is a flexible, minimalist static site generator that builds fast, content-driven websites using multiple templating languages and a zero-client-JavaScript philosophy."
Gatsby,https://www.gatsbyjs.com/,gatsby.svg,0,"Gatsby.js is a React-based framework for building fast, SEO-friendly websites and applications with powerful data integration and static site generation capabilities."
Next,https://nextjs.org/,next.svg,0,"Next.js enables you to create high-quality web applications with the power of React components."
Nuxt,https://nuxt.com/,nuxt.svg,0,"Nuxt is an open source framework that makes web development intuitive and powerful. Create performant and production-grade full-stack web apps and websites with confidence."
Remix,https://remix.run/,remix.svg,0,"Remix is a React framework designed for server-side rendering (SSR). Is a full-stack web framework, allowing developers to build both backend and frontend within a single app."
Svelte,https://svelte.dev/,svelte.svg,0,"Svelte is a UI framework that uses a compiler to let you write breathtakingly concise components that do minimal work in the browser, using languages you already know — HTML, CSS and JavaScript."
```

This will give you a preview of the data that will be inserted into the database. Click **Import data** to add the data to the database.

## Configure Supabase access

To let this site read from your Supabase project in development and production, set the required environment variables:

- `SUPABASE_DATABASE_URL` (or `SUPABASE_URL` depending on your Supabase setup)
- `SUPABASE_ANON_KEY`

For local development, create a `.env` file in the project root and add these values. For deployments, configure the environment variables in your hosting provider's dashboard.

![Configure Supabase access](/images/guides/supabase-connect-oauth.png)

## Deploy the site

Deploy the site using your hosting provider's deploy flow. After the deployment finishes, visit your production URL to confirm the frameworks you added are visible.

![Deploy template](/images/guides/deploy-button.png)

![Template with data](/images/guides/web-frameworks.png)
