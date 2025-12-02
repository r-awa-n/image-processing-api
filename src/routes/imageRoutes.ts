import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { getFirstImage, resizeImage } from '../utils/imageUtils.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const filename = req.query.name
      ? String(req.query.name)
      : getFirstImage();

    if (!filename) {
      return res.status(404).json({ error: 'No images found' });
    }

    const fullPath = path.resolve('images', 'full', filename);

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'Image does not exist' });
    }

    const width = req.query.width ? parseInt(String(req.query.width)) : null;
    const height = req.query.height ? parseInt(String(req.query.height)) : null;

    // if width/height not provided → return original image
    if (!width || !height) {
      return res.sendFile(fullPath);
    }

    // resize
    const resizedPath = await resizeImage(filename, width, height);

    return res.sendFile(resizedPath);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
