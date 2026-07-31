import pool from '../../../config/db.js';

/**
 * Fetches categories from the 'listing' schema.
 * If parentId is null, it fetches top-level categories.
 */
export const getCategories = async (parentId = null) => {
    try {
        let query, values;
        
        if (parentId && parentId !== 'null' && parentId !== 'undefined') {
            query = "SELECT * FROM listing.categories WHERE parent_id = $1 ORDER BY id ASC";
            values = [parentId];
        } else {
            query = "SELECT * FROM listing.categories WHERE parent_id IS NULL ORDER BY id ASC";
            values = [];
        }

        const { rows } = await pool.query(query, values);
        return rows;
    } catch (error) {
        console.error("Database Query Error (getCategories):", error);
        throw error;
    }
};

/**
 * Fetches combined fields for a specific leaf category from the 'listing' schema.
 */




export const getFields = async (categoryId) => {
    try {
        // We use 'recipe' for leaf_categories_field and 'fields_recipe' for standard_form_fields
        const query = `
            SELECT 'core' as section, fields_recipe FROM listing.standard_form_fields WHERE id = 1
            UNION ALL
            SELECT 'leaf' as section, recipe as fields_recipe FROM listing.leaf_categories_field WHERE category_id = $1
            UNION ALL
            SELECT 'shipping' as section, fields_recipe FROM listing.standard_form_fields WHERE id = 2
        `;
        
        const { rows } = await pool.query(query, [categoryId]);
        
        // This maps the result rows back into your structured object
        return {
            core: rows.find(r => r.section === 'core')?.fields_recipe || [],
            leaf: rows.find(r => r.section === 'leaf')?.fields_recipe || [],
            shipping: rows.find(r => r.section === 'shipping')?.fields_recipe || []
        };
    } catch (error) {
        console.error("Database Query Error (getFields):", error);
        throw error;
    }
};

export const insertProduct = async (p) => {
    const query = `
        INSERT INTO products.products (
            seller_id, category_id, slug, status, product_code, sku, title, brand, 
            tagline, description, other_details, keywords, media_urls, mrp, 
            selling_price, stock, moq, weight_grams, package_length_cm, 
            package_width_cm, package_height_cm, dispatch_time_days, 
            is_returnable, return_window_days, shipping_class
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
    `;
    const values = [
        p.seller_id, p.category_id, p.slug, p.status, p.product_code, p.sku, p.title, p.brand,
        p.tagline, p.description, p.other_details, p.keywords, p.media_urls, p.mrp, 
        p.selling_price, p.stock, p.moq, p.weight_grams, p.package_length_cm, 
        p.package_width_cm, p.package_height_cm, p.dispatch_time_days, 
        p.is_returnable, p.return_window_days, p.shipping_class
    ];
    await pool.query(query, values);
};