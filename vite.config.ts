import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

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
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';

        // POST /api/cards
        if (req.method === 'POST' && url.startsWith('/api/cards')) {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', () => {
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

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                id: cardId,
                guestUrl: `${baseUrl}/?c=${cardId}&mode=guest`,
                adminUrl: `${baseUrl}/?c=${cardId}&mode=admin`,
                shortUrl: `${baseUrl}/?c=${cardId}`
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
