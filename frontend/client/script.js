// Configuration API
const API_BASE_URL = 'https://full-op.vercel.app/api';

// Fonctions API
async function apiRequest(endpoint, options = {}) {
    try {
        console.log(`🌐 Appel API: ${API_BASE_URL}${endpoint}`);
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers
            },
            mode: 'cors',
            credentials: 'omit',
            ...options
        });
        
        console.log(`📊 Réponse API: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erreur API:', errorText);
            throw new Error(`Erreur API: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log('✅ Données reçues:', data);
        return data;
    } catch (error) {
        console.error('❌ Erreur API:', error);
        showToast(`Erreur de connexion: ${error.message}`, 'error');
        throw error;
    }
}

// ORIGINALE PLUS - E-commerce Script
// Variables globales
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let products = [];
let currentFilter = 'all';

// Initialisation
document.addEventListener('DOMContentLoaded', async function() {
    await loadProductsFromAPI();
    updateCartUI();
    
    // Animation au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observer les éléments animables
    document.querySelectorAll('.category-card, .product-card, .section-header').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});

// Charger les produits depuis l'API
async function loadProductsFromAPI() {
    try {
        console.log('🔄 Chargement des produits depuis l\'API...');
        
        const response = await apiRequest('/products');
        console.log('📦 Réponse API produits:', response);
        
        // L'API retourne { success: true, data: [...] }
        if (response.success && response.data) {
            products = response.data;
            console.log(`✅ ${products.length} produits chargés avec succès`);
        } else if (Array.isArray(response)) {
            // Fallback si l'API retourne directement un tableau
            products = response;
            console.log(`✅ ${products.length} produits chargés (format direct)`);
        } else {
            console.error('❌ Format de réponse inattendu:', response);
            products = [];
            showToast('Format de réponse inattendu', 'error');
        }
        
        loadProducts();
    } catch (error) {
        console.error('❌ Erreur lors du chargement des produits:', error);
        showToast(`Erreur: ${error.message}`, 'error');
        
        // Afficher un message d'erreur dans l'interface
        const productGrid = document.getElementById('product-grid');
        if (productGrid) {
            productGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #e31e24;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                    <h3>Erreur de connexion</h3>
                    <p>${error.message}</p>
                    <button onclick="loadProductsFromAPI()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #000; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Réessayer
                    </button>
                </div>
            `;
        }
    }
}

// Gestion du menu mobile
function toggleMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const menuToggle = document.querySelector('.menu-toggle');
    
    navMenu.classList.toggle('active');
    
    // Animation de l'icône hamburger
    const icon = menuToggle.querySelector('i');
    if (navMenu.classList.contains('active')) {
        icon.className = 'fas fa-times';
    } else {
        icon.className = 'fas fa-bars';
    }
}

// Fonctions de navigation
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// Gestion du panier
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    cartSidebar.classList.toggle('open');
    cartOverlay.classList.toggle('active');
    
    if (cartSidebar.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

function closeCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Chargement et affichage des produits
function loadProducts() {
    const productGrid = document.getElementById('product-grid');
    
    // Vérifier si les produits sont chargés
    if (!products || products.length === 0) {
        productGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #666;">
                <i class="fas fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <p>Chargement des produits...</p>
                <button onclick="loadProductsFromAPI()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #000; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Réessayer
                </button>
            </div>
        `;
        return;
    }
    
    let filteredProducts = products;
    
    if (currentFilter !== 'all') {
        filteredProducts = products.filter(product => {
            switch(currentFilter) {
                case 'chaussures':
                    return product.category === 'chaussures';
                case 'sacoches':
                    return product.category === 'sacoches';
                case 'nouveautes':
                    return product.isNew;
                case 'promotions':
                    return product.isPromo;
                default:
                    return true;
            }
        });
    }
    
    productGrid.innerHTML = filteredProducts.map(product => {
        const discountPercent = product.originalPrice ? 
            Math.round((1 - product.price / product.originalPrice) * 100) : 0;
            
        return `
            <div class="product-card" data-category="${product.category}">
                <div class="product-image">
                    <img src="${product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/300x300?text=Image+Non+Disponible'}" alt="${product.name}" loading="lazy">
                    ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                    ${product.rating ? `<div class="product-rating">${product.rating}</div>` : ''}
                </div>
                <div class="product-content">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-details">
                        <div class="detail-item">
                            <span class="detail-label">Catégorie:</span>
                            <span>${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Matériau:</span>
                            <span>Cuir véritable</span>
                        </div>
                    </div>
                    
                    <div class="color-options">
                        ${product.colors && Array.isArray(product.colors) ? product.colors.map(color => 
                            `<div class="color-option" style="background-color: ${color}" 
                                  onclick="selectColor(this, '${color}')" title="Couleur"></div>`
                        ).join('') : ''}
                    </div>
                    
                    <div class="size-options">
                        ${product.sizes && Array.isArray(product.sizes) ? product.sizes.map(size => 
                            `<div class="size-option" onclick="selectSize(this, '${size}')">${size}</div>`
                        ).join('') : ''}
                    </div>
                    
                    <div class="product-price">
                        ${product.originalPrice ? 
                            `<span style="text-decoration: line-through; color: #999; font-size: 1rem; margin-right: 0.5rem;">${product.originalPrice} DA</span>` : 
                            ''
                        }
                        ${product.price} DA
                        ${discountPercent > 0 ? `<span style="color: #e31e24; font-size: 0.9rem; margin-left: 0.5rem;">(-${discountPercent}%)</span>` : ''}
                    </div>
                    
                    <button class="add-to-cart-btn" onclick="addToCart('${product._id}')" ${product.stock <= 0 ? 'disabled' : ''}>
                        ${product.stock > 0 ? 'Ajouter au Panier' : 'Rupture de Stock'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Filtrage des produits
function filterProducts(category) {
    currentFilter = category;
    
    // Mise à jour des boutons de filtre
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    event.target.classList.add('active');
    
    // Animation de transition
    const productGrid = document.getElementById('product-grid');
    productGrid.style.opacity = '0.5';
    
    setTimeout(() => {
        loadProducts();
        productGrid.style.opacity = '1';
    }, 150);
}

// Sélection des options produit
function selectColor(element, color) {
    // Supprimer la sélection précédente
    element.parentElement.querySelectorAll('.color-option').forEach(opt => {
        opt.style.border = '2px solid #fff';
        opt.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    });
    
    // Sélectionner la couleur
    element.style.border = '3px solid #e31e24';
    element.style.boxShadow = '0 0 10px rgba(227,30,36,0.5)';
}

function selectSize(element, size) {
    // Supprimer la sélection précédente
    element.parentElement.querySelectorAll('.size-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Sélectionner la taille
    element.classList.add('selected');
}

// Ajout au panier
function addToCart(productId) {
    const product = products.find(p => p._id === productId);
    if (!product) return;
    
    const productCard = document.querySelector(`[data-category="${product.category}"]`);
    const selectedColor = productCard.querySelector('.color-option[style*="border: 3px solid"]');
    const selectedSize = productCard.querySelector('.size-option.selected');
    
    const cartItem = {
        productId: productId,
        name: product.name,
        price: product.price,
        image: product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/300x300?text=Image+Non+Disponible',
        color: selectedColor ? rgbToHex(selectedColor.style.backgroundColor) : (product.colors && Array.isArray(product.colors) ? product.colors[0] : '#000000'),
        size: selectedSize ? selectedSize.textContent : (product.sizes && Array.isArray(product.sizes) ? product.sizes[0] : 'Unique'),
        quantity: 1
    };
    
    // Vérifier si l'article existe déjà
    const existingItem = cart.find(item => 
        item.productId === productId && 
        item.color === cartItem.color && 
        item.size === cartItem.size
    );
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(cartItem);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    showToast('Produit ajouté au panier!', 'success');
    
    // Animation du bouton
    const btn = event.target;
    const originalText = btn.textContent;
    btn.innerHTML = '<i class="fas fa-check"></i> Ajouté!';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
    }, 1500);
}

// Mise à jour de l'interface du panier
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartEmpty = document.getElementById('cart-empty');
    const cartItems = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    const totalAmount = document.getElementById('total-amount');
    
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = itemCount;
    
    if (cart.length === 0) {
        cartEmpty.style.display = 'block';
        cartItems.style.display = 'none';
        cartSummary.style.display = 'none';
    } else {
        cartEmpty.style.display = 'none';
        cartItems.style.display = 'block';
        cartSummary.style.display = 'block';
        
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-info">
                        Couleur: <span style="color: ${item.color};">●</span> | 
                        Taille: ${item.size}
                    </div>
                    <div class="cart-item-price">${item.price} DA</div>
                    <div class="cart-item-actions">
                        <button class="quantity-btn" onclick="updateQuantity('${item.productId}', '${item.color}', '${item.size}', -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item.productId}', '${item.color}', '${item.size}', 1)">+</button>
                        <button class="remove-item" onclick="removeFromCart('${item.productId}', '${item.color}', '${item.size}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalAmount.textContent = total.toLocaleString() + ' DA';
    }
}

// Gestion des quantités
function updateQuantity(productId, color, size, change) {
    const item = cart.find(item => 
        item.productId === productId && 
        item.color === color && 
        item.size === size
    );
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId, color, size);
            return;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
    }
}

// Suppression du panier
function removeFromCart(productId, color, size) {
    cart = cart.filter(item => 
        !(item.productId === productId && item.color === color && item.size === size)
    );
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    showToast('Produit retiré du panier', 'error');
}

// Modal de commande
function showOrderModal() {
    if (cart.length === 0) {
        showToast('Votre panier est vide!', 'error');
        return;
    }
    
    const modal = document.getElementById('order-modal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    updateOrderSummary();
    closeCart();
}

function closeOrderModal() {
    const modal = document.getElementById('order-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Mise à jour du résumé de commande
function updateOrderSummary() {
    const summary = document.getElementById('modal-order-summary');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal >= 5000 ? 0 : 500;
    const total = subtotal + deliveryFee;
    
    summary.innerHTML = `
        <h4>Résumé de la commande</h4>
        ${cart.map(item => `
            <div class="summary-item">
                <span>${item.name} (${item.quantity}x)</span>
                <span>${(item.price * item.quantity).toLocaleString()} DA</span>
            </div>
        `).join('')}
        <div class="summary-item">
            <span>Sous-total</span>
            <span>${subtotal.toLocaleString()} DA</span>
        </div>
        <div class="summary-item">
            <span>Livraison</span>
            <span>${deliveryFee === 0 ? 'Gratuite' : deliveryFee + ' DA'}</span>
        </div>
        <div class="summary-item">
            <span><strong>Total</strong></span>
            <span><strong>${total.toLocaleString()} DA</strong></span>
        </div>
    `;
}

// Soumission de commande
document.getElementById('order-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const orderData = {
        customer: {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            address: formData.get('address'),
            city: formData.get('city'),
            postalCode: formData.get('postalCode')
        },
        items: cart.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            color: item.color,
            size: item.size
        })),
        delivery: formData.get('delivery'),
        payment: formData.get('payment'),
        notes: formData.get('notes'),
        subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        deliveryFee: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) >= 5000 ? 0 : 500,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + (cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) >= 5000 ? 0 : 500)
    };
    
    try {
        console.log('📦 Données de commande:', orderData);
        
        // Envoyer la commande à l'API
        const response = await apiRequest('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    
        // Vider le panier
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        
        closeOrderModal();
        updateCartUI();
        
        showToast('Commande confirmée! Nous vous contacterons bientôt.', 'success');
        
        // Afficher le numéro de commande
        if (response.data && response.data.orderNumber) {
            showToast(`Numéro de commande: ${response.data.orderNumber}`, 'success');
        }
        
    } catch (error) {
        console.error('Erreur lors de la soumission de la commande:', error);
        
        // Afficher les erreurs de validation spécifiques
        if (error.message.includes('Données invalides')) {
            try {
                const errorData = JSON.parse(error.message.split(' - ')[1]);
                if (errorData.errors && errorData.errors.length > 0) {
                    const errorMessages = errorData.errors.map(e => e.msg).join(', ');
                    showToast(`Erreur de validation: ${errorMessages}`, 'error');
                } else {
                    showToast(errorData.message || 'Erreur de validation', 'error');
                }
            } catch (parseError) {
                showToast('Erreur lors de la soumission de la commande', 'error');
            }
        } else {
            showToast(`Erreur: ${error.message}`, 'error');
        }
    }
});

// Système de notifications toast
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type} show`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Fonctions utilitaires
function rgbToHex(rgb) {
    const result = rgb.match(/\d+/g);
    if (result) {
        return '#' + result.map(x => (+x).toString(16).padStart(2, '0')).join('');
    }
    return rgb;
}

// Fermeture des modals en cliquant à l'extérieur
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Fonction de recherche
function toggleSearch() {
    const searchContainer = document.getElementById('search-container');
    if (searchContainer) {
        searchContainer.style.display = searchContainer.style.display === 'flex' ? 'none' : 'flex';
    }
}

// Fonction de recherche de produits
function searchProducts(query) {
    const products = document.querySelectorAll('.product-card');
    const searchTerm = query.toLowerCase();
    
    products.forEach(product => {
        const productName = product.querySelector('.product-name').textContent.toLowerCase();
        const productCategory = product.querySelector('.product-category')?.textContent.toLowerCase() || '';
        
        if (productName.includes(searchTerm) || productCategory.includes(searchTerm)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Fonction pour afficher la section À propos
function showAbout() {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Fonction pour le menu mobile
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuToggle = document.querySelector('.menu-toggle i');
    
    if (mobileMenu.classList.contains('show')) {
        mobileMenu.classList.remove('show');
        menuToggle.className = 'fas fa-bars';
    } else {
        mobileMenu.classList.add('show');
        menuToggle.className = 'fas fa-times';
    }
}

// Fermer le menu mobile quand on clique sur un lien
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            const mobileMenu = document.getElementById('mobile-menu');
            const menuToggle = document.querySelector('.menu-toggle i');
            mobileMenu.classList.remove('show');
            menuToggle.className = 'fas fa-bars';
        });
    });
});



// Ajout des sections manquantes
document.addEventListener('DOMContentLoaded', function() {
    // Ajouter la section À propos si elle n'existe pas
    if (!document.getElementById('about')) {
        const aboutSection = document.createElement('section');
        aboutSection.id = 'about';
        aboutSection.className = 'section';
        aboutSection.innerHTML = `
            <div class="container">
                <div class="section-header">
                    <h2>À Propos d'ORIGINALE PLUS</h2>
                    <p>Découvrez notre histoire et notre passion pour la qualité</p>
                </div>
                <div class="about-content">
                    <div class="about-text">
                        <h3>Notre Histoire</h3>
                        <p>ORIGINALE PLUS est née de la passion pour la mode et l'excellence. Depuis notre création, nous nous engageons à offrir des produits de qualité supérieure, alliant style moderne et tradition artisanale.</p>
                        
                        <h3>Notre Mission</h3>
                        <p>Nous nous efforçons de fournir à nos clients des chaussures et sacoches premium qui allient élégance, confort et durabilité. Chaque produit est sélectionné avec soin pour garantir votre satisfaction.</p>
                        
                        <h3>Notre Engagement</h3>
                        <p>Qualité, authenticité et service client sont au cœur de nos valeurs. Nous nous engageons à vous offrir une expérience d'achat exceptionnelle et des produits qui vous accompagnent dans tous vos moments.</p>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(aboutSection);
    }


});