const { useState, useEffect, useRef } = React;

// --- ICON COMPONENTS ---
const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const Edit2Icon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
);

const Trash2Icon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const SaveIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);

const UploadCloudIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

// --- ADMIN IMAGE INPUT COMPONENT (PWA Camera/Local Upload) ---

const ImageInput = ({ value, onChange }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result); // Store as Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerInput = (accept, capture = null) => {
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
      <label className="block text-xs font-bold mb-2 text-black">Image Source:</label>
      <div className="flex flex-col sm:flex-row gap-2 mb-2">
        <button
          type="button"
          onClick={() => triggerInput('image/*', 'user')}
          className="flex-1 text-center bg-black text-white px-3 py-2 border-2 border-black hover:bg-gray-800 transition flex items-center justify-center gap-2 text-sm"
        >
          <CameraIcon />
          Snap Photo
        </button>
        <button
          type="button"
          onClick={() => triggerInput('image/*')}
          className="flex-1 text-center bg-white text-black px-3 py-2 border-2 border-black hover:bg-gray-100 transition flex items-center justify-center gap-2 text-sm"
        >
          <UploadCloudIcon />
          Local Upload
        </button>
      </div>
          
      {value && (
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-2">// Current Image Preview (Click image to clear)</p>
          <div className="relative w-full h-48 border-4 border-black cursor-pointer" onClick={() => onChange('')}>
            <img 
              src={value} 
              alt="Product Preview" 
              className="w-full h-full object-cover grayscale" 
            />
            <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 font-bold">Remove Image</span>
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

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const result = await storage.get('dispensary-products');
    // Using a slightly smaller placeholder image to reflect mobile focus
    const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjI1IiBmaWxsPSIjRjBGMEYwIi8+ICA8dGV4dCB4PSIxNTAiIHk9IjExMi41IiBmb250LWZhbWlseT0iSmV0QnJhaW5zIE1vbm8sIG1vbm9zcGFjZSIgZm9udC1zaXplPSIxOHB4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzAwMDAwMCI+e3Bob3RvX3ByZXNlbnR9PC90ZXh0Pjwvc3ZnPg==";

    if (result && result.value) {
      setProducts(JSON.parse(result.value));
    } else {
      const sampleProducts = [
        { id: '1', name: 'Blue Dream', category: 'Flower', price: '$45', thc: '18-24%', cbd: '<1%', description: 'A balanced hybrid strain with sweet berry aroma and cerebral, full-body effects.', image: placeholderImage },
        { id: '2', name: 'Sour Gummies', category: 'Edibles', price: '$25', thc: '10mg each', cbd: 'N/A', description: 'Delicious sour gummies, 10 pieces per pack. Perfect for controlled dosing.', image: placeholderImage },
        { id: '3', name: 'Live Resin', category: 'Concentrates', price: '$60', thc: '75-85%', cbd: '<1%', description: 'Premium live resin extract with full terpene profile and potent effects.', image: placeholderImage }
      ];
      saveProducts(sampleProducts);
      setProducts(sampleProducts);
    }
  };

  const saveProducts = async (productsToSave) => {
    await storage.set('dispensary-products', JSON.stringify(productsToSave));
  };

  const [formData, setFormData] = useState({
    name: '', category: 'Flower', price: '', thc: '', cbd: '', description: '', image: ''
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
    if (window.confirm("Confirm Delete?")) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      saveProducts(updated);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', category: 'Flower', price: '', thc: '', cbd: '', description: '', image: '' });
    setEditingProduct(null);
    setShowAdminModal(false);
  };

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-dvh bg-white text-black font-mono">
      {/* Header */}
      <div className="bg-white text-black border-b-4 border-black sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4"> {/* Reduced vertical padding */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Fraction Theory Dispensary
              </h1>
              <p className="text-gray-600 text-xs mt-1 tracking-wide">
                &gt; menu\_products.query()
              </p>
            </div>
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className="bg-black text-white px-3 py-1 font-bold text-xs sm:text-sm hover:bg-gray-800 transition border-2 border-black" // Smaller font/padding
            >
              {isAdmin ? 'Menu' : 'Admin Mode'}
            </button>
          </div>
        </div>
      </div>

      {!isAdmin ? (
        /* Customer Menu View */
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Category Filter - Horizontal Scroll */}
          <div className="mb-8 flex gap-2 overflow-x-auto pb-2 border-b-2 border-gray-200">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1 font-semibold text-xs whitespace-nowrap transition border-2 border-black ${ // Smaller button size
                selectedCategory === 'All'
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 font-semibold text-xs whitespace-nowrap transition border-2 border-black ${ // Smaller button size
                  selectedCategory === cat
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-white border-4 border-black hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition cursor-pointer"
                onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
              >
                <div className="relative h-48 overflow-hidden border-b-4 border-black">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-black text-white px-3 py-1 font-bold text-sm border-2 border-white">
                    {product.price}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold tracking-tight">{product.name}</h3>
                    <div className="ml-2 flex-shrink-0">
                      {expandedProduct === product.id ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </div>
                  </div>
                  <span className="inline-block bg-gray-100 text-black px-2 py-1 text-xs font-bold mb-3 border border-black">
                    {product.category}
                  </span>
                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    <div className="border-2 border-black p-2 bg-gray-50">
                      <div className="text-gray-500 font-semibold">THC:</div>
                      <div className="font-bold">{product.thc}</div>
                    </div>
                    <div                       className="border-2 border-black p-2 bg-gray-50">
                      <div className="text-gray-500 font-semibold">CBD:</div>
                      <div className="font-bold">{product.cbd}</div>
                    </div>
                  </div>
                  {expandedProduct === product.id && (
                    <div className="mt-4 pt-4 border-t-2 border-black">
                      <p className="text-sm leading-relaxed">{product.description}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16 border-4 border-black bg-white">
              <p className="text-lg font-bold">&gt; ERROR: No Products Found</p>
              <p className="text-sm text-gray-500 mt-2">// No items in this category</p>
            </div>
          )}
        </div>
      ) : (
        /* Admin Panel */
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold">&gt; Manage Products Admin</h2>
            <button
              onClick={() => { setShowAdminModal(true); setFormData({ name: '', category: 'Flower', price: '', thc: '', cbd: '', description: '', image: '' })}} // Ensure form is reset for new item
              className="bg-black text-white px-3 py-1 font-bold text-xs sm:text-sm hover:bg-gray-800 transition border-2 border-black flex items-center gap-1" // Reduced gap and padding
            >
              <PlusIcon />
              Add Item
            </button>
          </div>

          {/* Admin Product List */}
          <div className="border-4 border-black bg-white">
            {products.map((product, idx) => (
              <div 
                key={product.id} 
                className={`p-3 sm:p-4 flex items-center gap-3 hover:bg-gray-50 ${idx !== products.length - 1 ? 'border-b-2 border-black' : ''}`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover border-2 border-black flex-shrink-0 grayscale"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm truncate">{product.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {product.category} • {product.price}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-1 border-2 border-black hover:bg-black hover:text-white transition" // Smaller button padding
                  >
                    <Edit2Icon />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-1 border-2 border-black hover:bg-red-500 hover:border-red-500 hover:text-white transition" // Smaller button padding
                  >
                    <Trash2Icon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-4 border-black max-w-lg w-full max-h-[90dvh] overflow-y-auto shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <div className="p-4 sm:p-6 border-b-4 border-black flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-lg sm:text-xl font-bold">
                &gt; {editingProduct ? 'Edit Product Configuration' : 'New Product Entry'}
              </h3>
              <button onClick={resetForm} className="hover:bg-gray-100 p-1 border border-transparent">
                <XIcon />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              {/* Image Input with Camera/Upload */}
              <ImageInput value={formData.image} onChange={handleImageChange} />
              
              <div>
                <label className="block text-xs font-bold mb-2">Product Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-2">Category:</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black font-mono"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-4"> {/* Changed to 3 columns for better spacing */}
                <div>
                  <label className="block text-xs font-bold mb-2">Price:</label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="$45"
                    className="w-full px-2 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2">THC %:</label>
                  <input
                    type="text"
                    name="thc"
                    value={formData.thc}
                    onChange={handleInputChange}
                    placeholder="24%"
                    className="w-full px-2 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2">CBD %:</label>
                  <input
                    type="text"
                    name="cbd"
                    value={formData.cbd}
                    onChange={handleInputChange}
                    placeholder="<1%"
                    className="w-full px-2 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold mb-2">Description Notes:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black font-mono text-sm"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-black text-white px-4 py-2 font-bold text-sm hover:bg-gray-800 transition flex items-center justify-center gap-2" // Adjusted padding/font
                >
                  <SaveIcon />
                  {editingProduct ? 'Apply Update' : 'Save New'}
                </button>
                <button
                  onClick={resetForm}
                  className="px-4 py-2 border-2 border-black font-bold text-sm hover:bg-gray-100 transition" // Adjusted padding/font
                >
                  Cancel / Exit
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