const express = require('express');
const cors = require('cors');

const PORT = 5000;
const app = express();

// Middleware CORS - Configuration complète
app.use(cors({
  origin: function (origin, callback) {
    // Autoriser toutes les origines pour le développement
    // Inclut localhost, 127.0.0.1, null (fichiers locaux), et file://
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5000', 
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5000',
      'file://',
      null // Pour les fichiers HTML ouverts directement
    ];
    
    // Autoriser les requêtes sans origine (fichiers locaux)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Autoriser toutes les origines en développement
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Données de test en mémoire - 40 produits (20 chaussures + 20 sacoches)
let products = [
  // === CHAUSSURES (20 produits) ===
  
  // Sneakers (5)
  {
    _id: '1',
    name: "Sneakers Urban Classic",
    category: "chaussures",
    price: 4500,
    originalPrice: 5500,
    description: "Sneakers urbaines classiques avec design moderne et confort optimal. Parfaites pour un style décontracté et élégant.",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500"
    ],
    colors: ["noir", "blanc", "gris"],
    sizes: ["39", "40", "41", "42", "43"],
    stock: 25,
    badge: "NOUVEAU",
    rating: 4.5,
    isNew: true,
    isActive: true
  },
  {
    _id: '2',
    name: "Sneakers Sport Performance",
    category: "chaussures",
    price: 5200,
    description: "Sneakers de performance sportive avec technologie de pointe pour un confort maximal et une excellente respirabilité.",
    images: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500"
    ],
    colors: ["bleu", "rouge", "noir"],
    sizes: ["40", "41", "42", "43", "44"],
    stock: 20,
    badge: "PROMO",
    rating: 4.3,
    isPromo: true,
    isActive: true
  },
  {
    _id: '3',
    name: "Sneakers Retro Vintage",
    category: "chaussures",
    price: 3800,
    description: "Sneakers rétro avec style vintage authentique. Design intemporel qui s'adapte à tous les looks.",
    images: [
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500"
    ],
    colors: ["marron", "beige", "noir"],
    sizes: ["39", "40", "41", "42"],
    stock: 15,
    rating: 4.7,
    isActive: true
  },
  {
    _id: '4',
    name: "Sneakers Minimaliste",
    category: "chaussures",
    price: 4200,
    description: "Sneakers minimalistes avec design épuré et élégant. Parfaites pour un style moderne et sophistiqué.",
    images: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500"
    ],
    colors: ["blanc", "noir", "gris"],
    sizes: ["40", "41", "42", "43"],
    stock: 18,
    badge: "NOUVEAU",
    rating: 4.4,
    isNew: true,
    isActive: true
  },
  {
    _id: '5',
    name: "Sneakers Street Style",
    category: "chaussures",
    price: 4800,
    description: "Sneakers street style avec attitude urbaine. Design audacieux pour les amateurs de mode streetwear.",
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500"
    ],
    colors: ["noir", "rouge", "jaune"],
    sizes: ["39", "40", "41", "42", "43"],
    stock: 22,
    rating: 4.6,
    isActive: true
  },

  // Chaussures de ville (5)
  {
    _id: '6',
    name: "Chaussures de Ville Élégantes",
    category: "chaussures",
    price: 6500,
    description: "Chaussures de ville élégantes en cuir véritable. Parfaites pour les occasions professionnelles et formelles.",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500"
    ],
    colors: ["noir", "marron", "bordeaux"],
    sizes: ["40", "41", "42", "43", "44"],
    stock: 12,
    badge: "PREMIUM",
    rating: 4.8,
    isActive: true
  },
  {
    _id: '7',
    name: "Chaussures Oxford Classiques",
    category: "chaussures",
    price: 7200,
    description: "Chaussures Oxford classiques avec finitions soignées. Style intemporel pour les hommes élégants.",
    images: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500"
    ],
    colors: ["noir", "marron"],
    sizes: ["41", "42", "43", "44"],
    stock: 10,
    badge: "PREMIUM",
    rating: 4.9,
    isActive: true
  },
  {
    _id: '8',
    name: "Chaussures Derby Modernes",
    category: "chaussures",
    price: 5800,
    description: "Chaussures Derby modernes avec design contemporain. Confort et style pour tous les jours.",
    images: [
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500"
    ],
    colors: ["noir", "gris", "beige"],
    sizes: ["40", "41", "42", "43"],
    stock: 16,
    rating: 4.5,
    isActive: true
  },
  {
    _id: '9',
    name: "Chaussures Loafer Premium",
    category: "chaussures",
    price: 6800,
    description: "Chaussures Loafer premium en cuir de qualité supérieure. Élégance et confort pour les hommes exigeants.",
    images: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500"
    ],
    colors: ["marron", "noir", "bordeaux"],
    sizes: ["41", "42", "43", "44"],
    stock: 8,
    badge: "PREMIUM",
    rating: 4.7,
    isActive: true
  },
  {
    _id: '10',
    name: "Chaussures Mocassin Confort",
    category: "chaussures",
    price: 5200,
    description: "Chaussures Mocassin avec semelle confortable. Style décontracté pour un confort quotidien.",
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500",
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500"
    ],
    colors: ["marron", "beige", "noir"],
    sizes: ["40", "41", "42", "43"],
    stock: 14,
    rating: 4.4,
    isActive: true
  },

  // Chaussures sport (5)
  {
    _id: '11',
    name: "Chaussures Running Pro",
    category: "chaussures",
    price: 8500,
    description: "Chaussures de running professionnelles avec technologie de pointe. Performance et confort pour les coureurs.",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500"
    ],
    colors: ["bleu", "rouge", "noir"],
    sizes: ["40", "41", "42", "43", "44"],
    stock: 20,
    badge: "NOUVEAU",
    rating: 4.6,
    isNew: true,
    isActive: true
  },
  {
    _id: '12',
    name: "Chaussures Fitness Performance",
    category: "chaussures",
    price: 7200,
    description: "Chaussures de fitness haute performance. Stabilité et flexibilité pour tous vos entraînements.",
    images: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500"
    ],
    colors: ["noir", "gris", "orange"],
    sizes: ["39", "40", "41", "42", "43"],
    stock: 18,
    rating: 4.5,
    isActive: true
  },
  {
    _id: '13',
    name: "Chaussures Basketball Street",
    category: "chaussures",
    price: 7800,
    description: "Chaussures de basketball street style. Performance sportive avec look urbain tendance.",
    images: [
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500"
    ],
    colors: ["noir", "rouge", "bleu"],
    sizes: ["40", "41", "42", "43", "44"],
    stock: 15,
    badge: "PROMO",
    rating: 4.7,
    isPromo: true,
    isActive: true
  },
  {
    _id: '14',
    name: "Chaussures Tennis Pro",
    category: "chaussures",
    price: 6800,
    description: "Chaussures de tennis professionnelles. Stabilité et adhérence pour les joueurs de tennis.",
    images: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500"
    ],
    colors: ["blanc", "noir", "vert"],
    sizes: ["40", "41", "42", "43"],
    stock: 12,
    rating: 4.4,
    isActive: true
  },
  {
    _id: '15',
    name: "Chaussures Football Indoor",
    category: "chaussures",
    price: 6200,
    description: "Chaussures de football indoor. Adhérence parfaite pour les terrains couverts.",
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500",
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500"
    ],
    colors: ["noir", "blanc", "rouge"],
    sizes: ["39", "40", "41", "42", "43"],
    stock: 16,
    rating: 4.3,
    isActive: true
  },

  // Chaussures élégantes (5)
  {
    _id: '16',
    name: "Chaussures Cravate Luxe",
    category: "chaussures",
    price: 9500,
    description: "Chaussures cravate de luxe en cuir véritable. Élégance suprême pour les occasions spéciales.",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500"
    ],
    colors: ["noir", "marron", "bordeaux"],
    sizes: ["41", "42", "43", "44"],
    stock: 8,
    badge: "PREMIUM",
    rating: 4.9,
    isActive: true
  },
  {
    _id: '17',
    name: "Chaussures Smoking Élégantes",
    category: "chaussures",
    price: 8800,
    description: "Chaussures smoking élégantes. Style sophistiqué pour les événements formels.",
    images: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500"
    ],
    colors: ["noir", "bordeaux"],
    sizes: ["40", "41", "42", "43"],
    stock: 6,
    badge: "PREMIUM",
    rating: 4.8,
    isActive: true
  },
  {
    _id: '18',
    name: "Chaussures Business Class",
    category: "chaussures",
    price: 7500,
    description: "Chaussures business class. Professionnalisme et confort pour le monde des affaires.",
    images: [
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500"
    ],
    colors: ["noir", "marron", "gris"],
    sizes: ["40", "41", "42", "43", "44"],
    stock: 14,
    rating: 4.6,
    isActive: true
  },
  {
    _id: '19',
    name: "Chaussures Cérémonie",
    category: "chaussures",
    price: 8200,
    description: "Chaussures de cérémonie. Élégance raffinée pour les moments importants de la vie.",
    images: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500"
    ],
    colors: ["noir", "marron"],
    sizes: ["41", "42", "43", "44"],
    stock: 10,
    badge: "PREMIUM",
    rating: 4.7,
    isActive: true
  },
  {
    _id: '20',
    name: "Chaussures Gala",
    category: "chaussures",
    price: 9200,
    description: "Chaussures de gala. Luxe et sophistication pour les événements prestigieux.",
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500",
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500"
    ],
    colors: ["noir", "bordeaux"],
    sizes: ["40", "41", "42", "43"],
    stock: 7,
    badge: "PREMIUM",
    rating: 4.9,
    isActive: true
  },

  // === SACOCHES (20 produits) ===
  
  // Sacoches homme (10)
  {
    _id: '21',
    name: "Sacoche Homme Business",
    category: "sacoches",
    price: 8500,
    description: "Sacoche homme business en cuir véritable. Parfaite pour transporter vos documents professionnels avec élégance.",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500"
    ],
    colors: ["noir", "marron", "bordeaux"],
    sizes: ["M", "L"],
    stock: 15,
    badge: "PREMIUM",
    rating: 4.7,
    isActive: true
  },
  {
    _id: '22',
    name: "Sacoche Homme Urbaine",
    category: "sacoches",
    price: 6200,
    description: "Sacoche homme urbaine avec style moderne. Idéale pour un look décontracté et tendance.",
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
    ],
    colors: ["noir", "gris", "bleu"],
    sizes: ["S", "M", "L"],
    stock: 20,
    badge: "NOUVEAU",
    rating: 4.5,
    isNew: true,
    isActive: true
  },
  {
    _id: '23',
    name: "Sacoche Homme Cuir Luxe",
    category: "sacoches",
    price: 12000,
    description: "Sacoche homme en cuir de luxe. Qualité exceptionnelle et finitions soignées pour les hommes exigeants.",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500"
    ],
    colors: ["marron", "noir", "bordeaux"],
    sizes: ["M", "L"],
    stock: 8,
    badge: "PREMIUM",
    rating: 4.9,
    isActive: true
  },
  {
    _id: '24',
    name: "Sacoche Homme Sport",
    category: "sacoches",
    price: 4800,
    description: "Sacoche homme sport avec design fonctionnel. Parfaite pour les activités sportives et outdoor.",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500"
    ],
    colors: ["noir", "bleu", "rouge"],
    sizes: ["S", "M", "L"],
    stock: 18,
    rating: 4.3,
    isActive: true
  },
  {
    _id: '25',
    name: "Sacoche Homme Vintage",
    category: "sacoches",
    price: 7200,
    description: "Sacoche homme vintage avec style rétro authentique. Design intemporel pour les amateurs de classiques.",
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
    ],
    colors: ["marron", "beige", "noir"],
    sizes: ["M", "L"],
    stock: 12,
    rating: 4.6,
    isActive: true
  },
  {
    _id: '26',
    name: "Sacoche Homme Minimaliste",
    category: "sacoches",
    price: 5800,
    description: "Sacoche homme minimaliste avec design épuré. Élégance simple pour un style moderne.",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500"
    ],
    colors: ["noir", "gris", "beige"],
    sizes: ["S", "M"],
    stock: 16,
    badge: "NOUVEAU",
    rating: 4.4,
    isNew: true,
    isActive: true
  },
  {
    _id: '27',
    name: "Sacoche Homme Executive",
    category: "sacoches",
    price: 9500,
    description: "Sacoche homme executive pour les dirigeants. Style professionnel et fonctionnalité optimale.",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500"
    ],
    colors: ["noir", "marron"],
    sizes: ["M", "L"],
    stock: 10,
    badge: "PREMIUM",
    rating: 4.8,
    isActive: true
  },
  {
    _id: '28',
    name: "Sacoche Homme Weekend",
    category: "sacoches",
    price: 5200,
    description: "Sacoche homme weekend avec style décontracté. Parfaite pour les sorties et voyages courts.",
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
    ],
    colors: ["gris", "bleu", "vert"],
    sizes: ["S", "M"],
    stock: 22,
    rating: 4.2,
    isActive: true
  },
  {
    _id: '29',
    name: "Sacoche Homme Tech",
    category: "sacoches",
    price: 6800,
    description: "Sacoche homme tech avec compartiments spécialisés. Idéale pour les professionnels de la technologie.",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500"
    ],
    colors: ["noir", "gris", "bleu"],
    sizes: ["M", "L"],
    stock: 14,
    badge: "PROMO",
    rating: 4.5,
    isPromo: true,
    isActive: true
  },
  {
    _id: '30',
    name: "Sacoche Homme Classic",
    category: "sacoches",
    price: 7800,
    description: "Sacoche homme classic avec style traditionnel. Élégance intemporelle pour tous les jours.",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500"
    ],
    colors: ["marron", "noir", "bordeaux"],
    sizes: ["M", "L"],
    stock: 12,
    rating: 4.7,
    isActive: true
  },

  // Sacoches femme (10)
  {
    _id: '31',
    name: "Sacoche Femme Élégante",
    category: "sacoches",
    price: 7200,
    description: "Sacoche femme élégante avec design raffiné. Parfaite pour les occasions spéciales et le travail.",
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
    ],
    colors: ["noir", "beige", "rose"],
    sizes: ["S", "M"],
    stock: 18,
    badge: "NOUVEAU",
    rating: 4.6,
    isNew: true,
    isActive: true
  },
  {
    _id: '32',
    name: "Sacoche Femme Business",
    category: "sacoches",
    price: 8500,
    description: "Sacoche femme business professionnelle. Style corporate avec fonctionnalité optimale.",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500"
    ],
    colors: ["noir", "marron", "bordeaux"],
    sizes: ["M", "L"],
    stock: 15,
    badge: "PREMIUM",
    rating: 4.7,
    isActive: true
  },
  {
    _id: '33',
    name: "Sacoche Femme Fashion",
    category: "sacoches",
    price: 6800,
    description: "Sacoche femme fashion avec style tendance. Design moderne pour les femmes branchées.",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500"
    ],
    colors: ["rose", "bleu", "vert"],
    sizes: ["S", "M"],
    stock: 20,
    rating: 4.4,
    isActive: true
  },
  {
    _id: '34',
    name: "Sacoche Femme Luxe",
    category: "sacoches",
    price: 11000,
    description: "Sacoche femme de luxe en cuir premium. Qualité exceptionnelle pour les femmes exigeantes.",
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
    ],
    colors: ["marron", "noir", "bordeaux"],
    sizes: ["M", "L"],
    stock: 8,
    badge: "PREMIUM",
    rating: 4.9,
    isActive: true
  },
  {
    _id: '35',
    name: "Sacoche Femme Casual",
    category: "sacoches",
    price: 5200,
    description: "Sacoche femme casual avec style décontracté. Parfaite pour les sorties quotidiennes.",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500"
    ],
    colors: ["gris", "beige", "rose"],
    sizes: ["S", "M"],
    stock: 25,
    rating: 4.3,
    isActive: true
  },
  {
    _id: '36',
    name: "Sacoche Femme Vintage",
    category: "sacoches",
    price: 7800,
    description: "Sacoche femme vintage avec charme rétro. Design authentique pour les amatrices de classiques.",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500"
    ],
    colors: ["marron", "beige", "bordeaux"],
    sizes: ["M", "L"],
    stock: 12,
    rating: 4.6,
    isActive: true
  },
  {
    _id: '37',
    name: "Sacoche Femme Minimaliste",
    category: "sacoches",
    price: 6200,
    description: "Sacoche femme minimaliste avec design épuré. Élégance simple pour un style moderne.",
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
    ],
    colors: ["noir", "gris", "beige"],
    sizes: ["S", "M"],
    stock: 18,
    badge: "NOUVEAU",
    rating: 4.5,
    isNew: true,
    isActive: true
  },
  {
    _id: '38',
    name: "Sacoche Femme Colorée",
    category: "sacoches",
    price: 5800,
    description: "Sacoche femme colorée avec style joyeux. Parfaite pour ajouter une touche de couleur à vos tenues.",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500"
    ],
    colors: ["rose", "jaune", "orange", "vert"],
    sizes: ["S", "M"],
    stock: 16,
    rating: 4.4,
    isActive: true
  },
  {
    _id: '39',
    name: "Sacoche Femme Premium",
    category: "sacoches",
    price: 9200,
    description: "Sacoche femme premium avec finitions soignées. Qualité supérieure pour les femmes sophistiquées.",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500"
    ],
    colors: ["noir", "marron", "bordeaux"],
    sizes: ["M", "L"],
    stock: 10,
    badge: "PREMIUM",
    rating: 4.8,
    isActive: true
  },
  {
    _id: '40',
    name: "Sacoche Femme Trendy",
    category: "sacoches",
    price: 6800,
    description: "Sacoche femme trendy avec style contemporain. Design à la mode pour les femmes modernes.",
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
    ],
    colors: ["bleu", "vert", "rose"],
    sizes: ["S", "M"],
    stock: 14,
    badge: "PROMO",
    rating: 4.5,
    isPromo: true,
    isActive: true
  }
];

