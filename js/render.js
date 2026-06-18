// js/render.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Check if the browser has the POS token in local storage
    const isAdmin = localStorage.getItem('pos_active') === 'true';

    // 2. Adjust UI if Admin
    if (isAdmin) {
        document.getElementById('pos-stylesheet').removeAttribute('disabled');
        document.getElementById('admin-indicator').classList.add('active-green');
        document.getElementById('pos-sidebar-controls').classList.remove('hidden');
        document.getElementById('pos-cart-pane').classList.remove('hidden');
        document.getElementById('public-info').classList.add('hidden');
    }

    // 3. Fetch and render the static database
    fetch('data/catalog.json')
        .then(response => response.json())
        .then(data => renderGrid(data, isAdmin))
        .catch(err => console.error("Database fetch failed", err));
});

function renderGrid(products, isAdmin) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';

    products.forEach(product => {
        // Create the standard card
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="assets/images/products/${product.id}.jpg" alt="${product.name}" onerror="this.src='assets/images/placeholder.jpg'">
            <h4>${product.name}</h4>
            <p>$${product.price.toFixed(2)}</p>
        `;

        // Inject POS buttons ONLY if admin
        if (isAdmin) {
            const adminControls = document.createElement('div');
            adminControls.className = 'admin-card-controls';
            adminControls.innerHTML = `<button onclick="addToCart('${product.id}')">Add to POS</button>`;
            card.appendChild(adminControls);
        }

        grid.appendChild(card);
    });
}

// Add this inside your existing DOMContentLoaded listener in render.js

function renderGrid(products, isAdmin) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';

    // 1. Find the featured item and populate the spotlight
    const featuredItem = products.find(p => p.featured === true) || products[0];
    populateSpotlight(featuredItem, isAdmin);

    // 2. Render the standard grid
    products.forEach(product => {
        // (Keep your existing grid rendering code here)
    });
}

function populateSpotlight(item, isAdmin) {
    if (!item) return;
    
    document.getElementById('spotlight-title').innerText = item.name;
    document.getElementById('spotlight-desc').innerText = `Category: ${item.category}`;
    document.getElementById('spotlight-price').innerText = `$${item.price.toFixed(2)}`;
    // document.getElementById('spotlight-img').src = `assets/images/products/${item.id}.jpg`;
    
    if (isAdmin) {
        const adminBtn = document.querySelector('.spotlight-actions .btn-admin');
        adminBtn.classList.remove('hidden');
        adminBtn.onclick = () => addToCart(item.id);
    }
}

// 3. UX Polish: Hide Spotlight on Search
document.getElementById('global-search').addEventListener('input', (e) => {
    const spotlight = document.getElementById('featured-spotlight');
    if (e.target.value.length > 0) {
        spotlight.style.display = 'none'; // Hide when typing
    } else {
        spotlight.style.display = 'flex'; // Show when empty
    }
});

// Dummy cart function for the POS logic later
function addToCart(productId) {
    console.log(`Added ${productId} to local IndexedDB cart.`);
}
