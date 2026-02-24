import admin from '../config/firebase.js';

const firebaseAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'No token provided',
            data: null,
        });
    }

    const token = authHeader.substring(7);

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.firebaseUser = decodedToken;
        next();
    } catch {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
            data: null,
        });
    }
};

export default firebaseAuth;
