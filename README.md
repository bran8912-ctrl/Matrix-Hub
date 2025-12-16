# Astro Supabase Starter

![Astro Supabase Starter Preview](astro-supabase-starter-preview.png)

The Astro Supabase starter demonstrates how to integrate **Supabase** into an Astro project.

## Deployment

This starter can be deployed to any Node-compatible hosting provider that supports static + server output (for example: Vercel, Render, or self-hosted Node servers). If you previously used Netlify-specific features (image proxy, Netlify extensions), these have been removed in favor of a generic Node setup.

If you want a one-click deploy experience, add your hosting provider's deploy button or instructions here.

## Astro Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Developing Locally

| Prerequisites                                                                |
| :--------------------------------------------------------------------------- |
| [Node.js](https://nodejs.org/) v18.14+                                       |
| (optional) [nvm](https://github.com/nvm-sh/nvm) for Node version management  |
| [Supabase account](https://supabase.com/)                                    |

### Set up the database

To use this template, you’ll need to set up and seed a new Supabase database.

1. Create a new Supabase project.
2. Run the SQL commands found in the `supabase/migrations` directory in the Supabase UI.
3. To seed the database with data, you can import the contents of the `supabase/seed.csv` file in the Supabase UI.

ℹ️ _Note: This template was created to be used with the Supabase extension for Netlify. If you don’t wish to use the Netlify Supabase extension, you will need to set the `SUPABASE_DATABASE_URL` and `SUPABASE_ANON_KEY` environment variables in the `.env` file._

### Install and run locally

1. Clone this repository, then run `npm install` in its root directory.

2. For local development, run the Astro dev server:

```
npm run dev
```

If you prefer to emulate a production-like environment locally, use your host's recommended tooling (for example, Vercel CLI or Render's local runner).

## Support

If you get stuck along the way, get help in our [support forums](https://answers.netlify.com/).
