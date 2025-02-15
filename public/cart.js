document.addEventListener('DOMContentLoaded', function() {
    displayCartItems();
    calculateTotalPrice();

    // Listen for storage changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'cart' || e.key === 'cartUpdated') {
            displayCartItems();
            calculateTotalPrice();
        }
    });

    // Initialize notification container when the page loads
    if (!document.querySelector('.notification-container')) {
        const notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }

    // Animate sections on scroll
    const sections = document.querySelectorAll('.cart-section, .billing-section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        observer.observe(section);
    });
});

function displayCartItems() {
    const cartItems = document.getElementById('cartItems');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        const emptyCartEl = document.createElement('div');
        emptyCartEl.className = 'empty-cart';
        emptyCartEl.innerHTML = `
            <div class="empty-cart-animation">
                <i class="fas fa-shopping-cart fa-3x bounce"></i>
                <p class="fade-in">Your cart is empty</p>
                <a href="/buynow" class="continue-shopping slide-up">
                    Continue Shopping
                </a>
            </div>
        `;
        cartItems.appendChild(emptyCartEl);
        return;
    }
    
    cart.forEach((item, index) => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.style.opacity = '0';
        cartItemElement.style.transform = 'translateX(-20px)';
        
        cartItemElement.innerHTML = `
            <div class="item-content">
                <img src="${item.imageUrl}" alt="${item.name}" class="fade-in" loading="lazy">
                <div class="item-details slide-up">
                    <h3 class="item-title">${item.name}</h3>
                    <p class="license-type">Standard License</p>
                    <p class="price highlight-text">${item.price}</p>
                    <div class="quantity-wrapper">
                        <div class="quantity-controls fade-in">
                            <button class="qty-btn minus" onclick="decrementQuantity(this)">-</button>
                            <input type="number" value="${item.quantity}" min="1" max="10" onchange="handleQuantityChange(this)">
                            <button class="qty-btn plus" onclick="incrementQuantity(this)">+</button>
                        </div>
                    </div>
                </div>
                <button class="remove-btn pulse" onclick="removeItem(${index})">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        `;
        
        cartItems.appendChild(cartItemElement);
        
        // Staggered animation for each cart item
        setTimeout(() => {
            cartItemElement.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            cartItemElement.style.opacity = '1';
            cartItemElement.style.transform = 'translateX(0)';
        }, index * 150);
    });
    
    calculateTotalPrice();
}

function calculateTotalPrice() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal = 0;
    
    // Calculate subtotal
    cart.forEach(item => {
        // Extract numeric price value
        const priceValue = parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
        if (!isNaN(priceValue)) {
            subtotal += priceValue;
        }
    });

    // Calculate tax and total
    const tax = subtotal * 0.10; // 10% tax
    const total = subtotal + tax;

    // Update the display
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;

    // Save totals to localStorage
    localStorage.setItem('cartTotals', JSON.stringify({
        subtotal: subtotal,
        tax: tax,
        total: total
    }));
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.querySelectorAll('.cart-item');
    const itemToRemove = cartItems[index];
    
    if (itemToRemove) {
        // Add removal animation
        itemToRemove.style.transform = 'translateX(100%)';
        itemToRemove.style.opacity = '0';
        
        setTimeout(() => {
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Show animated notification
            showNotification(`Item removed from cart`, 'warning');
            
            // Refresh cart with animations
            displayCartItems();
            calculateTotalPrice();
        }, 300);
    }
}