let orders = [];

// Catégories de base
let categories = [
  { _id: '1', name: 'chaussures', description: 'Chaussures de qualité' },
  { _id: '2', name: 'sacoches', description: 'Sacoches élégantes' }
];

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'ORIGINALE PLUS API est opérationnelle (Mode Test)',
    timestamp: new Date().toISOString(),
    port: PORT,
    mode: 'test-local'
  });
});

// Produits
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    data: products,
    pagination: {
      page: 1,
      limit: 12,
      total: products.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    }
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p._id === req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Produit non trouvé'
    });
  }
  res.json({
    success: true,
    data: product
  });
});

app.post('/api/products', (req, res) => {
  const newProduct = {
    _id: (products.length + 1).toString(),
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  products.push(newProduct);
  res.status(201).json({
    success: true,
    message: 'Produit créé avec succès',
    data: newProduct
  });
});

app.put('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Produit non trouvé'
    });
  }
  products[index] = { ...products[index], ...req.body, updatedAt: new Date() };
  res.json({
    success: true,
    message: 'Produit mis à jour avec succès',
    data: products[index]
  });
});

app.delete('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Produit non trouvé'
    });
  }
  products.splice(index, 1);
  res.json({
    success: true,
    message: 'Produit supprimé avec succès'
  });
});

