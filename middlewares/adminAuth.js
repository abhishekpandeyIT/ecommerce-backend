const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Access Denied: No Token Provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Access Denied: Insufficient Permissions' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid Token' });
    }
};

module.exports = adminAuth;