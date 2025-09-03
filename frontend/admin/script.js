// Configuration API
        const API_BASE_URL = 'http://localhost:5000/api';

        // Fonctions API
        async function apiRequest(endpoint, options = {}) {
            try {
                console.log(`🌐 Appel API Admin: ${API_BASE_URL}${endpoint}`);
                
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
                
                console.log(`📊 Réponse API Admin: ${response.status} ${response.statusText}`);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Erreur API Admin:', errorText);
                    throw new Error(`Erreur API: ${response.status} - ${errorText}`);
                }
                
                const data = await response.json();
                console.log('✅ Données reçues Admin:', data);
                return data;
            } catch (error) {
                console.error('❌ Erreur API Admin:', error);
                showToast(`Erreur de connexion: ${error.message}`, 'error');
                throw error;
            }
        }

        // Variables globales
        let products = [];
        let orders = [];
        let categories = [];
        let currentEditingProduct = null;
        let currentEditingCategory = null;

        // Initialisation
        document.addEventListener('DOMContentLoaded', async function() {
            await initializeAdmin();
            loadDashboard();
            setupNavigation();
        });

        async function initializeAdmin() {
            try {
                // Charger les données depuis l'API
                await Promise.all([
                    loadProductsFromAPI(),
                    loadOrdersFromAPI(),
                    loadCategoriesFromAPI()
                ]);
            } catch (error) {
                console.error('Erreur lors de l\'initialisation:', error);
                showToast('Erreur lors du chargement des données', 'error');
            }
        }

        // Charger les produits depuis l'API
        async function loadProductsFromAPI() {
            try {
                const response = await apiRequest('/products');
                products = response.data || response;
            } catch (error) {
                console.error('Erreur lors du chargement des produits:', error);
                products = [];
            }
        }

        // Charger les commandes depuis l'API
        async function loadOrdersFromAPI() {
            try {
                const response = await apiRequest('/orders');
                orders = response.data || response;
            } catch (error) {
                console.error('Erreur lors du chargement des commandes:', error);
                orders = [];
            }
        }

        // Charger les catégories depuis l'API
        async function loadCategoriesFromAPI() {
            try {
                const response = await apiRequest('/categories');
                categories = response.data || response;
            } catch (error) {
                console.error('Erreur lors du chargement des catégories:', error);
                categories = [];
            }
        }

        // Navigation
        function setupNavigation() {
            document.querySelectorAll('.menu-item').forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    const page = this.dataset.page;
                    showPage(page);
                    
                    // Update active menu item
                    document.querySelectorAll('.menu-item').forEach(mi => mi.classList.remove('active'));
                    this.classList.add('active');
                });
            });
        }

        function showPage(pageId) {
            // Hide all pages
            document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
            
            // Show selected page
            document.getElementById(pageId + '-page').classList.remove('hidden');
            
            // Load page content
            switch(pageId) {
                case 'dashboard':
                    loadDashboard();
                    break;
                case 'products':
                    loadProducts();
                    break;
                case 'orders':
                    loadOrders();
                    break;
                        case 'categories':
            loadCategories();
            break;
            }
        }

        // Dashboard Functions
        async function loadDashboard() {
            await updateStats();
            loadRecentOrders();
        }

        async function updateStats() {
            try {
                const statsResponse = await apiRequest('/admin/stats');
                const stats = statsResponse.data || statsResponse;
                
                document.getElementById('total-products').textContent = stats.totalProducts || products.length;
                document.getElementById('total-orders').textContent = stats.totalOrders || orders.length;
                document.getElementById('total-revenue').textContent = (stats.totalRevenue || 0).toLocaleString() + ' DA';
                document.getElementById('pending-orders').textContent = stats.pendingOrders || 0;
            } catch (error) {
                console.error('Erreur lors du chargement des statistiques:', error);
                // Fallback aux données locales
            document.getElementById('total-products').textContent = products.length;
            document.getElementById('total-orders').textContent = orders.length;
            const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
            document.getElementById('total-revenue').textContent = totalRevenue.toLocaleString() + ' DA';
            const pendingOrders = orders.filter(order => order.status === 'pending').length;
            document.getElementById('pending-orders').textContent = pendingOrders;
            }
        }

        function loadRecentOrders() {
            const recentOrders = orders.slice(-5).reverse();
            const tbody = document.getElementById('recent-orders');
            
            if (recentOrders.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-light);">
                            Aucune commande trouvée
                        </td>
                    </tr>
                `;
                return;
            }
            
            tbody.innerHTML = recentOrders.map(order => `
                <tr>
                    <td>#${order.orderNumber || order._id}</td>
                    <td>${order.customer.firstName} ${order.customer.lastName}</td>
                    <td>${new Date(order.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td>${order.total.toLocaleString()} DA</td>
                    <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="viewOrder('${order._id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }

        // Products Functions
        function loadProducts() {
            const grid = document.getElementById('products-grid');
            
            if (products.length === 0) {
                grid.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-light);">
                        <i class="fas fa-box" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                        <p>Aucun produit trouvé</p>
                        <button class="btn btn-primary" onclick="openProductModal()" style="margin-top: 1rem;">
                            <i class="fas fa-plus"></i> Ajouter le premier produit
                        </button>
                    </div>
                `;
                return;
            }
            
            grid.innerHTML = products.map(product => `
                <div class="product-card">
                    <div class="product-image">
                        ${product.images && product.images.length > 0 ? 
                            `<img src="${product.images[0]}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">` :
                            `<i class="fas fa-image"></i>`
                        }
                    </div>
                    <div class="product-info">
                        <div class="product-name">${product.name}</div>
                        <div class="product-price">
                            ${product.originalPrice ? `<span style="text-decoration: line-through; color: #999; font-size: 1rem;">${product.originalPrice} DA</span> ` : ''}
                            ${product.price} DA
                        </div>
                        <p style="color: var(--text-light); margin-bottom: 1rem; font-size: 0.9rem;">
                            Catégorie: ${product.category} | Stock: ${product.stock || 'En stock'}
                        </p>
                        <div class="product-actions">
                            <button class="btn btn-sm btn-primary" onclick="editProduct('${product._id}')">
                                <i class="fas fa-edit"></i> Modifier
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product._id}')">
                                <i class="fas fa-trash"></i> Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Product Modal Functions
        function openProductModal(productId = null) {
            const modal = document.getElementById('product-modal');
            const form = document.getElementById('product-form');
            const title = document.getElementById('modal-title');
            
            if (productId) {
                const product = products.find(p => p._id === productId);
                if (product) {
                    title.textContent = 'Modifier Produit';
                    fillProductForm(product);
                    currentEditingProduct = product._id;
                }
            } else {
                title.textContent = 'Ajouter Produit';
                form.reset();
                document.getElementById('image-preview').innerHTML = '';
                currentEditingProduct = null;
            }
            
            modal.style.display = 'block';
        }

        function closeProductModal() {
            document.getElementById('product-modal').style.display = 'none';
            currentEditingProduct = null;
        }

        function fillProductForm(product) {
            document.getElementById('product-id').value = product._id;
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-category').value = product.category;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-original-price').value = product.originalPrice || '';
            document.getElementById('product-description').value = product.description || '';
            document.getElementById('product-colors').value = product.colors || '';
            document.getElementById('product-sizes').value = product.sizes || '';
            document.getElementById('product-badge').value = product.badge || '';
            document.getElementById('product-rating').value = product.rating || '';
            
            // Display existing images
            const preview = document.getElementById('image-preview');
            if (product.images && product.images.length > 0) {
                preview.innerHTML = product.images.map((img, index) => `
                    <div class="preview-item">
                        <img src="${img}" alt="Product image">
                        <button type="button" class="preview-remove" onclick="removeExistingImage(${index})">&times;</button>
                    </div>
                `).join('');
            }
        }

        function editProduct(productId) {
            openProductModal(productId);
        }

        async function deleteProduct(productId) {
            if (confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
                try {
                    await apiRequest(`/products/${productId}`, {
                        method: 'DELETE'
                    });
                    
                    products = products.filter(p => p._id !== productId);
                loadProducts();
                    updateStats();
                showToast('Produit supprimé avec succès!', 'success');
                } catch (error) {
                    console.error('Erreur lors de la suppression:', error);
                    showToast('Erreur lors de la suppression du produit', 'error');
                }
            }
        }

        // File Upload Handler
        document.getElementById('product-images').addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            const preview = document.getElementById('image-preview');
            
            files.forEach((file, index) => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const previewItem = document.createElement('div');
                        previewItem.className = 'preview-item';
                        previewItem.innerHTML = `
                            <img src="${e.target.result}" alt="Preview">
                            <button type="button" class="preview-remove" onclick="removePreviewImage(this)">&times;</button>
                        `;
                        preview.appendChild(previewItem);
                    };
                    reader.readAsDataURL(file);
                }
            });
        });

        function removePreviewImage(button) {
            button.parentElement.remove();
        }

        function removeExistingImage(index) {
            if (currentEditingProduct) {
                const product = products.find(p => p._id === currentEditingProduct);
                if (product && product.images) {
                    product.images.splice(index, 1);
                    fillProductForm(product);
                }
            }
        }

        // Product Form Submit
        document.getElementById('product-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const imageElements = document.querySelectorAll('#image-preview img');
            const images = Array.from(imageElements).map(img => img.src);
            
            const productData = {
                name: formData.get('name'),
                category: formData.get('category'),
                price: parseInt(formData.get('price')),
                originalPrice: formData.get('originalPrice') ? parseInt(formData.get('originalPrice')) : null,
                description: formData.get('description'),
                colors: formData.get('colors') ? formData.get('colors').split(',').map(c => c.trim()) : [],
                sizes: formData.get('sizes') ? formData.get('sizes').split(',').map(s => s.trim()) : [],
                badge: formData.get('badge'),
                rating: formData.get('rating') ? parseFloat(formData.get('rating')) : null,
                images: images,
                stock: parseInt(formData.get('stock')) || 100,
                isNew: formData.get('badge') === 'NOUVEAU',
                isPromo: formData.get('badge') === 'PROMO',
                isActive: true
            };
            
            try {
            if (currentEditingProduct) {
                // Update existing product
                    const response = await apiRequest(`/products/${currentEditingProduct}`, {
                        method: 'PUT',
                        body: JSON.stringify(productData)
                    });
                    
                    const index = products.findIndex(p => p._id === currentEditingProduct);
                if (index !== -1) {
                    products[index] = { ...products[index], ...productData };
                }
                    showToast('Produit modifié avec succès!', 'success');
            } else {
                // Add new product
                    const response = await apiRequest('/products', {
                        method: 'POST',
                        body: JSON.stringify(productData)
                    });
                    
                    const newProduct = response.data || response;
                    products.push(newProduct);
                showToast('Produit ajouté avec succès!', 'success');
            }
            
            closeProductModal();
            loadProducts();
            updateStats();
            } catch (error) {
                console.error('Erreur lors de la sauvegarde:', error);
                showToast('Erreur lors de la sauvegarde du produit', 'error');
            }
        });

        // Orders Functions
        function loadOrders() {
            const tbody = document.getElementById('all-orders');
            
            if (orders.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-light);">
                            Aucune commande trouvée
                        </td>
                    </tr>
                `;
                return;
            }
            
            tbody.innerHTML = orders.map(order => `
                <tr>
                    <td>#${order.orderNumber || order._id}</td>
                    <td>${order.customer.firstName} ${order.customer.lastName}</td>
                    <td>${order.customer.phone}</td>
                    <td>${new Date(order.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td>${order.total.toLocaleString()} DA</td>
                    <td>
                        <select onchange="updateOrderStatus('${order._id}', this.value)" class="form-control" style="padding: 0.25rem; font-size: 0.8rem;">
                            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>En attente</option>
                            <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmée</option>
                            <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Expédiée</option>
                            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Livrée</option>
                            <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Annulée</option>
                        </select>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="viewOrder('${order._id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteOrder('${order._id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }

        async function viewOrder(orderId) {
            try {
                const response = await apiRequest(`/orders/${orderId}`);
                const order = response.data || response;
            
            const modal = document.getElementById('order-modal');
            const content = document.getElementById('order-details');
            
            content.innerHTML = `
                <div style="margin-bottom: 2rem;">
                        <h3>Commande #${order.orderNumber || order._id}</h3>
                        <p style="color: var(--text-light);">Passée le ${new Date(order.createdAt).toLocaleDateString('fr-FR')} à ${new Date(order.createdAt).toLocaleTimeString('fr-FR')}</p>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                    <div style="background: var(--bg-light); padding: 1.5rem; border-radius: 10px;">
                        <h4 style="margin-bottom: 1rem; color: var(--primary);">Informations Client</h4>
                        <p><strong>Nom:</strong> ${order.customer.firstName} ${order.customer.lastName}</p>
                        <p><strong>Téléphone:</strong> ${order.customer.phone}</p>
                        <p><strong>Email:</strong> ${order.customer.email || 'Non fourni'}</p>
                        <p><strong>Adresse:</strong> ${order.customer.address}</p>
                        <p><strong>Ville:</strong> ${order.customer.city}</p>
                    </div>
                    
                    <div style="background: var(--bg-light); padding: 1.5rem; border-radius: 10px;">
                        <h4 style="margin-bottom: 1rem; color: var(--primary);">Détails Commande</h4>
                        <p><strong>Statut:</strong> <span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></p>
                        <p><strong>Livraison:</strong> ${order.delivery === 'express' ? 'Express (1-2 jours)' : 'Standard (3-5 jours)'}</p>
                        <p><strong>Paiement:</strong> ${order.payment === 'cod' ? 'À la livraison' : 'Virement bancaire'}</p>
                        <p><strong>Total:</strong> <span style="color: var(--accent); font-weight: bold;">${order.total.toLocaleString()} DA</span></p>
                    </div>
                </div>
                
                <div style="background: var(--bg-light); padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem;">
                    <h4 style="margin-bottom: 1rem; color: var(--primary);">Produits Commandés</h4>
                    <div style="overflow-x: auto;">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Produit</th>
                                    <th>Couleur</th>
                                    <th>Taille</th>
                                    <th>Quantité</th>
                                    <th>Prix unitaire</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${(order.products || order.items || []).map(item => `
                                    <tr>
                                        <td>${item.name}</td>
                                        <td>${item.color || 'Standard'}</td>
                                        <td>${item.size || 'Unique'}</td>
                                        <td>${item.quantity}</td>
                                        <td>${item.price.toLocaleString()} DA</td>
                                        <td>${(item.price * item.quantity).toLocaleString()} DA</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                ${order.notes ? `
                    <div style="background: var(--bg-light); padding: 1.5rem; border-radius: 10px;">
                        <h4 style="margin-bottom: 1rem; color: var(--primary);">Notes</h4>
                        <p>${order.notes}</p>
                    </div>
                ` : ''}
            `;
            
            modal.style.display = 'block';
            } catch (error) {
                console.error('Erreur lors du chargement des détails:', error);
                showToast('Erreur lors du chargement des détails', 'error');
            }
        }

        function closeOrderModal() {
            document.getElementById('order-modal').style.display = 'none';
        }

        async function updateOrderStatus(orderId, newStatus) {
            try {
                await apiRequest(`/admin/orders/${orderId}/status`, {
                    method: 'PUT',
                    body: JSON.stringify({ status: newStatus })
                });
                
                const order = orders.find(o => o._id === orderId);
            if (order) {
                order.status = newStatus;
                }
                
                updateStats();
                showToast('Statut mis à jour!', 'success');
            } catch (error) {
                console.error('Erreur lors de la mise à jour du statut:', error);
                showToast('Erreur lors de la mise à jour du statut', 'error');
            }
        }

        async function deleteOrder(orderId) {
            if (confirm('Êtes-vous sûr de vouloir supprimer cette commande?')) {
                try {
                    await apiRequest(`/orders/${orderId}`, {
                        method: 'DELETE'
                    });
                    
                    orders = orders.filter(o => o._id !== orderId);
                loadOrders();
                updateStats();
                showToast('Commande supprimée!', 'error');
                } catch (error) {
                    console.error('Erreur lors de la suppression:', error);
                    showToast('Erreur lors de la suppression de la commande', 'error');
                }
            }
        }

        async function exportOrders() {
            try {
                const response = await apiRequest('/admin/export/orders');
                const csvContent = response.data || response;
            
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', `commandes_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showToast('Export terminé!', 'success');
            } catch (error) {
                console.error('Erreur lors de l\'export:', error);
                showToast('Erreur lors de l\'export', 'error');
            }
        }

        // Categories Functions
        function loadCategories() {
            const container = document.getElementById('categories-list');
            
            if (categories.length === 0) {
                container.innerHTML = `
                    <p style="text-align: center; color: var(--text-light); padding: 2rem;">
                        Aucune catégorie trouvée. Ajoutez votre première catégorie.
                    </p>
                `;
                return;
            }
            
            container.innerHTML = categories.map(category => `
                <div style="background: var(--white); padding: 1.5rem; border-radius: 10px; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="margin-bottom: 0.5rem;">${category.name}</h4>
                        <p style="color: var(--text-light); margin: 0;">${category.description || 'Aucune description'}</p>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-sm btn-primary" onclick="editCategory('${category._id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteCategory('${category._id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }

        function editCategory(categoryId) {
            const category = categories.find(c => c._id === categoryId);
            if (category) {
                // Remplir le formulaire avec les données de la catégorie
                document.getElementById('category-name').value = category.name;
                document.getElementById('category-description').value = category.description || '';
                
                // Changer le mode d'édition
                currentEditingCategory = categoryId;
                document.getElementById('category-form').querySelector('button[type="submit"]').textContent = 'Modifier la catégorie';
                
                // Afficher le modal
                document.getElementById('category-modal').style.display = 'block';
            }
        }

        async function deleteCategory(categoryId) {
            if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
                try {
                    await apiRequest(`/categories/${categoryId}`, { method: 'DELETE' });
                    showToast('Catégorie supprimée avec succès!', 'success');
                    await loadCategoriesFromAPI();
                    loadCategories();
                } catch (error) {
                    console.error('Erreur lors de la suppression:', error);
                    showToast('Erreur lors de la suppression de la catégorie', 'error');
                }
            }
        }



        // Category Modal Functions
        function openCategoryModal() {
            const modal = document.getElementById('category-modal');
            const title = document.getElementById('category-modal-title');
            const form = document.getElementById('category-form');
            
            // Reset form
            form.reset();
            currentEditingCategory = null;
            title.textContent = 'Ajouter Catégorie';
            form.querySelector('button[type="submit"]').textContent = 'Ajouter la catégorie';
            
            modal.style.display = 'block';
        }

        function closeCategoryModal() {
            document.getElementById('category-modal').style.display = 'none';
        }

        // Category Form Handler
        document.getElementById('category-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const categoryData = {
                name: document.getElementById('category-name').value,
                description: document.getElementById('category-description').value
            };
            
            try {
                if (currentEditingCategory) {
                    // Modifier la catégorie existante
                    await apiRequest(`/categories/${currentEditingCategory}`, {
                        method: 'PUT',
                        body: JSON.stringify(categoryData)
                    });
                    showToast('Catégorie modifiée avec succès!', 'success');
                } else {
                    // Ajouter une nouvelle catégorie
                    await apiRequest('/categories', {
                        method: 'POST',
                        body: JSON.stringify(categoryData)
                    });
                    showToast('Catégorie ajoutée avec succès!', 'success');
                }
                
                closeCategoryModal();
                await loadCategoriesFromAPI();
                loadCategories();
                
            } catch (error) {
                console.error('Erreur lors de la sauvegarde:', error);
                showToast('Erreur lors de la sauvegarde de la catégorie', 'error');
            }
        });

        // Settings Form Handler


        // Utility Functions
        function getStatusText(status) {
            const statusMap = {
                pending: 'En attente',
                confirmed: 'Confirmée',
                shipped: 'Expédiée',
                delivered: 'Livrée',
                cancelled: 'Annulée'
            };
            return statusMap[status] || status;
        }

        function showToast(message, type = 'success') {
            const toast = document.createElement('div');
            toast.className = `toast ${type} show`;
            toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}"></i> ${message}`;
            
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (document.body.contains(toast)) {
                        document.body.removeChild(toast);
                    }
                }, 300);
            }, 3000);
        }

        // Modal Click Outside Close
        window.onclick = function(event) {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }



        // Configuration pour le déploiement en production
        if (window.location.hostname !== 'localhost') {
            // En production, utiliser l'URL du backend déployé
            window.API_BASE_URL = 'http://localhost:5000/api';
        }