// Commandes
app.get('/api/orders', (req, res) => {
  res.json({
    success: true,
    data: orders,
    pagination: {
      page: 1,
      limit: 20,
      total: orders.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    }
  });
});

app.post('/api/orders', (req, res) => {
  const newOrder = {
    _id: (orders.length + 1).toString(),
    orderNumber: `OP${Date.now()}`,
    ...req.body,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  orders.push(newOrder);
  res.status(201).json({
    success: true,
    message: 'Commande créée avec succès',
    data: {
      orderNumber: newOrder.orderNumber,
      total: newOrder.total,
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    }
  });
});

app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o._id === req.params.id);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Commande non trouvée'
    });
  }
  res.json({
    success: true,
    data: order
  });
});

// Mettre à jour le statut d'une commande
app.put('/api/admin/orders/:id/status', (req, res) => {
  const order = orders.find(o => o._id === req.params.id);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Commande non trouvée'
    });
  }
  
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({
      success: false,
      message: 'Statut requis'
    });
  }
  
  order.status = status;
  order.updatedAt = new Date();
  
  res.json({
    success: true,
    message: 'Statut de la commande mis à jour',
    data: order
  });
});

// Supprimer une commande
app.delete('/api/orders/:id', (req, res) => {
  const index = orders.findIndex(o => o._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Commande non trouvée'
    });
  }
  
  orders.splice(index, 1);
  res.json({
    success: true,
    message: 'Commande supprimée avec succès'
  });
});

