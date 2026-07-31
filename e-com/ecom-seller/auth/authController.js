import jwt from 'jsonwebtoken';
import AuthModel from './authModel.js';
import dotenv from 'dotenv';

dotenv.config();

// 1. LOGIN FUNCTION
export const loginSeller = async (req, res) => {
    const { email, password } = req.body;

    try {
        const seller = await AuthModel.findSellerByEmail(email);

        // Security Note: In a production app, use bcrypt.compare() here instead of '==='
        if (seller && seller.password_hash === password) {
            
            if (!process.env.JWT_SECRET) {
                console.error("JWT_SECRET is missing!");
                return res.status(500).json({ success: false, message: "Server configuration error" });
            }

            // Generate JWT
            const token = jwt.sign(
                { sellerId: seller.seller_id, email: seller.email },
                process.env.JWT_SECRET, 
                { expiresIn: '24h' }
            );

            // Set HttpOnly Cookie instead of sending token in JSON
            res.cookie('token', token, {
                httpOnly: true, // Immune to XSS
                secure: process.env.NODE_ENV === 'production', // HTTPS only in production
                sameSite: 'Strict', // Protection against CSRF
                maxAge: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
            });

            // Send back minimal user info, NOT the token
            res.status(200).json({ 
                success: true, 
                message: "Logged in successfully",
                accountName: seller.account_name 
            });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (err) {
        console.error("DEBUG ERROR:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// 2. LOGOUT FUNCTION
export const logoutSeller = (req, res) => {
    // Clear the HttpOnly cookie
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
    });
    
    res.status(200).json({ success: true, message: "Logged out successfully" });
};