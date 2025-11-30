import express from 'express';
import imageRoutes from './routes/imageRoutes.js';
import path from 'path';

const app = express();
const port = 3000;

app.use('/image', imageRoutes);

// الصفحة الرئيسية تعرض الصورة مباشرة
app.get('/', (req, res) => {
  // HTML بسيط يعرض أول صورة من السيرفر
  res.send(`
    <html>
      <head><title>Image Viewer</title></head>
      <body>
        <h1>First Image</h1>
        <img src="/image" alt="First Image" />
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
