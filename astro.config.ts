import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: 'static',
  site: 'https://matrix-hub.org',
  markdown: {
    shikiConfig: {
      theme: 'github-light-high-contrast',
    },
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
