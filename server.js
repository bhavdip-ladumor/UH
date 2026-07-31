import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Import App Custom Routers
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import webRoutes from './routes/web.js'; // 👈 Our clean static web router
import ecomSellerApp from './sub-apps/ecom-seller.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: '*', // Try '*' first to see if it's a CORS issue
    credentials: false // Temporarily set to false to test if it's the culprit
}));
app.use(express.json());

try {
    app.use(cookieParser());
    console.log("✅ Cookie Parser initialized");
} catch (e) {
    console.error("❌ Cookie Parser failed to initialize:", e);
}

// Universal Middleware
app.use(cors());
app.use(express.json());


// Main App Mounted Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

//e-com service
app.use('/api/ecom', ecomSellerApp);
app.use('/', webRoutes); // 👈 Handles static delivery cleanly outside this file

app.listen(PORT, () => {
  console.log(`🚀 Server spinning professionally on port ${PORT}`);

  
});

