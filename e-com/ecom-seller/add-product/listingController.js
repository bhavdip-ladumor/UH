import * as listingModel from './listingModel.js';
export const fetchCategories = async (req, res) => {
    try {
        const { parentId } = req.query;
        const categories = await listingModel.getCategories(parentId);
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const fetchFields = async (req, res) => {
    try {
        const fields = await listingModel.getFields(req.params.categoryId);
        res.json(fields);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const saveProduct = async (req, res) => {
    try {
        const data = req.body;
        const seller_id = req.user ? req.user.id : 1;
        const slug = data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        const product = {
            seller_id,
            category_id: data.category_id,
            slug,
            status: 'active',
            product_code: data.product_code,
            sku: data.sku,
            title: data.title,
            brand: data.brand || null,
            tagline: data.tagline || null,
            description: data.description || null,
            other_details: data.other_details || null,
            // Convert to array if it's a string, otherwise empty array
            keywords: data.keywords ? (Array.isArray(data.keywords) ? data.keywords : [data.keywords]) : [],
            media_urls: data.media_urls ? (Array.isArray(data.media_urls) ? data.media_urls : [data.media_urls]) : [],
            mrp: parseFloat(data.mrp) || 0,
            selling_price: parseFloat(data.selling_price),
            stock: parseInt(data.stock),
            moq: parseInt(data.moq),
            weight_grams: parseFloat(data.weight_grams),
            package_length_cm: parseFloat(data.package_length_cm),
            package_width_cm: parseFloat(data.package_width_cm),
            package_height_cm: parseFloat(data.package_height_cm),
            dispatch_time_days: parseInt(data.dispatch_time_days),
            is_returnable: data.is_returnable === 'true',
            return_window_days: parseInt(data.return_window_days) || 0,
            shipping_class: data.shipping_class
        };

        await listingModel.insertProduct(product);
        res.status(201).json({ message: "Product saved successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
