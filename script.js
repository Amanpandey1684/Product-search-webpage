document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('productsContainer');
    const searchInput = document.getElementById('searchInput');
    const loadingSpinner = document.getElementById('loadingSpinner');
    let allProducts = [];

    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        const starRating = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating));
        const productImage = product.images && product.images.length > 0 ? product.images[0] : (product.thumbnail || 'https://via.placeholder.com/400');
        
        card.innerHTML = `
            <h2 class="product-title">${product.title}</h2>
            <img src="${productImage}" alt="${product.title}" class="product-image">
            <p class="product-description">${product.description}</p>
            <h3 class="product-price">$${product.price.toFixed(2)}</h3>
            <div class="product-rating">${starRating} (${product.rating})</div>
            <div class="product-tags">
                ${product.tags ? product.tags.map(tag => `<span class="product-tag">${tag}</span>`).join('') : ''}
            </div>
        `;
        return card;
    }

    function renderProducts(productsToRender) {
        productsContainer.innerHTML = '';
        if (productsToRender.length === 0) {
            const noResultsMessage = document.createElement('div');
            noResultsMessage.textContent = 'No products found';
            noResultsMessage.className = 'error-message';
            productsContainer.appendChild(noResultsMessage);
            return;
        }
        productsToRender.forEach(product => {
            const productCard = createProductCard(product);
            productsContainer.appendChild(productCard);
        });
    }

    async function fetchProducts() {
        try {
            loadingSpinner.style.display = 'block';
            productsContainer.style.display = 'none';
            const response = await fetch('https://dummyjson.com/products');
            const data = await response.json();
            allProducts = data.products;
            renderProducts(allProducts);
            loadingSpinner.style.display = 'none';
            productsContainer.style.display = 'grid';
        } catch (error) {
            loadingSpinner.textContent = 'Error loading products';
            loadingSpinner.classList.add('error-message');
            console.error('Error fetching products:', error);
        }
    }

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredProducts = allProducts.filter(product => 
            product.title.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm) || 
            (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm))) || 
            product.category.toLowerCase().includes(searchTerm)
        );
        renderProducts(filteredProducts);
    });

    fetchProducts();
});