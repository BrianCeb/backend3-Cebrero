import mongoose from 'mongoose';
import { usersService } from "../services/index.js";
import CustomError from '../utils/CustomError.js';
import EErrors from '../utils/EErrors.js';

const getAllUsers = async (req, res) => {
    const users = await usersService.getAll();
    res.send({ status: "success", payload: users });
};

const getUser = async (req, res, next) => {
    try {
        const userId = req.params.uid;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return next(
                CustomError.createError({
                    name: 'UserError',
                    message: 'Parámetro inválido',
                    code: EErrors.INVALID_PARAM,
                    cause: `uid (${userId}) no es un ObjectId válido`
                })
            );
        }

        const user = await usersService.getUserById(userId);
        if (!user) {
            return next(
                CustomError.createError({
                    name: 'UserError',
                    message: 'User not found',
                    code: EErrors.NOT_FOUND,
                    cause: `No existe usuario con id ${userId}`
                })
            );
        }
        res.send({ status: "success", payload: user });
    } catch (err) {
        next(err);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const updateBody = req.body;
        const userId = req.params.uid;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return next(CustomError.createError({
                name: 'UserError',
                message: 'Parámetro inválido',
                code: EErrors.INVALID_PARAM,
                cause: `uid (${userId}) no es un ObjectId válido`
            }));
        }
        const user = await usersService.getUserById(userId);
        if (!user) {
            return next(CustomError.createError({
                name: 'UserError',
                message: 'User not found',
                code: EErrors.NOT_FOUND,
                cause: `No existe usuario con id ${userId}`
            }));
        }
        await usersService.update(userId, updateBody);
        res.send({ status: "success", message: "User updated" });
    } catch (err) {
        next(err);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.uid;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return next(CustomError.createError({
                name: 'UserError',
                message: 'Parámetro inválido',
                code: EErrors.INVALID_PARAM,
                cause: `uid (${userId}) no es un ObjectId válido`
            }));
        }
        await usersService.delete(userId);
        res.send({ status: "success", message: "User deleted" });
    } catch (err) {
        next(err);
    }
};

export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser
};
