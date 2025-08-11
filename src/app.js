import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

console.log('MONGO_URL presente?', Boolean(process.env.MONGO_URL));

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log(' MongoDB conectado'))
    .catch(err => console.error(' Error de conexión a MongoDB:', err));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('OK Backend3-Cebrero');
});

app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
