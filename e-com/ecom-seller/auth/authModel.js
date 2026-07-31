import pool from '../../../config/db.js';

const AuthModel = {
    async findSellerByEmail(mailid) {
        // Change: Added 'sellers.' before 'auth'
        const query = 'SELECT * FROM sellers.auth WHERE email = $1';
        const { rows } = await pool.query(query, [mailid]);
        return rows[0];
    }
};

export default AuthModel;

