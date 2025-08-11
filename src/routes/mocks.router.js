import { Router } from 'express';
import { generateUserMock } from '../utils/generateUserMock.js';
import { generatePetMock } from '../utils/generatePetMock.js';
import { usersService, petsService } from '../services/index.js';

const router = Router();

router.get('/mockingusers', async (req, res, next) => {
    try {
        const qty = Number(req.query.qty) || 50;
        const users = Array.from({ length: qty }, generateUserMock);
        res.send({ status: 'success', payload: users });
    } catch (err) {
        next(err);
    }
});

router.get('/mockingpets', async (req, res, next) => {
    try {
        const pets = Array.from({ length: 100 }, generatePetMock);
        res.send({ status: 'success', payload: pets });
    } catch (err) {
        next(err);
    }
});

router.post('/generateData', async (req, res, next) => {
    try {
        const usersQty = Number(req.body?.users) || 0;
        const petsQty = Number(req.body?.pets) || 0;

        const users = Array.from({ length: usersQty }, generateUserMock);
        const pets = Array.from({ length: petsQty }, generatePetMock);

        await Promise.all([
            ...users.map(u => usersService.create(u)),
            ...pets.map(p => petsService.create(p))
        ]);

        res.send({
            status: 'success',
            message: 'Datos generados e insertados',
            inserted: { users: usersQty, pets: petsQty }
        });
    } catch (err) {
        next(err);
    }
});

export default router;