// Catégories
app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    data: categories
  });
});

// Ajouter une catégorie
app.post('/api/categories', (req, res) => {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Nom de catégorie requis'
    });
  }
  
  const newCategory = {
    _id: (categories.length + 1).toString(),
    name: name.trim(),
    description: description?.trim() || '',
    createdAt: new Date()
  };
  
  categories.push(newCategory);
  
  res.status(201).json({
    success: true,
    message: 'Catégorie créée avec succès',
    data: newCategory
  });
});

// Modifier une catégorie
app.put('/api/categories/:id', (req, res) => {
  const category = categories.find(c => c._id === req.params.id);
  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Catégorie non trouvée'
    });
  }
  
  const { name, description } = req.body;
  
  if (name) category.name = name.trim();
  if (description !== undefined) category.description = description.trim();
  
  res.json({
    success: true,
    message: 'Catégorie mise à jour avec succès',
    data: category
  });
});

// Supprimer une catégorie
app.delete('/api/categories/:id', (req, res) => {
  const index = categories.findIndex(c => c._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Catégorie non trouvée'
    });
  }
  
  categories.splice(index, 1);
  res.json({
    success: true,
    message: 'Catégorie supprimée avec succès'
  });
});

// Admin
app.get('/api/admin/stats', (req, res) => {
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  
  res.json({
    success: true,
    data: {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue: totalRevenue,
      pendingOrders: pendingOrders
    }
  });
});

// Export des commandes
app.get('/api/admin/export/orders', (req, res) => {
  try {
    const csvHeaders = 'Numéro,Client,Téléphone,Date,Total,Statut\n';
    const csvRows = orders.map(order => {
      const customerName = `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim();
      const date = new Date(order.createdAt).toLocaleDateString('fr-FR');
      const total = order.total || 0;
      const status = order.status || 'pending';
      
      return `${order.orderNumber || order._id},"${customerName}",${order.customer?.phone || ''},${date},${total},${status}`;
    }).join('\n');
    
    const csvContent = csvHeaders + csvRows;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="commandes.csv"');
    res.send(csvContent);
  } catch (error) {
    console.error('Erreur lors de l\'export:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'export des commandes'
    });
  }
});

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API ORIGINALE PLUS (Mode Test)',
    version: '1.0.0',
    mode: 'test-local',
    endpoints: {
      products: '/api/products',
      orders: '/api/orders',
      categories: '/api/categories',
      admin: '/api/admin',
      health: '/api/health'
    }
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur de test démarré sur http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Mode: Test local (sans base de données)`);
  console.log(`📦 Produits de test: ${products.length}`);
});

module.exports = app;
