import EErrors from '../utils/EErrors.js';

export const errorHandler = (err, req, res, _next) => {
    const base = { status: 'error', error: err.message, code: err.code, cause: err.cause };

    switch (err.code) {
        case EErrors.INVALID_PARAM:
            return res.status(400).json(base);
        case EErrors.NOT_FOUND:
            return res.status(404).json(base);
        case EErrors.DATABASE_ERROR:
            return res.status(500).json(base);
        default:
            return res.status(500).json(base);
    }
};
