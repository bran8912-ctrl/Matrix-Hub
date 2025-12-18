import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: 'server',
  markdown: {
    shikiConfig: {
      theme: 'github-light-high-contrast',
    },
  },
  vite: {
    plugins: [tailwindcss()]
  },
  adapter: node({ mode: 'standalone' })
});
