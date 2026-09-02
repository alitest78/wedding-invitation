import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '5mb' }));

// Persistent Storage for Wedding Cards
const CARDS_FILE = path.join(__dirname, 'cards_storage.json');
let cardsStore = {};

try {
  if (fs.existsSync(CARDS_FILE)) {
    const raw = fs.readFileSync(CARDS_FILE, 'utf-8');
    cardsStore = JSON.parse(raw);
  }
} catch (e) {
  console.error('Error reading cards storage file:', e);
  cardsStore = {};
}

function saveStoreToFile() {
  try {
    fs.writeFileSync(CARDS_FILE, JSON.stringify(cardsStore, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving cards storage file:', e);
  }
}

// Generate short random code (e.g. 5-6 characters)
function generateShortCode(length = 6) {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// API: Save or Update Wedding Card & Generate Short ID
app.post('/api/cards', (req, res) => {
  try {
    const { wedding, customSlug } = req.body;
    if (!wedding) {
      return res.status(400).json({ error: 'اطلاعات کارت ارسال نشده است' });
    }

    let cardId = '';
    if (customSlug && typeof customSlug === 'string') {
      const sanitized = customSlug.trim().toLowerCase().replace(/[^a-z0-9\-_]/g, '-').replace(/-+/g, '-').slice(0, 30);
      if (sanitized.length >= 2) {
        cardId = sanitized;
      }
    }

    if (!cardId) {
      cardId = generateShortCode(6);
    }

    cardsStore[cardId] = {
      wedding,
      updatedAt: new Date().toISOString(),
    };
    saveStoreToFile();

    const host = req.get('host') || `localhost:${PORT}`;
    const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;

    res.json({
      success: true,
      id: cardId,
      guestUrl: `${baseUrl}/?c=${cardId}&mode=guest`,
      adminUrl: `${baseUrl}/?c=${cardId}&mode=admin`,
      shortUrl: `${baseUrl}/?c=${cardId}`,
    });
  } catch (err) {
    console.error('Error saving card:', err);
    res.status(500).json({ error: 'خطا در ذخیره‌سازی کارت' });
  }
});

// API: Get Wedding Card by ID
app.get('/api/cards/:id', (req, res) => {
  const { id } = req.params;
  const card = cardsStore[id];
  if (!card) {
    return res.status(404).json({ error: 'کارت مورد نظر یافت نشد' });
  }
  res.json({ success: true, wedding: card.wedding, updatedAt: card.updatedAt });
});

// Short URL Route Redirection (/c/:id -> /?c=:id)
app.get('/c/:id', (req, res) => {
  const { id } = req.params;
  res.redirect(302, `/?c=${encodeURIComponent(id)}&mode=guest`);
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Wedding Invitation Server running on port ${PORT}`);
});

