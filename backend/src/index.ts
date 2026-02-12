import type { Request, Response } from 'express';
import './config/db';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import documentRoutes from './routes/documentRoutes';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors()); 
app.use(express.json()); 

app.use('/api/auth', authRoutes);
app.use('/api', documentRoutes);



app.listen(port, () => {
  console.log(`[server]: Server backend berjalan di http://localhost:${port}`);
});
