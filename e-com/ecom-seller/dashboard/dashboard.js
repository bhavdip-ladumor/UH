import { protect } from '../../middlewares/authMiddleware.js';

// No ?sellerid=1111 in the URL anymore! 
// The system automatically knows who the seller is from the Token.
router.get('/orders', protect, async (req, res) => {
    const sellerId = req.sellerId; // Comes from our Middleware
    
    // Database query is now secure and specific to this seller
    const orders = await pool.query('SELECT * FROM orders WHERE seller_id = $1', [sellerId]);
    res.json(orders.rows);
});

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
        window.location.href = 'login.html'; // Kick them out if no token
        return;
    }

    // Fetch data from your backend with the token in the header
    const response = await fetch('/api/ecom/dashboard/data', {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    
    if (response.ok) {
        console.log("Here is your professional data:", data);
        // Render your orders and inventory here!
    } else {
        localStorage.removeItem('authToken');
        window.location.href = 'login.html';
    }
});