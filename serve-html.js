const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Servir les fichiers statiques
app.use(express.static('.'));

// Route pour le client
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/client/index.html'));
});

// Route pour l'admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/admin/index.html'));
});

app.get('/test-admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-admin-api.html'));
});

// Route pour les fichiers statiques du frontend
app.use('/frontend', express.static(path.join(__dirname, 'frontend')));

app.listen(PORT, () => {
    console.log(`🌐 Serveur HTML démarré sur http://localhost:${PORT}`);
    console.log(`📱 Site client: http://localhost:${PORT}`);
    console.log(`👨‍💼 Dashboard admin: http://localhost:${PORT}/admin`);
    console.log(`🔗 API: http://localhost:5000/api`);
    console.log(`📁 Frontend organisé dans: frontend/`);
});