import jwt from 'jsonwebtoken';

export const secureEcomService = (req, res, next) => {

    const token = req.cookies.token; 
    if (!token) {
        return res.status(401).json({ success: false, message: "E-com Access Denied: No Token" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.sellerId = decoded.sellerId;        
        next(); // 
    } catch (err) {
        res.status(401).json({ success: false, message: "E-com Access Denied: Invalid Token" });
    }
};