function addToCart(button, productName) {
    // Get product details
    const productCard = button.closest('.product-one, .product-two');
    const price = productCard.querySelector('.product-Price h2').textContent;
    const imageUrl = productCard.querySelector('img').src;
    
    // Extract numeric price value
    const priceValue = parseFloat(price.replace(/[^0-9.-]+/g, ''));
    
    // Create product object
    const product = {
        name: productName,
        price: priceValue,
        imageUrl: imageUrl
    };
    
    // Add to cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show notification with price
    showNotification(`Added: ${productName} (+$${priceValue.toFixed(2)})`);
    
    // Update cart display and totals
    displayCartItems();
    calculateTotalPrice();
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger entrance animation
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    });
    
    // Remove notification after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function checkEmptyCart() {
    const cartItems = document.querySelectorAll('.cart-item');
    if (cartItems.length === 0) {
        const cartContainer = document.querySelector('.cart-items');
        cartContainer.innerHTML = `
            <div class="empty-cart-message">
                <i class="fas fa-shopping-cart fa-3x"></i>
                <p>Your cart is empty</p>
                <a href="../buy now page/buynow.html" class="continue-shopping">Continue Shopping</a>
            </div>
        `;
    }
}

// Add the necessary styles
const styles = `
    .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
    }

    .notification {
        background: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 12px;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        border-left: 4px solid var(--error-color);
    }

    .notification i {
        color: var(--error-color);
        font-size: 1.2em;
    }

    .notification-content {
        flex-grow: 1;
    }

    .notification-title {
        font-weight: 600;
        margin-bottom: 4px;
        color: var(--text-color);
    }

    .notification-message {
        color: #666;
        font-size: 0.9em;
    }

    .notification .undo-btn {
        padding: 4px 8px;
        background: transparent;
        border: 1px solid var(--error-color);
        color: var(--error-color);
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8em;
        transition: all 0.2s ease;
    }

    .notification .undo-btn:hover {
        background: var(--error-color);
        color: white;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes fadeOut {
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .cart-item.removing {
        animation: removeItem 0.5s ease forwards;
    }

    @keyframes removeItem {
        to {
            transform: translateX(100%);
            opacity: 0;
            height: 0;
            margin: 0;
            padding: 0;
        }
    }

    .empty-cart-message {
        text-align: center;
        padding: 2rem;
        color: #666;
    }

    .empty-cart-message i {
        margin-bottom: 1rem;
        color: #ccc;
    }

    .continue-shopping {
        display: inline-block;
        margin-top: 1rem;
        padding: 0.8rem 1.5rem;
        background: var(--secondary-color);
        color: white;
        text-decoration: none;
        border-radius: var(--border-radius);
        transition: all 0.3s ease;
    }

    .continue-shopping:hover {
        background: var(--primary-color);
        transform: translateY(-2px);
    }
`;

// Add styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Enhanced animations and interactions with performance optimizations
$(document).ready(function() {
    // Smooth scroll with requestAnimationFrame
    $('a[href*="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $($(this).attr('href')).offset().top;
        const start = window.pageYOffset;
        const startTime = performance.now();
        const duration = 500;

        function animate(currentTime) {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = t => t<.5 ? 2*t*t : -1+(4-2*t)*t; // Custom easing
            
            window.scrollTo(0, start + (target - start) * ease(progress));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    });

    // Optimized form field animations using transforms
    $('.form-group input, .form-group textarea').focus(function() {
        $(this).parent().addClass('focused');
    }).blur(function() {
        if (!$(this).val()) {
            $(this).parent().removeClass('focused');
        }
    });

    // Debounced payment method selection
    const debounce = (fn, delay) => {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), delay);
        };
    };

    $('.payment-method-btn').click(debounce(function() {
        $('.payment-method-btn').removeClass('active');
        $(this).addClass('active');
    }, 100));

    // Optimized cart item hover effects
    $('.cart-item').hover(
        function() { 
            requestAnimationFrame(() => $(this).addClass('hovered'));
        },
        function() { 
            requestAnimationFrame(() => $(this).removeClass('hovered'));
        }
    );

    // Enhanced form validation feedback
    $('form input').on('invalid', function() {
        requestAnimationFrame(() => $(this).addClass('error'));
    }).on('input', debounce(function() {
        $(this).removeClass('error');
    }, 150));
});

