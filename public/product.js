// Thumbnail click handler
document.querySelectorAll('.thumbnail').forEach(thumb => {
    thumb.addEventListener('click', function() {
        const mainImage = document.querySelector('.main-image img');
        const newSrc = this.querySelector('img').src;
        mainImage.src = newSrc;
    });
});

// Add to cart function
function addToCart(button, productId, productName, productPrice, productImage) {
    // Disable button and show loading state
    button.disabled = true;
    button.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Adding...';

    // Create product object
    const product = {
        _id: productId,
        name: productName,
        price: productPrice,
        imageUrl: productImage,
        quantity: 1
    };

    // Get existing cart or initialize new one
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(item => item._id === productId);
    
    if (existingProductIndex !== -1) {
        // Update quantity if product exists
        cart[existingProductIndex].quantity += 1;
    } else {
        // Add new product if it doesn't exist
        cart.push(product);
    }

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Show success state
    setTimeout(() => {
        button.innerHTML = '<i class="bx bx-check"></i> Added!';
        
        // Show notification
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        notificationMessage.textContent = `${productName} added to cart`;
        notification.style.display = 'flex';
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);

        // Reset button after 1.5 seconds
        setTimeout(() => {
            button.disabled = false;
            button.innerHTML = '<i class="bx bx-cart-add"></i> Add to Cart';
        }, 1500);
    }, 1000);
}

// Buy now function
function buyNow(productName) {
    window.location.href = '/payment';
}

// User dropdown
document.addEventListener('DOMContentLoaded', function() {
    const userIcon = document.getElementById('userIcon');
    if (userIcon) {
        userIcon.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdownMenu = this.nextElementSibling;
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.matches('#userIcon')) {
            const dropdowns = document.getElementsByClassName('dropdown-menu');
            for (const dropdown of dropdowns) {
                dropdown.style.display = 'none';
            }
        }
    });
});

// Add notification styles to the page
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        display: none;
        align-items: center;
        gap: 10px;
        z-index: 1000;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease-out;
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

    .notification i {
        font-size: 20px;
    }
`;

// Add styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet); 