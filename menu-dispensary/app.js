const { useState, useEffect } = React;

// Lucide icons as components
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

// Simple localStorage-based storage
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
    if (result && result.value) {
      setProducts(JSON.parse(result.value));
    } else {
      const sampleProducts = [
        {
          id: '1',
          name: 'Blue Dream',
          category: 'Flower',
          price: '$45',
          thc: '18-24%',
          cbd: '<1%',
          description: 'A balanced hybrid strain with sweet berry aroma and cerebral, full-body effects.',
          image: 'https://images.unsplash.com/photo-1605530520077-50d9ae6f3c46?w=400&h=300&fit=crop'
        },
        {
          id: '2',
          name: 'Sour Gummies',
          category: 'Edibles',
          price: '$25',
          thc: '10mg each',
          cbd: 'N/A',
          description: 'Delicious sour gummies, 10 pieces per pack. Perfect for controlled dosing.',
          image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&h=300&fit=crop'
        },
        {
          id: '3',
          name: 'Live Resin',
          category: 'Concentrates',
          price: '$60',
          thc: '75-85%',
          cbd: '<1%',
          description: 'Premium live resin extract with full terpene profile and potent effects.',
          image: 'https://images.unsplash.com/photo-1608279859640-af6d81d6b9b5?w=400&h=300&fit=crop'
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

  const handleSubmit = () => {
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
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    saveProducts(updated);
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
    <div className="min-h-screen bg-white font-mono">
      {/* Header */}
      <div className="bg-black text-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                FRACTION_THEORY_DISPENSARY
              </h1>
              <p className="text-gray-400 text-xs md:text-sm mt-1 tracking-wide">
                &gt; premium_cannabis_products.init()
              </p>
            </div>
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className="bg-white text-black px-4 py-2 font-bold text-sm hover:bg-gray-200 transition border-2 border-black"
            >
              [{isAdmin ? 'MENU' : 'ADMIN'}]
            </button>
          </div>
        </div>
      </div>

      {!isAdmin ? (
        /* Customer Menu View */
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Category Filter */}
          <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-5 py-2 font-semibold text-sm whitespace-nowrap transition border-2 border-black ${
                selectedCategory === 'All'
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              [ALL]
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 font-semibold text-sm whitespace-nowrap transition border-2 border-black ${
                  selectedCategory === cat
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-100'
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
                className="bg-white border-4 border-black hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition cursor-pointer"
                onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
              >
                <div className="relative h-48 overflow-hidden border-b-4 border-black">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition"
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
                  <span className="inline-block bg-black text-white px-2 py-1 text-xs font-bold mb-3">
                    {product.category.toUpperCase()}
                  </span>
                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    <div className="border-2 border-black p-2">
                      <div className="text-gray-500 font-semibold">THC:</div>
                      <div className="font-bold">{product.thc}</div>
                    </div>
                    <div className="border-2 border-black p-2">
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
              <p className="text-lg font-bold">&gt; ERROR: NO_PRODUCTS_FOUND</p>
              <p className="text-sm text-gray-500 mt-2">// No items in this category</p>
            </div>
          )}
        </div>
      ) : (
        /* Admin Panel */
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">&gt; MANAGE_PRODUCTS</h2>
            <button
              onClick={() => setShowAdminModal(true)}
              className="bg-black text-white px-6 py-3 font-bold hover:bg-gray-800 transition border-2 border-black flex items-center gap-2"
            >
              <PlusIcon />
              [ADD]
            </button>
          </div>

          {/* Admin Product List */}
          <div className="border-4 border-black bg-white">
            {products.map((product, idx) => (
              <div 
                key={product.id} 
                className={`p-4 flex items-center gap-4 hover:bg-gray-50 ${idx !== products.length - 1 ? 'border-b-2 border-black' : ''}`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover border-2 border-black grayscale"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-sm">{product.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {product.category} • {product.price}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 border-2 border-black hover:bg-gray-100 transition"
                  >
                    <Edit2Icon />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 border-2 border-black hover:bg-gray-100 transition"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-4 border-black max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <div className="p-6 border-b-4 border-black flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-xl font-bold">
                &gt; {editingProduct ? 'EDIT_PRODUCT' : 'NEW_PRODUCT'}
              </h3>
              <button onClick={resetForm} className="hover:bg-gray-100 p-1">
                <XIcon />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold mb-2">PRODUCT_NAME:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-2">CATEGORY:</label>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-2">PRICE:</label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="$45"
                    className="w-full px-4 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2">THC:</label>
                  <input
                    type="text"
                    name="thc"
                    value={formData.thc}
                    onChange={handleInputChange}
                    placeholder="18-24%"
                    className="w-full px-4 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold mb-2">CBD:</label>
                <input
                  type="text"
                  name="cbd"
                  value={formData.cbd}
                  onChange={handleInputChange}
                  placeholder="<1%"
                  className="w-full px-4 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-2">IMAGE_URL:</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-2">DESCRIPTION:</label>
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
                  className="flex-1 bg-black text-white px-6 py-3 font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2"
                >
                  <SaveIcon />
                  [{editingProduct ? 'UPDATE' : 'ADD'}]
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 py-3 border-2 border-black font-bold hover:bg-gray-100 transition"
                >
                  [CANCEL]
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