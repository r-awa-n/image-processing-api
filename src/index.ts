import express from 'express';
import imageRoutes from './routes/imageRoutes';

const app = express();
const port = 3000;

app.use('/image', imageRoutes);

app.get('/', (req, res) => {
  res.send('Image Processing API is running!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
