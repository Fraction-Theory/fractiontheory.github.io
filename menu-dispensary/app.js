const { useState, useEffect } = React;

// --- ICONS (Optimized size) ---
const Icons = {
  X: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  Plus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  Edit: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>,
  Trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
  Save: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>,
  ChevronDown: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
  ChevronUp: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>,
  Camera: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>,
  Upload: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 7.5"></path><path d="M12 16v6"></path><path d="M15 19l-3 3-3-3"></path></svg>
};

// --- STORAGE ---
const storage = {
  get: (key) => { try { return localStorage.getItem(key) } catch(e) { return null } },
  set: (key, val) => { try { localStorage.setItem(key, val) } catch(e) {} }
};

// --- DATA: Placeholders with Base64 Images ---
const PLACEHOLDERS = {
  flower: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTE1MCA1MCBMIDE3MCA5MCBMIDIxMCAxMDAgTCAxODAgMTMwIEwgMTkwIDE3MCBMIDE1MCAxNTAgTCAxMTAgMTcwIEwgMTIwIDEzMCBMIDkwIDEwMCBMIDEzMCA5MCBaIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjE1MCIgeT0iMTkwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5GTE9XRVI8L3RleHQ+PC9zdmc+",
  edible: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmIi8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iMTAwIiByPSI0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIxNTAiIHk9IjE3MCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RURJQkxFPC90ZXh0Pjwvc3ZnPg==",
  extract: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTE1MCA2MCBMIDE5MCAxMDAgTCAxNTAgMTQwIEwgMTEwIDEwMCBaIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjE1MCIgeT0iMTcwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5FWFRSQUNUPC90ZXh0Pjwvc3ZnPg=="
};

// --- COMPONENT: Image Input ---
const ImageInput = ({ value, onChange }) => {
  const trigger = (capture) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    if(capture) input.setAttribute('capture', capture);
    input.onchange = (e) => {
      const file = e.target.files[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onloadend = () => onChange(reader.result);
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase">Product Image</label>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => trigger('user')} className="flex items-center justify-center gap-2 border border-black py-2 text-xs font-bold hover:bg-gray-100">
          <Icons.Camera /> Snap
        </button>
        <button onClick={() => trigger(null)} className="flex items-center justify-center gap-2 border border-black py-2 text-xs font-bold hover:bg-gray-100">
          <Icons.Upload /> Upload
        </button>
      </div>
      {value && (
        <div className="relative border border-black h-32 w-full mt-2 cursor-pointer group" onClick={() => onChange('')}>
          <img src={value} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-xs font-bold">REMOVE</span>
          </div>
        </div>
      )}
    </div>
  );
};

// --- APP COMPONENT ---
const App = () => {
  const [view, setView] = useState('menu'); // 'menu' or 'admin'
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [expanded, setExpanded] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Form State
  const [form, setForm] = useState({ name: '', category: 'Flower', price: '', thc: '', cbd: '', desc: '', image: '' });

  const categories = ['Flower', 'Edibles', 'Vapes', 'Concentrates'];

  useEffect(() => {
    const saved = storage.get('ft-products');
    if (saved) {
      setProducts(JSON.parse(saved));
    } else {
      const defaults = [
        { id: '1', name: 'Blue Dream', category: 'Flower', price: '$45', thc: '22%', cbd: '<1%', desc: 'Classic sativa-dominant hybrid. Sweet berry aroma with full-body relaxation.', image: PLACEHOLDERS.flower },
        { id: '2', name: 'Sour Diesel', category: 'Flower', price: '$50', thc: '24%', cbd: '0%', desc: 'Invigorating sativa. Pungent diesel-like aroma. Great for energy.', image: PLACEHOLDERS.flower },
        { id: '3', name: 'Magic Gummies', category: 'Edibles', price: '$20', thc: '100mg', cbd: '0mg', desc: 'Pack of 10 watermelon gummies. 10mg THC per piece.', image: PLACEHOLDERS.edible },
        { id: '4', name: 'Live Rosin', category: 'Concentrates', price: '$70', thc: '85%', cbd: '2%', desc: 'Solventless extract. Pure flavor and high potency.', image: PLACEHOLDERS.extract }
      ];
      setProducts(defaults);
      storage.set('ft-products', JSON.stringify(defaults));
    }
  }, []);

  const save = (newProducts) => {
    setProducts(newProducts);
    storage.set('ft-products', JSON.stringify(newProducts));
  };

  const handleSave = () => {
    if(!form.name || !form.price) return alert('Name and Price required');
    if (editItem) {
      save(products.map(p => p.id === editItem.id ? { ...form, id: p.id } : p));
    } else {
      save([...products, { ...form, id: Date.now().toString() }]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if(confirm('Delete item?')) save(products.filter(p => p.id !== id));
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
      
      {/* HEADER - Fixed Layout */}
      <header className="sticky top-0 z-40 bg-white border-b-2 border-black">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="min-w-0 flex-1 mr-4">
            <h1 className="font-bold text-lg truncate leading-none">Fraction Theory</h1>
            <p className="text-[10px] text-gray-500 truncate leading-none mt-1">Disp_Sys_v1.0</p>
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
            {/* CATEGORIES - Horizontal Scroll */}
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
            
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm border border-dashed border-gray-300">
                No products found in {category}
              </div>
            )}
          </>
        ) : (
          /* ADMIN VIEW */
          <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-black pb-2 mb-4">
              <h2 className="text-sm font-bold uppercase">Inventory</h2>
              <button onClick={() => openModal()} className="flex items-center gap-1 bg-black text-white text-[10px] font-bold px-3 py-1.5">
                <Icons.Plus /> Add Item
              </button>
            </div>

            <div className="border border-black divide-y divide-black bg-white">
              {products.map(p => (
                <div key={p.id} className="flex items-center p-2 gap-3 h-16">
                  {/* Fixed width image container */}
                  <div className="w-10 h-10 shrink-0 bg-gray-100 border border-gray-200 overflow-hidden">
                    {p.image && <img src={p.image} className="w-full h-full object-cover" />}
                  </div>
                  
                  {/* Flexible text container with min-w-0 for truncation */}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs truncate">{p.name}</div>
                    <div className="text-[10px] text-gray-500 truncate">{p.category} • {p.price}</div>
                  </div>

                  {/* Fixed width buttons */}
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
              {products.length === 0 && <div className="p-4 text-center text-xs text-gray-500">Inventory Empty</div>}
            </div>
          </div>
        )}
      </main>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />
          
          <div className="relative bg-white w-full max-w-lg border-t-2 sm:border-2 border-black p-4 sm:p-6 shadow-2xl animate-slide-up sm:animate-none max-h-[90vh] overflow-y-auto">
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