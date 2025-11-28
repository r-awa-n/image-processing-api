import express from 'express';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const app = express();
const port = 3000;

// مجلدات الصور
const fullDir = path.join(__dirname, '..', 'images', 'full');
const thumbDir = path.join(__dirname, '..', 'images', 'thumb');

// تأكد أن thumbs موجود
if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

// جلب أول صورة موجودة
const getFirstImage = (): string | null => {
  try {
    const files = fs.readdirSync(fullDir).filter(f => /\.(jpe?g|png)$/i.test(f));
    if (files.length === 0) return null;
    return files[0]!; // ← non-null assertion لحل خطأ TypeScript
  } catch {
    return null;
  }
};

// / → إعادة التوجيه للنسخة المصغرة
app.get('/', (req, res) => {
  const img = getFirstImage();
  if (!img) return res.send('No images found');
  return res.redirect(`/image?name=${img}&width=200&height=200`);
});

// /image → عرض الصورة أو resize
app.get('/image', async (req, res) => {
  const name = req.query.name ? String(req.query.name) : getFirstImage();
  if (!name) return res.status(404).send('No image found');

  const width = req.query.width ? parseInt(String(req.query.width)) : null;
  const height = req.query.height ? parseInt(String(req.query.height)) : null;

  const fullPath = path.join(fullDir, name);
  const thumbPath = path.join(thumbDir, name);

  if (!fs.existsSync(fullPath)) return res.status(404).send('Image not found');

  // إذا طلب resize أو النسخة المصغرة غير موجودة
  if ((width || height) && (!fs.existsSync(thumbPath) || width || height)) {
    await sharp(fullPath).resize(width || null, height || null).toFile(thumbPath);
    return res.sendFile(thumbPath);
  }

  return res.sendFile(fs.existsSync(thumbPath) ? thumbPath : fullPath);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
