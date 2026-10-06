import mongoose from 'mongoose';
import 'dotenv/config';

process.loadEnvFile();
const { MONGO_DB_IP, MONGO_DB_PUERTO, MONGO_DB_PROTOCOLO, PUERTO, MONGO_URI} = process.env;
/*const uri = `${MONGO_DB_PROTOCOLO}://${MONGO_DB_IP}:${MONGO_DB_PUERTO}`;*/
const uri = `${MONGO_URI}`


const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');
};

export default connectDB;
