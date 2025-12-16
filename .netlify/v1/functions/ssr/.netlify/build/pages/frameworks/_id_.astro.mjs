import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../../chunks/astro/server_CLrFXyZ3.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_DQDOyQfD.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  if (!id) {
    throw new Error("No framework id provided");
  }
  let framework;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${framework?.name} | Frameworks` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<article class="border-b pb-14 border-neutral-600"> <header class="flex flex-wrap items-center justify-between pb-2 mb-8 border-b"> <h1 class="mb-4 text-5xl font-bold">${framework?.name}</h1> <a${addAttribute(framework?.url, "href")} class="underline">Website &#8599;</a> </header> <figure> <img${addAttribute(`/.netlify/images?url=/images/${framework?.logo}`, "src")}${addAttribute(framework?.name, "alt")} class="mb-2 border rounded-sm border-neutral-500"> <figcaption class="font-mono text-xs">${framework?.name} logo</figcaption> </figure> <p class="py-6 text-xl">${framework?.description}</p> <form${addAttribute(`/api/frameworks/${framework?.id}/like`, "action")} method="post"> <h2 class="mb-2 text-2xl">Like ${framework?.name}!</h2> <p class="mb-4"> ${framework?.name} has ${framework?.likes} like${"s"}.
</p> <button type="submit" class="px-4 py-2 bg-green-500 rounded-sm text-neutral-800 hover:bg-green-600">Give ${framework?.name} your vote &starf;</button> </form> </article> ` })}`;
}, "/workspaces/Matrix-Hub/src/pages/frameworks/[id].astro", void 0);

const $$file = "/workspaces/Matrix-Hub/src/pages/frameworks/[id].astro";
const $$url = "/frameworks/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
