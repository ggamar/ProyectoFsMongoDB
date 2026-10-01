import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json()); //middleware para manejar JSON en el cuerpo de la solicitud
app.use('/api', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});