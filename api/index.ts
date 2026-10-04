import app from '../server';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

/**
 * Universal Vercel Serverless Function Plugin & Router Handler
 * Ensures that API calls from Vercel (COD confirmations, Razorpay orders, Delhivery sync)
 * are NEVER dropped, misrouted, or 404'd regardless of rewrite scheme or serverless container state.
 */
export default function handler(req: any, res: any) {
  // 1. Universal CORS for Vercel, Localhost & Custom Domains
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control'
  );
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  // 2. Extract and Normalize Rewritten Subpaths
  let subPath = '';

  const q = req.query || {};
  if (q.match) {
    subPath = Array.isArray(q.match) ? q.match.join('/') : String(q.match);
  } else if (q.path) {
    subPath = Array.isArray(q.path) ? q.path.join('/') : String(q.path);
  } else if (q.route) {
    subPath = Array.isArray(q.route) ? q.route.join('/') : String(q.route);
  } else if (q.slug) {
    subPath = Array.isArray(q.slug) ? q.slug.join('/') : String(q.slug);
  }

  if (subPath) {
    const cleanSub = subPath.replace(/^\/+/, '');
    req.url = `/api/${cleanSub}`;
    req.originalUrl = req.url;
  } else {
    // 3. Check Vercel original URL headers
    const vercelOriginal =
      req.headers['x-matched-path'] ||
      req.headers['x-vercel-original-url'] ||
      req.headers['x-forwarded-url'] ||
      req.headers['x-now-route-matches'];

    if (vercelOriginal && typeof vercelOriginal === 'string') {
      if (vercelOriginal.startsWith('/api/') || vercelOriginal.startsWith('/orders') || vercelOriginal.startsWith('/create-order')) {
        req.url = vercelOriginal.startsWith('/api') ? vercelOriginal : `/api${vercelOriginal}`;
        req.originalUrl = req.url;
      }
    }
  }

  // 4. Safe body normalization if upstream runtime parsed it into a string or Buffer
  if (req.body && typeof req.body === 'string') {
    try {
      req.body = JSON.parse(req.body);
    } catch {}
  }

  // 5. Invoke Express application instance
  return app(req, res);
}
