const { useState, useEffect, useRef } = React;

// --- ICON COMPONENTS (Updated with new icons) ---

const XIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const Edit2Icon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
);

const Trash2Icon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const SaveIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const ChevronUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);

const CameraIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6-6 6 6"></path>
    <circle cx="12" cy="13" r="3"></circle>
    <path d="M18 20l-2-2 4-4"></path>
    <path d="M12 21H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3"></path>
    <path d="M21 12v3a2 2 0 0 1-2 2h-3"></path>
  </svg>
);

const UploadCloudIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 7.5"></path>
    <path d="M12 16v6"></path>
    <path d="M15 19l-3 3-3-3"></path>
  </svg>
);

// --- LOCAL STORAGE UTILITY ---

const storage = {
  get: async (key) => {
    try {
      const value = localStorage.getItem(key);
      return value ? { key, value } : null;
    } catch (e) {
      return null;
    }
  },
  set: async (key, value) => {
    try {
      localStorage.setItem(key, value);
      return { key, value };
    } catch (e) {
      return null;
    }
  }
};

// --- ADMIN IMAGE INPUT COMPONENT ---

const ImageInput = ({ value, onChange }) => {
  const inputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Store as Base64 string for PWA/Local Storage
        onChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerInput = (accept, capture = null) => {
    // Helper to trigger file input dynamically
    const tempInput = document.createElement('input');
    tempInput.type = 'file';
    tempInput.accept = accept;
    if (capture) {
      tempInput.setAttribute('capture', capture);
    }
    tempInput.onchange = handleFileChange;
    tempInput.click();
  };

  return (
    <div>
      <label className="block text-xs font-bold mb-2 text-neon-green">IMAGE_FILE:</label>
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => triggerInput('image/*', 'user')}
          className="flex-1 text-center bg-gray-900 text-white px-4 py-2 border-2 border-neon-green hover:bg-gray-800 transition flex items-center justify-center gap-2 text-sm"
        >
          <CameraIcon />
          [SNAP_PHOTO]
        </button>
        <button
          type="button"
          onClick={() => triggerInput('image/*')}
          className="flex-1 text-center bg-gray-900 text-white px-4 py-2 border-2 border-neon-green hover:bg-gray-800 transition flex items-center justify-center gap-2 text-sm"
        >
          <UploadCloudIcon />
          [LOCAL_UPLOAD]
        </button>
      </div>
          
      {value && (
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-2">// Current Image Preview (Click to clear)</p>
          <div className="relative w-full h-48 border-4 border-white cursor-pointer" onClick={() => onChange('')}>
            <img 
              src={value} 
              alt="Product Preview" 
              className="w-full h-full object-cover grayscale" 
            />
            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 font-bold">CLEAR_IMG</span>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN APPLICATION COMPONENT ---

const DispensaryApp = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories] = useState(['Flower', 'Edibles', 'Concentrates', 'Vapes', 'Topicals']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Added custom color for sleekness
  const NEON_GREEN = '#39FF14';

  // Initialize Tailwind with Neon Green
  useEffect(() => {
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            mono: ['"JetBrains Mono"', 'monospace'],
          },
          colors: {
            'neon-green': NEON_GREEN, // Add neon-green
            'terminal-black': '#121212', // Darker black for background
          }
        },
      },
    };
    // Re-evaluate Tailwind to apply custom colors
    if (typeof tailwind !== 'undefined') tailwind.config = tailwind.config;
  }, []);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const result = await storage.get('dispensary-products');
    if (result && result.value) {
      setProducts(JSON.parse(result.value));
    } else {
      // Sample data updated to use a placeholder image for local storage
      const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMjAyMDIwIi8+ICA8dGV4dCB4PSIyMDAiIHk9IjE1MCIgZm9udC1mYW1pbHk9IkpldEJyYWlucyBNb25vLCBtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMjRweCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiMzOUZGMTQiPntERVZfUEhPVE9fUEVSU0lTVFN9PC90ZXh0Pjwvc3ZnPg==";

      const sampleProducts = [
        {
          id: '1',
          name: 'Blue Dream',
          category: 'Flower',
          price: '$45',
          thc: '18-24%',
          cbd: '<1%',
          description: 'A balanced hybrid strain with sweet berry aroma and cerebral, full-body effects. A classic strain.',
          image: placeholderImage // Using placeholder for local image testing
        },
        {
          id: '2',
          name: 'Sour Gummies',
          category: 'Edibles',
          price: '$25',
          thc: '10mg each',
          cbd: 'N/A',
          description: 'Delicious sour gummies, 10 pieces per pack. Perfect for controlled dosing.',
          image: placeholderImage
        },
        {
          id: '3',
          name: 'Live Resin',
          category: 'Concentrates',
          price: '$60',
          thc: '75-85%',
          cbd: '<1%',
          description: 'Premium live resin extract with full terpene profile and potent effects.',
          image: placeholderImage
        }
      ];
      saveProducts(sampleProducts);
      setProducts(sampleProducts);
    }
  };

  const saveProducts = async (productsToSave) => {
    await storage.set('dispensary-products', JSON.stringify(productsToSave));
  };

  const [formData, setFormData] = useState({
    name: '',
    category: 'Flower',
    price: '',
    thc: '',
    cbd: '',
    description: '',
    image: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (base64Image) => {
    setFormData({ ...formData, image: base64Image });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.category || !formData.price) {
      alert("Product Name, Category, and Price are required.");
      return;
    }

    if (editingProduct) {
      const updated = products.map(p => 
        p.id === editingProduct.id ? { ...formData, id: p.id } : p
      );
      setProducts(updated);
      saveProducts(updated);
    } else {
      const newProduct = { ...formData, id: Date.now().toString() };
      const updated = [...products, newProduct];
      setProducts(updated);
      saveProducts(updated);
    }
    resetForm();
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowAdminModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("CONFIRM_DELETE?")) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      saveProducts(updated);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Flower',
      price: '',
      thc: '',
      cbd: '',
      description: '',
      image: ''
    });
    setEditingProduct(null);
    setShowAdminModal(false);
  };

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-dvh bg-terminal-black text-white font-mono">
      {/* Header */}
      <div className="bg-black text-white border-b-4 border-neon-green">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neon-green">
                FRACTION_THEORY_DISPENSARY
              </h1>
              <p className="text-gray-400 text-xs md:text-sm mt-1 tracking-wide">
                &gt; premium_cannabis_products.exec(0)
              </p>
            </div>
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className="bg-neon-green text-black px-4 py-2 font-bold text-sm hover:bg-white transition border-2 border-neon-green"
            >
              [{isAdmin ? 'MENU' : 'ADMIN_MODE'}]
            </button>
          </div>
        </div>
      </div>

      {!isAdmin ? (
        /* Customer Menu View (Sleek Dark Mode) */
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Category Filter */}
          <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-5 py-2 font-semibold text-sm whitespace-nowrap transition border-2 border-neon-green ${
                selectedCategory === 'All'
                  ? 'bg-neon-green text-black'
                  : 'bg-transparent text-neon-green hover:bg-gray-900'
              }`}
            >
              [ALL]
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 font-semibold text-sm whitespace-nowrap transition border-2 border-white ${
                  selectedCategory === cat
                    ? 'bg-white text-black'
                    : 'bg-transparent text-white hover:bg-gray-900'
                }`}
              >
                [{cat.toUpperCase()}]
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-terminal-black border-4 border-white hover:border-neon-green hover:shadow-[8px_8px_0px_0px_rgba(57,255,20,1)] transition cursor-pointer"
                onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
              >
                <div className="relative h-48 overflow-hidden border-b-4 border-white">
                  {/* Image: Use object-contain if base64 is not a good fit for cover */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-neon-green text-black px-3 py-1 font-bold text-sm border-2 border-black">
                    {product.price}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold tracking-tight text-white">{product.name}</h3>
                    <div className="ml-2 flex-shrink-0 text-neon-green">
                      {expandedProduct === product.id ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </div>
                  </div>
                  <span className="inline-block bg-white text-black px-2 py-1 text-xs font-bold mb-3">
                    {product.category.toUpperCase()}
                  </span>
                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    <div className="border-2 border-neon-green p-2 bg-gray-900">
                      <div className="text-gray-400 font-semibold">THC:</div>
                      <div className="font-bold text-neon-green">{product.thc}</div>
                    </div>
                    <div className="border-2 border-neon-green p-2 bg-gray-900">
                      <div className="text-gray-400 font-semibold">CBD:</div>
                      <div className="font-bold text-neon-green">{product.cbd}</div>
                    </div>
                  </div>
                  {expandedProduct === product.id && (
                    <div className="mt-4 pt-4 border-t-2 border-white">
                      <p className="text-sm leading-relaxed text-gray-300">{product.description}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16 border-4 border-neon-green bg-gray-900 text-neon-green">
              <p className="text-lg font-bold">&gt; ERROR: NO_PRODUCTS_FOUND</p>
              <p className="text-sm text-gray-500 mt-2">// Item list empty in category: {selectedCategory.toUpperCase()}</p>
            </div>
          )}
        </div>
      ) : (
        /* Admin Panel (Sleek Dark Mode) */
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-neon-green">&gt; MANAGE_PRODUCTS_ADMIN</h2>
            <button
              onClick={() => setShowAdminModal(true)}
              className="bg-neon-green text-black px-6 py-3 font-bold hover:bg-white transition border-2 border-neon-green flex items-center gap-2"
            >
              <PlusIcon />
              [ADD_ITEM]
            </button>
          </div>

          {/* Admin Product List */}
          <div className="border-4 border-neon-green bg-terminal-black">
            {products.map((product, idx) => (
              <div 
                key={product.id} 
                className={`p-4 flex items-center gap-4 hover:bg-gray-900 ${idx !== products.length - 1 ? 'border-b-2 border-white/20' : ''}`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover border-2 border-white grayscale"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-sm text-neon-green">{product.name}</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {product.category} • {product.price}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 border-2 border-neon-green text-neon-green hover:bg-neon-green hover:text-black transition"
                  >
                    <Edit2Icon />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
                  >
                    <Trash2Icon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Modal (Dark Mode) */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
          <div className="bg-terminal-black border-4 border-neon-green max-w-2xl w-full max-h-[90dvh] overflow-y-auto shadow-[12px_12px_0px_0px_rgba(57,255,20,0.5)]">
            <div className="p-6 border-b-4 border-neon-green flex justify-between items-center sticky top-0 bg-terminal-black">
              <h3 className="text-xl font-bold text-neon-green">
                &gt; {editingProduct ? 'EDIT_PRODUCT_CONFIG' : 'NEW_PRODUCT_ENTRY'}
              </h3>
              <button onClick={resetForm} className="text-white hover:text-neon-green p-1">
                <XIcon />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Image Input with Camera/Upload */}
              <ImageInput value={formData.image} onChange={handleImageChange} />

              <div>
                <label className="block text-xs font-bold mb-2 text-white">PRODUCT_NAME:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900 border-2 border-white text-neon-green focus:outline-none focus:ring-2 focus:ring-neon-green font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-2 text-white">CATEGORY:</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900 border-2 border-white text-neon-green focus:outline-none focus:ring-2 focus:ring-neon-green font-mono"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-black text-white">{cat}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-2 text-white">PRICE:</label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="$45"
                    className="w-full px-4 py-2 bg-gray-900 border-2 border-white text-neon-green focus:outline-none focus:ring-2 focus:ring-neon-green font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2 text-white">THC_POTENCY:</label>
                  <input
                    type="text"
                    name="thc"
                    value={formData.thc}
                    onChange={handleInputChange}
                    placeholder="18-24%"
                    className="w-full px-4 py-2 bg-gray-900 border-2 border-white text-neon-green focus:outline-none focus:ring-2 focus:ring-neon-green font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold mb-2 text-white">CBD_POTENCY:</label>
                <input
                  type="text"
                  name="cbd"
                  value={formData.cbd}
                  onChange={handleInputChange}
                  placeholder="<1%"
                  className="w-full px-4 py-2 bg-gray-900 border-2 border-white text-neon-green focus:outline-none focus:ring-2 focus:ring-neon-green font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-2 text-white">DESCRIPTION_NOTES:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-900 border-2 border-white text-white focus:outline-none focus:ring-2 focus:ring-neon-green font-mono text-sm"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-neon-green text-black px-6 py-3 font-bold hover:bg-white transition flex items-center justify-center gap-2"
                >
                  <SaveIcon />
                  [{editingProduct ? 'APPLY_UPDATE' : 'SAVE_NEW'}]
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 py-3 border-2 border-white text-white font-bold hover:bg-gray-800 transition"
                >
                  [CANCEL_EXIT]
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<DispensaryApp />, document.getElementById('root'));