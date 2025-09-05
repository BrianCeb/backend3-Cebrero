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

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

console.log('MONGO_URL presente?', Boolean(process.env.MONGO_URL));

mongoose.set('strictQuery', false);
mongoose
    .connect(process.env.MONGO_URL)
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Adoptme API',
            description: 'Documentación del módulo Users',
            version: '1.0.0'
        }
    },
    apis: [path.join(process.cwd(), 'src', 'docs', '**', '*.yaml')]
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
}
export default app;
