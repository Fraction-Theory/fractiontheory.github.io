// --- APP COMPONENT ---
const App = () => {
  const [view, setView] = useState('menu');
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [expanded, setExpanded] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  
  // Google Auth State
  const [gapiReady, setGapiReady] = useState(false);
  const [user, setUser] = useState(null);
  const [syncing, setSyncing] = useState(false);
  // State to track if the initial load is complete (local or drive)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Form State
  const [form, setForm] = useState({ name: '', category: 'Flower', price: '', thc: '', cbd: '', desc: '', image: '' });

  const categories = ['Hash', 'Flower', 'Edibles','Rosin', ];

  // Init Google API
  useEffect(() => {
    if(GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
        console.warn("Google Client ID not set. Drive sync will not work.");
    }
    DriveService.init(setGapiReady);
  }, []);

  // Initial Load (Local storage fallback)
  useEffect(() => {
    // Only run this once to load initial data from local storage
    if (!initialLoadComplete) {
      const local = localStorage.getItem('ft-products');
      if (local) {
        setProducts(JSON.parse(local));
      } else {
        const defaults = [
          { id: '1', name: 'Blue Dream', category: 'Flower', price: '$45', thc: '22%', cbd: '<1%', desc: 'Classic sativa-dominant hybrid. Sweet berry aroma with full-body relaxation.', image: PLACEHOLDERS.flower },
          { id: '2', name: 'Magic Gummies', category: 'Edibles', price: '$20', thc: '100mg', cbd: '0mg', desc: 'Pack of 10 watermelon gummies. 10mg THC per piece.', image: PLACEHOLDERS.edible },
          { id: '3', name: 'Live Rosin', category: 'Concentrates', price: '$70', thc: '85%', cbd: '2%', desc: 'Solventless extract. Pure flavor and high potency.', image: PLACEHOLDERS.extract }
        ];
        setProducts(defaults);
        localStorage.setItem('ft-products', JSON.stringify(defaults));
      }
      setInitialLoadComplete(true);
    }
  }, [initialLoadComplete]); // Depend on initialLoadComplete

  const syncFromCloud = async () => {
    setSyncing(true);
    try {
      const cloudData = await DriveService.loadData();
      if (cloudData) {
        // Crucial: Overwrite local data with cloud data to sync
        setProducts(cloudData);
        localStorage.setItem('ft-products', JSON.stringify(cloudData));
        console.log("Data loaded and synced from Google Drive.");
      } else {
        // If no file exists in Drive, upload current local data for first sync
        await DriveService.saveData(products);
        console.log("No file found. Uploaded current local data to Drive.");
      }
    } catch (e) {
      console.error("Cloud Load/Initial Save Error", e);
    } finally {
      setSyncing(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!gapiReady) return alert('Google API not ready. Check keys or internet.');
    try {
      await DriveService.login();
      setUser(true);
      // FIX: Call syncFromCloud immediately after successful login
      await syncFromCloud();
    } catch (err) {
      console.error(err);
      alert('Login Failed');
    }
  };

  const syncToCloud = async (newData) => {
    if (!user) return; // Only sync if logged in
    setSyncing(true);
    try {
      await DriveService.saveData(newData);
    } catch (e) {
      console.error("Cloud Save Error", e);
      alert("Failed to sync to Drive");
    } finally {
      setSyncing(false);
    }
  };
  
  // Removed the now redundant syncFromCloud function definition from here
  // to move it above handleGoogleLogin for clarity and to allow initial save logic.

  const handleSave = async () => {
    if(!form.name || !form.price) return alert('Name and Price required');
    let newProducts;
    if (editItem) {
      newProducts = products.map(p => p.id === editItem.id ? { ...form, id: p.id } : p);
    } else {
      newProducts = [...products, { ...form, id: Date.now().toString() }];
    }
    
    setProducts(newProducts);
    localStorage.setItem('ft-products', JSON.stringify(newProducts));
    
    // Trigger Cloud Sync
    if(user) await syncToCloud(newProducts);
    
    closeModal();
  };

  const handleDelete = async (id) => {
    if(confirm('Delete item?')) {
      const newProducts = products.filter(p => p.id !== id);
      setProducts(newProducts);
      localStorage.setItem('ft-products', JSON.stringify(newProducts));
      if(user) await syncToCloud(newProducts);
    }
  };

  const openModal = (item = null) => {
    setEditItem(item);
    setForm(item || { name: '', category: 'Flower', price: '', thc: '', cbd: '', desc: '', image: '' });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditItem(null);
  };

  const filtered = category === 'All' ? products : products.filter(p => p.category === category);

  return (
    <div className="min-h-screen bg-white text-black font-mono selection:bg-black selection:text-white">
      
      {/* HEADER - Non Sticky (Relative) */}
      <header className="relative bg-white border-b-2 border-black">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="min-w-0 flex-1 mr-4">
            {/* Title Case */}
            <h1 className="font-bold text-xl truncate leading-none">fraction theory</h1>
            {/* Version Tagline */}
            <p className="text-[10px] text-gray-500 truncate leading-none mt-1">v2.1.0-cloud</p>
          </div>
          <button 
            onClick={() => setView(view === 'menu' ? 'admin' : 'menu')}
            className="shrink-0 bg-black text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-wide active:bg-gray-800"
          >
            {view === 'menu' ? 'Admin Mode' : 'View Menu'}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 pb-20">
        
        {view === 'menu' ? (
          <>
            {/* CATEGORIES */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
              <button 
                onClick={() => setCategory('All')}
                className={`shrink-0 px-4 py-1.5 text-xs font-bold border border-black transition-colors ${category === 'All' ? 'bg-black text-white' : 'bg-white'}`}
              >
                All
              </button>
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`shrink-0 px-4 py-1.5 text-xs font-bold border border-black transition-colors ${category === cat ? 'bg-black text-white' : 'bg-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* PRODUCT GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map(p => (
                <div key={p.id} className="border border-black bg-white group hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-200">
                  <div 
                    className="aspect-[4/3] border-b border-black relative overflow-hidden bg-gray-50 cursor-pointer"
                    onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                  >
                    {p.image ? (
                      <img src={p.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">NO IMG</div>
                    )}
                    <div className="absolute top-2 right-2 bg-black text-white text-xs font-bold px-2 py-0.5">
                      {p.price}
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-sm leading-tight">{p.name}</h3>
                      <button onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
                        {expanded === p.id ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
                      </button>
                    </div>
                    
                    <div className="flex gap-2 text-[10px] font-bold text-gray-600 mb-2">
                      <span className="border border-gray-300 px-1.5 py-0.5 rounded-sm">{p.category}</span>
                      {p.thc && <span className="border border-gray-300 px-1.5 py-0.5 rounded-sm">THC: {p.thc}</span>}
                    </div>

                    {expanded === p.id && (
                      <p className="text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-2 mt-2">
                        {p.desc || "No description available."}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* ADMIN VIEW */
          <div className="space-y-4">
            {/* GOOGLE LOGIN BAR */}
            <div className="border border-black p-3 flex justify-between items-center bg-gray-50">
                <div className="flex items-center gap-2">
                    <Icons.Google />
                    <span className="text-xs font-bold">
                        {user ? 'Cloud Sync Active' : 'Drive Sync Disabled'}
                    </span>
                </div>
                {!user ? (
                    <button onClick={handleGoogleLogin} className="text-[10px] font-bold underline">
                        Login with Google
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        {syncing && <span className="text-[10px] animate-pulse">Syncing...</span>}
                        <Icons.Cloud />
                    </div>
                )}
            </div>

            <div className="flex justify-between items-end border-b border-black pb-2 mb-4">
              <h2 className="text-sm font-bold uppercase">Inventory</h2>
              <button onClick={() => openModal()} className="flex items-center gap-1 bg-black text-white text-[10px] font-bold px-3 py-1.5">
                <Icons.Plus /> Add Item
              </button>
            </div>

            <div className="border border-black divide-y divide-black bg-white">
              {products.map(p => (
                <div key={p.id} className="flex items-center p-2 gap-3 h-16">
                  <div className="w-10 h-10 shrink-0 bg-gray-100 border border-gray-200 overflow-hidden">
                    {p.image && <img src={p.image} className="w-full h-full object-cover" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs truncate">{p.name}</div>
                    <div className="text-[10px] text-gray-500 truncate">{p.category} • {p.price}</div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => openModal(p)} className="p-1.5 border border-black hover:bg-black hover:text-white transition-colors">
                      <Icons.Edit />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors">
                      <Icons.Trash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />
          
          <div className="relative bg-white w-full max-w-lg border-t-2 sm:border-2 border-black p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg uppercase">{editItem ? 'Edit Item' : 'New Item'}</h3>
              <button onClick={closeModal}><Icons.X /></button>
            </div>

            <div className="space-y-4">
              <ImageInput value={form.image} onChange={val => setForm({...form, image: val})} />

              <div>
                <label className="block text-xs font-bold uppercase mb-1">Name</label>
                <input 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full border border-black p-2 text-sm rounded-none focus:ring-1 focus:ring-black outline-none font-mono"
                  placeholder="e.g. Blue Dream"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Category</label>
                  <select 
                    value={form.category} 
                    onChange={e => setForm({...form, category: e.target.value})}
                    className="w-full border border-black p-2 text-sm rounded-none focus:ring-1 focus:ring-black outline-none bg-white"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Price</label>
                  <input 
                    value={form.price} 
                    onChange={e => setForm({...form, price: e.target.value})}
                    className="w-full border border-black p-2 text-sm rounded-none focus:ring-1 focus:ring-black outline-none"
                    placeholder="$0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">THC</label>
                  <input 
                    value={form.thc} 
                    onChange={e => setForm({...form, thc: e.target.value})}
                    className="w-full border border-black p-2 text-sm rounded-none focus:ring-1 focus:ring-black outline-none"
                    placeholder="20%"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">CBD</label>
                  <input 
                    value={form.cbd} 
                    onChange={e => setForm({...form, cbd: e.target.value})}
                    className="w-full border border-black p-2 text-sm rounded-none focus:ring-1 focus:ring-black outline-none"
                    placeholder="0%"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">Description</label>
                <textarea 
                  rows="3"
                  value={form.desc} 
                  onChange={e => setForm({...form, desc: e.target.value})}
                  className="w-full border border-black p-2 text-sm rounded-none focus:ring-1 focus:ring-black outline-none"
                  placeholder="Item details..."
                />
              </div>

              <button 
                onClick={handleSave}
                className="w-full bg-black text-white font-bold py-3 uppercase tracking-wider hover:bg-gray-800 active:bg-gray-900"
              >
                {editItem ? 'Save Changes' : 'Create Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
