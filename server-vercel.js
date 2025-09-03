const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration CORS pour Vercel
app.use(cors({
  origin: [
    'https://full-op.vercel.app',
    'https://*.vercel.app',
    'http://localhost:3000',
    'http://localhost:5000'
  ],
  credentials: true
}));

// Augmenter la limite de taille des requêtes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Données en mémoire (comme server-test-local.js)
let products = [
  // Chaussures
  { _id: '1', name: 'Chaussures Premium Homme', category: 'chaussures', price: 15000, description: 'Chaussures de luxe pour homme', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400' },
  { _id: '2', name: 'Chaussures Élégantes Femme', category: 'chaussures', price: 12000, description: 'Chaussures élégantes pour femme', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400' },
  { _id: '3', name: 'Sneakers Urban', category: 'chaussures', price: 8000, description: 'Sneakers urbains confortables', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400' },
  { _id: '4', name: 'Chaussures Business', category: 'chaussures', price: 18000, description: 'Chaussures professionnelles', image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400' },
  { _id: '5', name: 'Bottes Hiver', category: 'chaussures', price: 22000, description: 'Bottes d\'hiver chaudes', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400' },
  { _id: '6', name: 'Chaussures Sport', category: 'chaussures', price: 9500, description: 'Chaussures de sport performantes', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400' },
  { _id: '7', name: 'Mocassins Classiques', category: 'chaussures', price: 14000, description: 'Mocassins classiques élégants', image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400' },
  { _id: '8', name: 'Chaussures Soirée', category: 'chaussures', price: 25000, description: 'Chaussures de soirée luxueuses', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400' },
  { _id: '9', name: 'Sandales Été', category: 'chaussures', price: 6500, description: 'Sandales d\'été confortables', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400' },
  { _id: '10', name: 'Chaussures Casual', category: 'chaussures', price: 7500, description: 'Chaussures casual décontractées', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400' },
  { _id: '11', name: 'Chaussures Vintage', category: 'chaussures', price: 16000, description: 'Chaussures vintage authentiques', image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400' },
  { _id: '12', name: 'Chaussures Minimalistes', category: 'chaussures', price: 11000, description: 'Chaussures minimalistes modernes', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400' },
  { _id: '13', name: 'Chaussures Rétro', category: 'chaussures', price: 13500, description: 'Chaussures rétro tendance', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400' },
  { _id: '14', name: 'Chaussures Streetwear', category: 'chaussures', price: 9000, description: 'Chaussures streetwear urbaines', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400' },
  { _id: '15', name: 'Chaussures Élégantes', category: 'chaussures', price: 17000, description: 'Chaussures élégantes sophistiquées', image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400' },
  { _id: '16', name: 'Chaussures Confort', category: 'chaussures', price: 12500, description: 'Chaussures confortables au quotidien', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400' },
  { _id: '17', name: 'Chaussures Premium', category: 'chaussures', price: 28000, description: 'Chaussures premium exclusives', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400' },
  { _id: '18', name: 'Chaussures Moderne', category: 'chaussures', price: 14500, description: 'Chaussures modernes innovantes', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400' },
  { _id: '19', name: 'Chaussures Classique', category: 'chaussures', price: 19500, description: 'Chaussures classiques intemporelles', image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400' },
  { _id: '20', name: 'Chaussures Trendy', category: 'chaussures', price: 11500, description: 'Chaussures trendy à la mode', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400' },
  
  // Sacoches
  { _id: '21', name: 'Sacoche Business Premium', category: 'sacoches', price: 25000, description: 'Sacoche professionnelle de luxe', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' },
  { _id: '22', name: 'Sac à Main Élégant', category: 'sacoches', price: 18000, description: 'Sac à main élégant et pratique', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400' },
  { _id: '23', name: 'Sac Bandoulière Moderne', category: 'sacoches', price: 12000, description: 'Sac bandoulière moderne et tendance', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400' },
  { _id: '24', name: 'Sac Weekend Spacieux', category: 'sacoches', price: 15000, description: 'Sac weekend spacieux et confortable', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' },
  { _id: '25', name: 'Pochette Soirée', category: 'sacoches', price: 8000, description: 'Pochette de soirée raffinée', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400' },
  { _id: '26', name: 'Sac Tote Polyvalent', category: 'sacoches', price: 9500, description: 'Sac tote polyvalent et pratique', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400' },
  { _id: '27', name: 'Sac Hobo Confortable', category: 'sacoches', price: 13500, description: 'Sac hobo confortable et élégant', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' },
  { _id: '28', name: 'Sac Messenger Urbain', category: 'sacoches', price: 11000, description: 'Sac messenger urbain et pratique', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400' },
  { _id: '29', name: 'Sac Clutch Minimaliste', category: 'sacoches', price: 7000, description: 'Sac clutch minimaliste et élégant', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400' },
  { _id: '30', name: 'Sac Bowling Sportif', category: 'sacoches', price: 16000, description: 'Sac bowling sportif et spacieux', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' },
  { _id: '31', name: 'Sac Crossbody Pratique', category: 'sacoches', price: 8500, description: 'Sac crossbody pratique et tendance', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400' },
  { _id: '32', name: 'Sac Trolley Voyage', category: 'sacoches', price: 35000, description: 'Sac trolley de voyage robuste', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400' },
  { _id: '33', name: 'Sac Dos Urbain', category: 'sacoches', price: 9000, description: 'Sac dos urbain et confortable', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' },
  { _id: '34', name: 'Sac Pochettes Multiples', category: 'sacoches', price: 12500, description: 'Sac avec pochettes multiples organisées', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400' },
  { _id: '35', name: 'Sac Besace Élégante', category: 'sacoches', price: 14000, description: 'Sac besace élégante et pratique', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400' },
  { _id: '36', name: 'Sac Shopping Luxueux', category: 'sacoches', price: 22000, description: 'Sac shopping luxueux et spacieux', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' },
  { _id: '37', name: 'Sac Portefeuille', category: 'sacoches', price: 6500, description: 'Sac portefeuille compact et élégant', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400' },
  { _id: '38', name: 'Sac Événementiel', category: 'sacoches', price: 18500, description: 'Sac événementiel sophistiqué', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400' },
  { _id: '39', name: 'Sac Collection Spéciale', category: 'sacoches', price: 45000, description: 'Sac de collection spéciale exclusive', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' },
  { _id: '40', name: 'Sac Signature', category: 'sacoches', price: 28000, description: 'Sac signature de la marque', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400' }
];

let orders = [];
let categories = [
  { _id: '1', name: 'chaussures', description: 'Chaussures de qualité' },
  { _id: '2', name: 'sacoches', description: 'Sacoches élégantes' }
];

// Routes API
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Serveur Vercel opérationnel' });
});

// Produits
app.get('/api/products', (req, res) => {
  res.json({ success: true, data: products });
});

app.post('/api/products', (req, res) => {
  try {
    const newProduct = {
      _id: Date.now().toString(),
      ...req.body,
      createdAt: new Date()
    };
    products.push(newProduct);
    res.json({ success: true, data: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/products/:id', (req, res) => {
  try {
    const index = products.findIndex(p => p._id === req.params.id);
    if (index !== -1) {
      products[index] = { ...products[index], ...req.body, updatedAt: new Date() };
      res.json({ success: true, data: products[index] });
    } else {
      res.status(404).json({ success: false, error: 'Produit non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/products/:id', (req, res) => {
  try {
    const index = products.findIndex(p => p._id === req.params.id);
    if (index !== -1) {
      const deletedProduct = products.splice(index, 1)[0];
      res.json({ success: true, data: deletedProduct });
    } else {
      res.status(404).json({ success: false, error: 'Produit non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Commandes
app.get('/api/orders', (req, res) => {
  res.json({ success: true, data: orders });
});

app.post('/api/orders', (req, res) => {
  try {
    const newOrder = {
      _id: Date.now().toString(),
      ...req.body,
      status: 'pending',
      createdAt: new Date()
    };
    orders.push(newOrder);
    res.json({ success: true, data: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/admin/orders/:id/status', (req, res) => {
  try {
    const order = orders.find(o => o._id === req.params.id);
    if (order) {
      order.status = req.body.status;
      order.updatedAt = new Date();
      res.json({ success: true, data: order });
    } else {
      res.status(404).json({ success: false, error: 'Commande non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/orders/:id', (req, res) => {
  try {
    const index = orders.findIndex(o => o._id === req.params.id);
    if (index !== -1) {
      const deletedOrder = orders.splice(index, 1)[0];
      res.json({ success: true, data: deletedOrder });
    } else {
      res.status(404).json({ success: false, error: 'Commande non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Catégories
app.get('/api/categories', (req, res) => {
  res.json({ success: true, data: categories });
});

app.post('/api/categories', (req, res) => {
  try {
    const newCategory = {
      _id: Date.now().toString(),
      ...req.body,
      createdAt: new Date()
    };
    categories.push(newCategory);
    res.json({ success: true, data: newCategory });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/categories/:id', (req, res) => {
  try {
    const index = categories.findIndex(c => c._id === req.params.id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...req.body, updatedAt: new Date() };
      res.json({ success: true, data: categories[index] });
    } else {
      res.status(404).json({ success: false, error: 'Catégorie non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/categories/:id', (req, res) => {
  try {
    const index = categories.findIndex(c => c._id === req.params.id);
    if (index !== -1) {
      const deletedCategory = categories.splice(index, 1)[0];
      res.json({ success: true, data: deletedCategory });
    } else {
      res.status(404).json({ success: false, error: 'Catégorie non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Statistiques admin
app.get('/api/admin/stats', (req, res) => {
  try {
    const stats = {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalCategories: categories.length,
      ordersByStatus: {
        pending: orders.filter(o => o.status === 'pending').length,
        confirmed: orders.filter(o => o.status === 'confirmed').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length
      }
    };
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Export des commandes
app.get('/api/admin/export/orders', (req, res) => {
  try {
    const csvData = orders.map(order => {
      return `${order._id},${order.customer?.firstName || ''},${order.customer?.lastName || ''},${order.customer?.phone || ''},${order.total},${order.status},${order.createdAt}`;
    }).join('\n');
    
    const csvHeader = 'ID,Prénom,Nom,Téléphone,Total,Statut,Date\n';
    const fullCsv = csvHeader + csvData;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=commandes.csv');
    res.send(fullCsv);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route par défaut pour Vercel
app.get('/', (req, res) => {
  res.json({ 
    message: 'API ORIGINALE PLUS - Serveur Vercel',
    status: 'Opérationnel',
    endpoints: [
      '/api/products',
      '/api/orders', 
      '/api/categories',
      '/api/admin/stats'
    ]
  });
});

// Démarrer le serveur
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur Vercel démarré sur http://localhost:${PORT}`);
    console.log(`📦 Produits chargés: ${products.length}`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
  });
}

// Export pour Vercel
module.exports = app;
