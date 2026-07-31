import pool from '../../config/db.js';

// Fetch orders by status
export const getOrdersByStatus = async (req, res) => {
    const { status } = req.params; // e.g., 'pending', 'shipped', 'rto'
    const sellerId = req.sellerId; // Injected by your authMiddleware

    try {
        const query = `
            SELECT * FROM sellers.orders 
            WHERE seller_id = $1 AND order_status = $2
        `;
        const { rows } = await pool.query(query, [sellerId, status]);
        res.json({ success: true, orders: rows });
    } catch (err) {
        res.status(500).json({ error: "Could not fetch orders" });
    }
};