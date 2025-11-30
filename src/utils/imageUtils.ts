import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

// full images folder
const fullDir: string = path.resolve('images', 'full');

// thumb images folder
const thumbDir: string = path.resolve('images', 'thumb');

// ensure thumb folder exists
if (!fs.existsSync(thumbDir)) {
  fs.mkdirSync(thumbDir, { recursive: true });
}

// get first image in /full folder
export function getFirstImage(): string | null {
  try {
    const files: string[] = fs
      .readdirSync(fullDir)
      .filter((file: string) => /\.(jpg|jpeg|png)$/i.test(file));

    if (files.length === 0) {
      return null;
    }

    return files[0] ?? null; // ← المشكلة انحلت 100%
  } catch (error) {
    console.error('Error reading images:', error);
    return null;
  }
}

// resize image function
export async function resizeImage(
  filename: string,
  width: number,
  height: number
): Promise<string> {
  const fullPath: string = path.join(fullDir, filename);
  const thumbPath: string = path.join(
    thumbDir,
    `${width}x${height}-${filename}`
  );

  if (!fs.existsSync(fullPath)) {
    throw new Error('Image not found');
  }

  await sharp(fullPath).resize(width, height).toFile(thumbPath);

  return thumbPath;
}
