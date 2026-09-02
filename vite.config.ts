import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

async function shortenWithExternalServices(longUrl: string, customAlias = '', preferredService = 'clck') {
  // 1. Try clck.ru (Unblocked in Iran)
  if (preferredService === 'clck' || preferredService === 'auto') {
    try {
      const clckEndpoint = `https://clck.ru/--?url=${encodeURIComponent(longUrl)}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(clckEndpoint, { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) {
        const text = await res.text();
        if (text.startsWith('http')) {
          return { shortUrl: text.trim(), service: 'clck.ru (بدون فیلتر در ایران)' };
        }
      }
    } catch (e) {
      // try next
    }
  }

  // 2. Try is.gd
  if (preferredService === 'isgd' || preferredService === 'auto' || preferredService === 'clck') {
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
          return { shortUrl: text.trim(), service: 'is.gd (جهانی)' };
        }
      }
    } catch (e) {
      // try next
    }
  }

  // 3. Try da.gd
  try {
    const dagdEndpoint = `https://da.gd/s?url=${encodeURIComponent(longUrl)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(dagdEndpoint, { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      const text = await res.text();
      if (text.startsWith('http')) {
        return { shortUrl: text.trim(), service: 'da.gd' };
      }
    }
  } catch (e) {
    // fallback
  }

  return null;
}

function cardsDevPlugin(): Plugin {
  const CARDS_FILE = path.resolve(__dirname, 'cards_storage.json');
  const RSVPS_FILE = path.resolve(__dirname, 'rsvps_storage.json');
  const UPLOADS_DIR = path.resolve(__dirname, 'public', 'uploads');

  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  let cardsStore: Record<string, any> = {};
  let rsvpsStore: any[] = [];

  try {
    if (fs.existsSync(CARDS_FILE)) {
      cardsStore = JSON.parse(fs.readFileSync(CARDS_FILE, 'utf-8'));
    }
  } catch (e) {
    cardsStore = {};
  }

  try {
    if (fs.existsSync(RSVPS_FILE)) {
      rsvpsStore = JSON.parse(fs.readFileSync(RSVPS_FILE, 'utf-8'));
    }
  } catch (e) {
    rsvpsStore = [];
  }

  function saveStore() {
    try {
      fs.writeFileSync(CARDS_FILE, JSON.stringify(cardsStore, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save cards storage', e);
    }
  }

  function saveRsvps() {
    try {
      fs.writeFileSync(RSVPS_FILE, JSON.stringify(rsvpsStore, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save rsvps storage', e);
    }
  }

  return {
    name: 'cards-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';

        // POST /api/upload-audio
        if (req.method === 'POST' && url.startsWith('/api/upload-audio')) {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const { data, filename = 'custom-music.mp3' } = JSON.parse(body || '{}');
              if (!data) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'داده صوتی ارسال نشده است' }));
                return;
              }

              let base64Data = data;
              let ext = '.mp3';
              if (data.includes(';base64,')) {
                const parts = data.split(';base64,');
                const mime = parts[0];
                base64Data = parts[1];
                if (mime.includes('audio/mp4') || mime.includes('audio/m4a') || mime.includes('audio/x-m4a')) {
                  ext = '.m4a';
                } else if (mime.includes('audio/wav') || mime.includes('audio/x-wav')) {
                  ext = '.wav';
                } else if (mime.includes('audio/ogg')) {
                  ext = '.ogg';
                } else if (mime.includes('audio/aac')) {
                  ext = '.aac';
                }
              }

              const uniqueId = `audio_${Date.now()}_${Math.random().toString(36).substring(2, 6)}${ext}`;
              const filePath = path.join(UPLOADS_DIR, uniqueId);
              fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                url: `/uploads/${uniqueId}`,
                filename: filename || uniqueId
              }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'خطا در بارگذاری فایل صوتی' }));
            }
          });
          return;
        }

        // GET /api/rsvps
        if (req.method === 'GET' && url.startsWith('/api/rsvps')) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, rsvps: rsvpsStore }));
          return;
        }

        // POST /api/rsvps/like
        if (req.method === 'POST' && url.startsWith('/api/rsvps/like')) {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const { id } = JSON.parse(body || '{}');
              rsvpsStore = rsvpsStore.map(r => r.id === id ? { ...r, likes: (r.likes || 0) + 1 } : r);
              saveRsvps();
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, rsvps: rsvpsStore }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'خطا در ثبت لایک' }));
            }
          });
          return;
        }

        // POST /api/rsvps
        if (req.method === 'POST' && url.startsWith('/api/rsvps')) {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const { guestName, attending, guestCount, congratulationMessage } = JSON.parse(body || '{}');
              const newRsvp = {
                id: Date.now().toString(),
                guestName: guestName.trim(),
                attending: attending || 'yes',
                guestCount: attending === 'yes' ? (Number(guestCount) || 1) : 0,
                congratulationMessage: (congratulationMessage || '').trim() || 'با آرزوی خوشبختی و شادکامی برای عروس و داماد عزیز 🌸',
                createdAt: 'همین الان',
                likes: 1,
              };
              rsvpsStore = [newRsvp, ...rsvpsStore];
              saveRsvps();
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, rsvps: rsvpsStore, newRsvp }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'خطا در ثبت پیام' }));
            }
          });
          return;
        }

        // DELETE /api/rsvps/:id
        if (req.method === 'DELETE' && url.startsWith('/api/rsvps/')) {
          const id = url.replace('/api/rsvps/', '').split('?')[0];
          rsvpsStore = rsvpsStore.filter(r => r.id !== id);
          saveRsvps();
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, rsvps: rsvpsStore }));
          return;
        }

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