// Handle purchase submission
async function handlePurchase(event) {
    event.preventDefault();
    
    const button = document.getElementById('submitButton');
    const buttonText = document.getElementById('submitButtonText');
    
    // Validate form
    if (!event.target.checkValidity()) {
        return;
    }

    try {
        // Add processing state
        button.classList.add('processing');
        buttonText.textContent = 'Processing...';
        
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success state
        button.style.background = 'var(--success-color)';
        buttonText.textContent = 'Purchase Complete!';
        
        // Add checkmark animation
        const checkmark = document.createElement('i');
        checkmark.className = 'fas fa-check-circle';
        button.appendChild(checkmark);
        
        // Redirect to confirmation page after delay
        setTimeout(() => {
            window.location.href = './payment.html';
        }, 1500);
        
    } catch (error) {
        // Handle error state
        button.style.background = 'var(--error-color)';
        buttonText.textContent = 'Error - Try Again';
        button.classList.remove('processing');
        
        console.error('Purchase failed:', error);
    }
}

// Enhanced modal handling with hardware acceleration
function showModal(modalId) {
    requestAnimationFrame(() => {
        $(`#${modalId}`).css({
            display: 'block',
            opacity: 0,
            transform: 'translateY(-20px)'
        }).animate({
            opacity: 1,
            transform: 'translateY(0)'
        }, {
            duration: 300,
            easing: 'easeOutCubic',
            step: function(now, fx) {
                if (fx.prop === 'transform') {
                    $(this).css('transform', `translateY(${now}px)`);
                }
            }
        });
    });
}

function closeModal(modalId) {
    requestAnimationFrame(() => {
        $(`#${modalId}`).animate({
            opacity: 0,
            transform: 'translateY(-20px)'
        }, {
            duration: 300,
            easing: 'easeInCubic',
            step: function(now, fx) {
                if (fx.prop === 'transform') {
                    $(this).css('transform', `translateY(${now}px)`);
                }
            },
            complete: function() {
                $(this).css('display', 'none');
            }
        });
    });
}

function updatePrice(quantity, pricePerUnit) {
    const newPrice = (quantity * pricePerUnit).toFixed(2);
    return `<span class="price-update">${newPrice}</span>`;
}

function updateTotalPrice() {
    // Calculate subtotal from all cart items
    const cartItems = document.querySelectorAll('.cart-item');
    let subtotal = 0;
    
    cartItems.forEach(item => {
        const price = parseFloat(item.querySelector('.price').getAttribute('data-price'));
        const quantity = parseInt(item.querySelector('.quantity-controls input').value);
        subtotal += price * quantity;
    });

    const taxRate = 0.10; // 10% tax rate
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    // Update display values
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function handleQuantityChange(input) {
    const quantity = parseInt(input.value);
    const cartItem = input.closest('.cart-item');
    const priceElement = cartItem.querySelector('.price');
    const pricePerUnit = parseFloat(priceElement.getAttribute('data-price'));
    const minusBtn = cartItem.querySelector('.minus');
    const plusBtn = cartItem.querySelector('.plus');

    // Enable/disable buttons based on quantity
    minusBtn.disabled = quantity <= 1;
    plusBtn.disabled = quantity >= 10;

    // Update price display for this item
    const newPrice = updatePrice(quantity, pricePerUnit);
    priceElement.innerHTML = newPrice;

    // Update subtotal and total
    updateTotalPrice();
}

function incrementQuantity(button) {
    const wrapper = button.parentElement;
    const input = wrapper.querySelector('input');
    const currentValue = parseInt(input.value);
    
    if (currentValue < 10) {
        input.value = currentValue + 1;
        handleQuantityChange(input);
    }
}

function decrementQuantity(button) {
    const wrapper = button.parentElement;
    const input = wrapper.querySelector('input');
    const currentValue = parseInt(input.value);
    
    if (currentValue > 1) {
        input.value = currentValue - 1;
        handleQuantityChange(input);
    }
}

// Initialize quantity controls on page load
document.addEventListener('DOMContentLoaded', function() {
    const quantityInputs = document.querySelectorAll('.quantity-controls input');
    quantityInputs.forEach(input => handleQuantityChange(input));
});