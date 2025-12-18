export const prerender = false;

interface Drop {
  category: string;
  title: string;
  description: string;
  url: string;
  code?: string;
}

export async function GET() {
  const timestamp = new Date().toISOString();

  // Featured Affiliate Deals
  const featuredAffiliate: Drop[] = [
    { category: 'CRYPTO', title: 'Ledger Hardware Wallet', url: 'https://shop.ledger.com/?r=5b26c17b2e98', description: 'Protect your digital assets with military-grade security' },
    { category: 'INVESTING', title: 'Acorns Investing - FREE $5', url: 'https://acorns.com/share/?shareable_code=CQ1T7GA&first_name=Brandon&friend_reward=5', description: 'Start investing spare change automatically' },
    { category: 'AI TOOLS', title: 'VEED - AI Video Editor', url: 'https://veed.sjv.io/7aj7Pr', description: 'Professional video editing powered by AI' },
    { category: 'STREAMING', title: 'Amazon Prime', url: 'https://amzn.to/48AEXgW', description: 'Free shipping, streaming & more' },
  ];

  // Discount Codes
  const featuredDiscounts: Drop[] = [
    { category: 'HOT DEALS', title: 'TEMU - $200 Coupon Bundle', url: 'https://temu.to/k/plk7nt89x6c', description: 'Massive savings coupon bundle', code: 'SAVE200' },
    { category: 'EXCLUSIVE', title: 'TEMU - Exclusive Deal', url: 'https://temu.to/k/pssqr37haqj', description: 'Special offer just for you' },
    { category: 'HOT DEALS', title: 'TEMU - Best Sellers', url: 'https://temu.to/k/pjbw6mpytbx', description: 'Shop the most popular items' },
  ];

  // Digital Products
  const featuredDigital: Drop[] = [
    { category: 'AUDIO', title: 'Audible Premium Plus', url: 'https://amzn.to/44p4Mhw', description: 'Unlimited audiobooks & originals' },
    { category: 'READING', title: 'Kindle Unlimited', url: 'https://amzn.to/3XhTl7x', description: 'Unlimited reading on any device' },
    { category: 'MUSIC', title: 'Amazon Music Unlimited', url: 'https://amzn.to/4rtHuBg', description: '100M+ songs ad-free' },
  ];

  // Crypto & Hosting
  const featuredCrypto: Drop[] = [
    { category: 'CRYPTO', title: 'Binance US - Trade Crypto', url: 'https://www.binance.us/universal_JHHGDSKDJ/auth/registration?ref=614205735', description: 'Trade 100+ cryptocurrencies with low fees' },
    { category: 'CRYPTO', title: 'BTCC Exchange', url: 'https://btcc.com/invite/Ufihz4l', description: 'Advanced crypto trading platform with bonuses' },
    { category: 'FREE STOCK', title: 'Robinhood - Get Free Stock', url: 'https://join.robinhood.com/brandol-06d7e3', description: 'Commission-free trading with sign-up bonus' },
  ];

  const data = {
    timestamp,
    featuredAffiliate,
    featuredDiscounts,
    featuredDigital,
    featuredCrypto,
  };

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
