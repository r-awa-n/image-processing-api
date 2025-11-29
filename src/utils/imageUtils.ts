import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

// مسارات الصور
const fullDir = path.join(__dirname, '..', 'images', 'full');
const thumbDir = path.join(__dirname, '..', 'images', 'thumb');

// إنشاء مجلد thumbs إذا مش موجود
if (!fs.existsSync(thumbDir)) {
  fs.mkdirSync(thumbDir, { recursive: true });
}

// 🔹 جلب أول صورة في مجلد full
export const getFirstImage = (): string | null => {
  try {
    const files = fs
      .readdirSync(fullDir)
      .filter((file) => /\.(jpe?g|png)$/i.test(file));

    if (files.length === 0) {
      return null; // ← هيك TS ما بزعّلنا
    }

    return files[0] as string; // ← نحكيله إنها أكيد string
  } catch {
    return null;
  }
};

// 🔹 دالة Resize ترجع Promise<string>
export const resizeImage = async (
  filename: string,
  width: number,
  height: number
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const fullPath = path.join(fullDir, filename);
      const thumbPath = path.join(
        thumbDir,
        `${width}x${height}-${filename}`
      );

      if (!fs.existsSync(fullPath)) {
        return reject(new Error('Image not found'));
      }

      await sharp(fullPath)
        .resize(width, height)
        .toFile(thumbPath);

      resolve(thumbPath); // ← ما بطلع خط أحمر
    } catch (err) {
      reject(err);
    }
  });
};
