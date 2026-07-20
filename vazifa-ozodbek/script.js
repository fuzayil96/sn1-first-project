document.addEventListener('DOMContentLoaded', () => {
    console.log("Foodzy UI loaded successfully.");

    let allProducts = [];
    let currentTab = 'Featured';
    let cartCount = 0;
    let wishlistCount = 0;

    const cartSpan = document.querySelector('.user-actions .action-item:last-child span');
    const wishlistSpan = document.querySelector('.user-actions .action-item:first-child span');

    fetchAndRenderProducts();

    async function fetchAndRenderProducts() {
        try {
            const response = await fetch('https://dummyjson.com/products/category/groceries?limit=30');
            const data = await response.json();
            allProducts = data.products;

            if (allProducts && allProducts.length > 0) {
                renderDailyBestSells();
                renderStandoutDishes();
                renderDealsOfTheDay();
            }
        } catch (error) {
            console.error('Error fetching products from API:', error);
        }
    }

    function renderDailyBestSells(filterQuery = '') {
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) return;

        let filtered = [...allProducts];

        if (filterQuery) {
            filtered = filtered.filter(p => p.title.toLowerCase().includes(filterQuery.toLowerCase()));
        } else {
            // Apply tab category filters
            if (currentTab === 'Featured') {
                filtered = filtered.filter(p => p.rating >= 4.4);
            } else if (currentTab === 'Popular') {
                filtered = filtered.filter(p => p.discountPercentage >= 10);
            } else if (currentTab === 'New added') {
                filtered = [...filtered].sort((a, b) => b.id - a.id);
            }
        }

        // Limit to exactly 4 products to avoid squishing and match layout
        const displayedProducts = filtered.slice(0, 4);

        if (displayedProducts.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-products" style="grid-column: 1/-1; padding: 60px 20px; text-align: center; font-size: 16px; color: #777; font-weight: 600; width: 100%;">
                    No groceries found matching your search.
                </div>`;
            return;
        }

        const badgeClasses = ['bg-green', 'bg-blue', 'bg-orange', 'bg-pink'];
        const badgeTexts = ['Save 35%', 'Sale', 'Best sale', 'Save 15%'];

        productsGrid.innerHTML = displayedProducts.map((product, idx) => {
            const badgeClass = badgeClasses[idx % badgeClasses.length];
            const badgeText = badgeTexts[idx % badgeTexts.length];
            const oldPrice = (product.price * (1 + (product.discountPercentage || 12)/100)).toFixed(2);
            const stars = '&#9733;'.repeat(Math.round(product.rating)) + '&#9734;'.repeat(5 - Math.round(product.rating));
            
            return `
                <div class="product-card" style="opacity: 0; transform: translateY(10px); animation: fadeInUp 0.4s ease forwards ${idx * 0.05}s;">
                    <span class="product-badge ${badgeClass}">${badgeText}</span>
                    <div class="product-img-wrapper">
                        <img src="${product.thumbnail}" alt="${product.title}" class="product-img">
                    </div>
                    <span class="product-brand">${product.brand || 'Foodzy'}</span>
                    <h4 class="product-title">${product.title}</h4>
                    <div class="product-rating">
                        <span>${stars}</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        <span class="old-price">$${oldPrice}</span>
                    </div>
                    <div class="product-stock">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${product.stock * 3.3}%;"></div>
                        </div>
                        <div class="stock-labels">
                            <span>Sold: ${Math.max(10, 100 - product.stock)}/100</span>
                        </div>
                    </div>
                    <button class="add-cart-btn" data-title="${product.title}">&bull;&bull;&bull;Add To Cart</button>
                </div>
            `;
        }).join('');
    }

    function renderStandoutDishes() {
        const standoutGrid = document.querySelector('.standout-grid');
        if (!standoutGrid) return;

        const standoutItems = allProducts.slice(1, 4);

        standoutGrid.innerHTML = standoutItems.map((product, idx) => {
            return `
                <div class="standout-card" style="opacity: 0; transform: translateY(10px); animation: fadeInUp 0.4s ease forwards ${idx * 0.1}s;">
                    <button class="heart-badge" aria-label="Add to Wishlist" data-title="${product.title}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    </button>
                    <div class="standout-img-wrapper">
                        <img src="${product.thumbnail}" alt="${product.title}" class="standout-card-img">
                    </div>
                    <h3>${product.title}</h3>
                    <p class="standout-desc">${product.description.substring(0, 70)}...</p>
                </div>
            `;
        }).join('');
    }

    function renderDealsOfTheDay() {
        const dealsGrid = document.querySelector('.deals-grid');
        if (!dealsGrid) return;

        const dealItems = allProducts.slice(4, 8);

        dealsGrid.innerHTML = dealItems.map((product, idx) => {
            const oldPrice = (product.price * (1 + (product.discountPercentage || 12)/100)).toFixed(2);
            const stars = '&#9733;'.repeat(Math.round(product.rating)) + '&#9734;'.repeat(5 - Math.round(product.rating));
            
            return `
                <div class="deal-card" style="background-image: url('${product.thumbnail}'); opacity: 0; transform: translateY(10px); animation: fadeInUp 0.4s ease forwards ${idx * 0.08}s;">
                    <div class="deal-details-box">
                        <h4 class="deal-product-title">${product.title}</h4>
                        <div class="deal-rating">
                            <span class="stars">${stars}</span>
                            <span class="rating-val">(${product.rating.toFixed(1)})</span>
                        </div>
                        <p class="deal-vendor">By <span class="vendor-green">${product.brand || 'Foodzy'}</span></p>
                        <div class="deal-bottom-row">
                            <div class="deal-price-block">
                                <span class="deal-current-price">$${product.price.toFixed(2)}</span>
                                <span class="deal-old-price">$${oldPrice}</span>
                            </div>
                            <button class="deal-add-btn" data-title="${product.title}">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                                </svg>
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    const categorySelect = document.querySelector('.category-select');
    if (categorySelect) {
        categorySelect.addEventListener('click', () => {
            alert('Categories: All, Meat, Fast Food, Desserts, Drinks (Simulation)');
        });
    }

    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-bar input');
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                renderDailyBestSells(query);
                showToast(`Search results for: "${query}"`);
            } else {
                renderDailyBestSells();
            }
        });
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim();
            renderDailyBestSells(query);
        });
    }

    const orderBtn = document.querySelector('.order-btn');
    if (orderBtn) {
        orderBtn.addEventListener('click', () => {
            alert('Thank you for ordering! Roast Turkey will be ready soon.');
        });
    }

    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const catName = card.querySelector('h3').textContent;
            showToast(`Opening category: ${catName}`);
        });
    });

    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            tabLinks.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentTab = tab.textContent.trim();
            if (searchInput) searchInput.value = ''; // Reset search on tab switch
            renderDailyBestSells();
        });
    });

    const productsGrid = document.querySelector('.products-grid');
    const prevBtn = document.querySelector('.nav-prev');
    const nextBtn = document.querySelector('.nav-next');
    if (productsGrid && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            productsGrid.scrollBy({ left: -250, behavior: 'smooth' });
        });
        nextBtn.addEventListener('click', () => {
            productsGrid.scrollBy({ left: 250, behavior: 'smooth' });
        });
    }

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-cart-btn')) {
            const title = e.target.getAttribute('data-title');
            cartCount++;
            if (cartSpan) {
                cartSpan.textContent = `Cart (${cartCount})`;
            }
            showToast(`Added to cart: ${title}`);
        }

        if (e.target.closest('.deal-add-btn')) {
            const btn = e.target.closest('.deal-add-btn');
            const title = btn.getAttribute('data-title');
            cartCount++;
            if (cartSpan) {
                cartSpan.textContent = `Cart (${cartCount})`;
            }
            showToast(`Added to cart: ${title}`);
        }

        if (e.target.closest('.heart-badge')) {
            const btn = e.target.closest('.heart-badge');
            const title = btn.getAttribute('data-title');
            
            btn.classList.toggle('liked');
            
            if (btn.classList.contains('liked')) {
                wishlistCount++;
                showToast(`Added to Wishlist: ${title}`);
            } else {
                wishlistCount = Math.max(0, wishlistCount - 1);
                showToast(`Removed from Wishlist: ${title}`);
            }
            
            if (wishlistSpan) {
                wishlistSpan.textContent = wishlistCount > 0 ? `Wishlist (${wishlistCount})` : 'Wishlist';
            }
        }
    });

    const standoutPrev = document.querySelector('.nav-prev-dishes');
    const standoutNext = document.querySelector('.nav-next-dishes');
    const standoutGrid = document.querySelector('.standout-grid');
    
    if (standoutPrev && standoutNext && standoutGrid) {
        standoutPrev.addEventListener('click', () => {
            standoutNext.classList.add('active');
            standoutPrev.classList.remove('active');
            standoutGrid.style.transform = 'translateX(0)';
            showToast('Showing previous standout dishes');
        });
        standoutNext.addEventListener('click', () => {
            standoutPrev.classList.add('active');
            standoutNext.classList.remove('active');
            showToast('Showing next standout dishes');
        });
    }

    function showToast(message) {
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
});
