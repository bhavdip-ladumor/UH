const categoryListDiv = document.getElementById('category-list');
const productForm = document.getElementById('product-form');
const dynamicFields = document.getElementById('dynamic-fields');
let currentCategoryId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
});

async function loadCategories(parentId = null) {
    const url = parentId 
        ? `/api/ecom/add-product/categories?parentId=${parentId}` 
        : `/api/ecom/add-product/categories`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        categoryListDiv.innerHTML = '';
        data.forEach(cat => {
            const btn = document.createElement('button');
            btn.innerText = cat.name;
            btn.className = 'cat-btn';
            btn.onclick = () => cat.is_leaf ? showProductForm(cat.id) : loadCategories(cat.id);
            categoryListDiv.appendChild(btn);
        });
    } catch (err) { console.error("Error loading categories:", err); }
}

async function showProductForm(categoryId) {
    currentCategoryId = categoryId;
    try {
        const response = await fetch(`/api/ecom/add-product/fields/${categoryId}`);
        const data = await response.json();
        document.getElementById('category-selector').style.display = 'none';
        productForm.style.display = 'block';
        dynamicFields.innerHTML = '';

        renderSection("Core Details", data.core);
        renderSection("Category Specific Details", data.leaf);
        renderSection("Shipping Logistics", data.shipping);
    } catch (err) { console.error("Error loading fields:", err); }
}

function renderSection(title, fields) {
    const sectionDiv = document.createElement('div');
    sectionDiv.innerHTML = `<h3>${title}</h3>`;
    fields.forEach(field => sectionDiv.appendChild(renderField(field)));
    dynamicFields.appendChild(sectionDiv);
}

function renderField(field) {
    const container = document.createElement('div');
    container.className = 'form-group';
    container.style.marginBottom = "15px";

    const label = document.createElement('label');
    label.innerText = field.field_name + (field.is_required ? ' *' : '');
    label.style.display = "block";
    container.appendChild(label);

    const options = field.options || {};
    // CRITICAL: Use database_column as the name, fallback to field_name
    const fieldName = field.database_column || field.field_name;

    if (field.field_type === 'select') {
        const select = document.createElement('select');
        select.name = fieldName;
        if (options.default === undefined || options.default === null) {
            const opt = document.createElement('option');
            opt.text = "-- Select --"; opt.value = ""; opt.disabled = true; opt.selected = true;
            select.appendChild(opt);
        }
        options.choices.forEach(choice => {
            const opt = document.createElement('option');
            opt.value = choice; opt.text = choice;
            if (options.default === choice) opt.selected = true;
            select.appendChild(opt);
        });
        container.appendChild(select);
    } else if (field.field_type === 'number_with_unit') {
        const input = document.createElement('input');
        input.type = 'number';
        input.name = fieldName; // Main value
        input.placeholder = "Enter value";
        container.appendChild(input);

        const unitSelect = document.createElement('select');
        unitSelect.name = fieldName + "_unit"; // Unit value
        options.units.forEach(unit => {
            const opt = document.createElement('option');
            opt.value = unit; opt.text = unit;
            if (options.default_unit === unit) opt.selected = true;
            unitSelect.appendChild(opt);
        });
        container.appendChild(unitSelect);
    } else if (field.field_type === 'boolean') {
        const select = document.createElement('select');
        select.name = fieldName;
        ['Yes', 'No'].forEach(val => {
            const opt = document.createElement('option');
            opt.value = val; opt.text = val;
            const boolVal = (val === 'Yes');
            if (options.default === boolVal) opt.selected = true;
            select.appendChild(opt);
        });
        container.appendChild(select);
    } else {
        const input = document.createElement('input');
        input.type = field.field_type === 'number' ? 'number' : 'text';
        input.name = fieldName; // CRITICAL: This allows FormData to see the field
        input.value = options.default !== undefined ? options.default : '';
        container.appendChild(input);
    }
    return container;
}

productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(productForm);
    const productData = Object.fromEntries(formData.entries());
    productData.category_id = currentCategoryId;

    console.log("Sending data:", productData); // Check this in your F12 Console

    try {
        const response = await fetch('/api/ecom/add-product/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });

        if (response.ok) {
            alert("Product saved successfully!");
            productForm.style.display = 'none';
            document.getElementById('category-selector').style.display = 'block';
            productForm.reset();
        } else {
            const errorText = await response.text();
            alert("Error saving: " + errorText);
        }
    } catch (err) { console.error("Save error:", err); }
});