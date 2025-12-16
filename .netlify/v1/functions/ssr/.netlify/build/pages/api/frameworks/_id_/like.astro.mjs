export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const POST = async ({ params, redirect }) => {
  const { id } = params;
  if (!id) {
    return new Response("No framework id provided", { status: 400 });
  }
  return new Response("No supabase url provided", { status: 400 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
