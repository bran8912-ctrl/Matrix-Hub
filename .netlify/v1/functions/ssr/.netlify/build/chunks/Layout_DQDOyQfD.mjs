import { c as createComponent, a as createAstro, m as maybeRenderHead, b as renderTemplate, h as renderHead, r as renderComponent, i as renderSlot } from './astro/server_CLrFXyZ3.mjs';
import 'piccolore';
/* empty css                        */
import 'clsx';

const $$Astro$2 = createAstro();
const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Footer;
  return renderTemplate`${maybeRenderHead()}<footer class="max-w-4xl mx-auto mt-12"> <a href="https://docs.netlify.com/frameworks/astro/" class="text-base underline">
Astro on Netlify
</a> </footer>`;
}, "/workspaces/Matrix-Hub/src/components/Footer.astro", void 0);

const $$Astro$1 = createAstro();
const $$Header = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Header;
  return renderTemplate`${maybeRenderHead()}<header class="max-w-4xl mx-auto mt-6 mb-16"> <nav class="flex justify-between items-center"> <a href="/" class="text-2xl font-bold hover:underline hover:underline-offset-4 hover:decoration-green-500"><span class="text-green-500">&#10022;</span> Astro Supabase Starter
</a> <a href="https://acorns.com/share/?shareable_code=CQ1T7GA&first_name=Brandon&friend_reward=5" target="_blank" rel="noopener noreferrer" class="px-4 py-2 text-sm font-medium bg-green-600 rounded-lg hover:bg-green-700 transition-colors">Acorns
</a> </nav> </header>`;
}, "/workspaces/Matrix-Hub/src/components/Header.astro", void 0);

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title>${renderHead()}</head> <body class="px-4 antialiased bg-neutral-800 sm:px-8 text-white"> ${renderComponent($$result, "Header", $$Header, {})} <main class="w-full max-w-4xl mx-auto grow"> ${renderSlot($$result, $$slots["default"])} </main> ${renderComponent($$result, "Footer", $$Footer, {})} </body></html>`;
}, "/workspaces/Matrix-Hub/src/components/Layout.astro", void 0);

export { $$Layout as $ };
