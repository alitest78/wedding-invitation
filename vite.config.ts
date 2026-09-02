import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

async function shortenWithExternalServices(longUrl: string, customAlias = '') {
  // 1. Try TinyURL
  try {
    let tinyUrlEndpoint = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`;
    if (customAlias) {
      tinyUrlEndpoint += `&alias=${encodeURIComponent(customAlias)}`;
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(tinyUrlEndpoint, { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      const text = await res.text();
      if (text.startsWith('http')) {
        return { shortUrl: text.trim(), service: 'TinyURL' };
      }
    }
  } catch (e) {
    // try next
  }

  // 2. Try is.gd
  try {
    let isgdEndpoint = `https://is.gd/create.php?format=simple&url=${encodeURIComponent(longUrl)}`;
    if (customAlias) {
      isgdEndpoint += `&shorturl=${encodeURIComponent(customAlias)}`;
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(isgdEndpoint, { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      const text = await res.text();
      if (text.startsWith('http')) {
        return { shortUrl: text.trim(), service: 'is.gd' };
      }
    }
  } catch (e) {
    // try next
  }

  // 3. Try clck.ru
  try {
    const clckEndpoint = `https://clck.ru/--?url=${encodeURIComponent(longUrl)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(clckEndpoint, { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      const text = await res.text();
      if (text.startsWith('http')) {
        return { shortUrl: text.trim(), service: 'clck.ru' };
      }
    }
  } catch (e) {
    // fallback
  }

  return null;
}

function cardsDevPlugin(): Plugin {
  const CARDS_FILE = path.resolve(__dirname, 'cards_storage.json');
  let cardsStore: Record<string, any> = {};

  try {
    if (fs.existsSync(CARDS_FILE)) {
      cardsStore = JSON.parse(fs.readFileSync(CARDS_FILE, 'utf-8'));
    }
  } catch (e) {
    cardsStore = {};
  }

  function saveStore() {
    try {
      fs.writeFileSync(CARDS_FILE, JSON.stringify(cardsStore, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save cards storage', e);
    }
  }

  return {
    name: 'cards-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';

        // POST /api/shorten
        if (req.method === 'POST' && url.startsWith('/api/shorten')) {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const { url: longUrl, alias } = JSON.parse(body || '{}');
              const shortened = await shortenWithExternalServices(longUrl, alias);
              res.setHeader('Content-Type', 'application/json');
              if (shortened) {
                res.end(JSON.stringify({ success: true, shortUrl: shortened.shortUrl, service: shortened.service }));
              } else {
                res.end(JSON.stringify({ success: false, shortUrl: longUrl }));
              }
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'خطا در کوتاه کردن لینک' }));
            }
          });
          return;
        }

        // POST /api/cards
        if (req.method === 'POST' && url.startsWith('/api/cards')) {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const { wedding, customSlug } = parsed;
              let cardId = '';
              if (customSlug && typeof customSlug === 'string') {
                const sanitized = customSlug.trim().toLowerCase().replace(/[^a-z0-9\-_]/g, '-').replace(/-+/g, '-').slice(0, 30);
                if (sanitized.length >= 2) {
                  cardId = sanitized;
                }
              }
              if (!cardId) {
                const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
                for (let i = 0; i < 6; i++) {
                  cardId += chars.charAt(Math.floor(Math.random() * chars.length));
                }
              }

              cardsStore[cardId] = {
                wedding,
                updatedAt: new Date().toISOString()
              };
              saveStore();

              const host = req.headers.host || 'localhost:3000';
              const protocol = 'https';
              const baseUrl = `${protocol}://${host}`;
              const directGuestUrl = `${baseUrl}/?c=${cardId}&mode=guest`;

              let ultraShortUrl = directGuestUrl;
              let shortService = 'Direct';

              try {
                const shortened = await shortenWithExternalServices(directGuestUrl, customSlug);
                if (shortened) {
                  ultraShortUrl = shortened.shortUrl;
                  shortService = shortened.service;
                }
              } catch (e) {
                // ignore
              }

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                id: cardId,
                guestUrl: directGuestUrl,
                adminUrl: `${baseUrl}/?c=${cardId}&mode=admin`,
                shortUrl: `${baseUrl}/?c=${cardId}`,
                ultraShortUrl,
                shortService
              }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'خطا در پردازش اطلاعات' }));
            }
          });
          return;
        }

        // GET /api/cards/:id
        if (req.method === 'GET' && url.startsWith('/api/cards/')) {
          const id = url.replace('/api/cards/', '').split('?')[0];
          const card = cardsStore[id];
          res.setHeader('Content-Type', 'application/json');
          if (!card) {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'کارت یافت نشد' }));
          } else {
            res.end(JSON.stringify({ success: true, wedding: card.wedding }));
          }
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), cardsDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
