// middlewares/verifyJWT.js

import jwt from 'jsonwebtoken';

const { JWT_SECRET } = process.env;

const verifyJWT = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;  // Add decoded user payload to the request object
        next();  // Move to the next middleware or route handler
    } catch (err) {
        return res.status(403).json({ message: 'Failed to authenticate token.' });
    }
};

export default verifyJWT;
