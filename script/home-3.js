// DummyJSON carts bazasidan olingan tayyor ma'lumotlar
const initialCartData = [
    {
        id: 162,
        title: "Blue Frock",
        price: 29.99,
        quantity: 4,
        thumbnail: "https://cdn.dummyjson.com/product-images/tops/blue-frock/thumbnail.webp"
    },
    {
        id: 113,
        title: "Generic Motorcycle",
        price: 3999.99,
        quantity: 3,
        thumbnail: "https://cdn.dummyjson.com/product-images/motorcycle/generic-motorcycle/thumbnail.webp"
    },
    {
        id: 122,
        title: "iPhone 6",
        price: 299.99,
        quantity: 3,
        thumbnail: "https://cdn.dummyjson.com/product-images/smartphones/iphone-6/thumbnail.webp"
    },
    {
        id: 138,
        title: "Baseball Ball",
        price: 8.99,
        quantity: 2,
        thumbnail: "https://cdn.dummyjson.com/product-images/sports-accessories/baseball-ball/thumbnail.webp"
    }
];

// Savat holatini saqlash
let cart = [...initialCartData];

const cartItemsContainer = document.getElementById('cart-items-container');
const subtotalPriceEl = document.getElementById('subtotal-price');
const finalTotalPriceEl = document.getElementById('final-total-price');

// SAVATNI CHIZISH FUNKSIYASI
function renderCart() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p style="text-align: center; padding: 40px; font-size: 18px;">Savat bo'sh!</p>`;
        calculateTotals();
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => {
        const subtotal = (item.price * item.quantity).toFixed(2);
        return `
            <div class="cart-item" data-id="${item.id}">
                <div class="product-info">
                    <div class="img-wrapper">
                        <button class="remove-btn" onclick="removeItem(${item.id})">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                        <img src="${item.thumbnail}" alt="${item.title}">
                    </div>
                    <span>${item.title}</span>
                </div>
                <div>$${item.price.toFixed(2)}</div>
                <div>
                    <div class="qty-counter">
                        <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, this.value)">
                    </div>
                </div>
                <div>$${subtotal}</div>
            </div>
        `;
    }).join('');

    calculateTotals();
}

// MIQDORNI O'ZGARTIRISH
function updateQuantity(id, newQty) {
    const parsedQty = parseInt(newQty);
    if (parsedQty < 1 || isNaN(parsedQty)) return;

    cart = cart.map(item => {
        if (item.id === id) {
            return { ...item, quantity: parsedQty };
        }
        return item;
    });

    renderCart();
}

// MAHSULOTNI O'CHIRISH
function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
}

// UMUMIY SUMMANI HISOBLASH
function calculateTotals() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const formattedTotal = `$${total.toFixed(2)}`;
    
    subtotalPriceEl.textContent = formattedTotal;
    finalTotalPriceEl.textContent = formattedTotal;
}

// DASTURNI ISHGA TUSHIRISH
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});