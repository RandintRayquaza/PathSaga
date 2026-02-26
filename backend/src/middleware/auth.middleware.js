import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'No token provided. Unauthorized.',
            data: null,
        });
    }

    const token = authHeader.substring(7);

    console.log("Auth header:", authHeader);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_pathsaga_2026');
        console.log("Decoded:", decoded);
        req.user = decoded; // Contains uid
        next();
    } catch (err) {
        console.error("JWT Verify Error:", err.message);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
            data: null,
        });
    }
};

export default authMiddleware;
