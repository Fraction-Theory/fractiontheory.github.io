const { useState, useEffect, useRef } = React;

// --- CONFIGURATION (YOU MUST FILL THIS IN FOR GOOGLE DRIVE TO WORK) ---
const GOOGLE_CLIENT_ID = '781276598623-m4j9dmdb977rgg2e8i4u82e1vkfk817d.apps.googleusercontent.com'; // e.g., 12345-abcde.apps.googleusercontent.com
const GOOGLE_API_KEY = '___INJECT_GOOGLE_API_KEY___';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const FILE_NAME = 'fraction_theory_inventory.json';

// --- ICONS ---
const Icons = {
  X: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  Plus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  Edit: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>,
  Trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
  ChevronDown: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
  ChevronUp: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>,
  Camera: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>,
  Upload: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 7.5"></path><path d="M12 16v6"></path><path d="M15 19l-3 3-3-3"></path></svg>,
  Google: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>,
  Cloud: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>
};

// --- DATA PLACEHOLDERS ---
const PLACEHOLDERS = {
  flower: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTE1MCA1MCBMIDE3MCA5MCBMIDIxMCAxMDAgTCAxODAgMTMwIEwgMTkwIDE3MCBMIDE1MCAxNTAgTCAxMTAgMTcwIEwgMTIwIDEzMCBMIDkwIDEwMCBMIDEzMCA5MCBaIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjE1MCIgeT0iMTkwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5GTE9XRVI8L3RleHQ+PC9zdmc+",
  edible: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmIi8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iMTAwIiByPSI0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIxNTAiIHk9IjE3MCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RURJQkxFPC90ZXh0Pjwvc3ZnPg==",
  extract: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTE1MCA2MCBMIDE5MCAxMDAgTCAxNTAgMTQwIEwgMTEwIDEwMCBaIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjE1MCIgeT0iMTcwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5FWFRSQUNUPC90ZXh0Pjwvc3ZnPg=="
};

// --- DRIVE SERVICE ---
const DriveService = {
  tokenClient: null,
  
  init: async (updateStatus) => {
    if (!window.gapi || !window.google) {
      console.warn("Google Scripts not loaded");
      return false;
    }
    
    try {
      await new Promise((resolve) => window.gapi.load('client', resolve));
      await window.gapi.client.init({
        apiKey: GOOGLE_API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
      });

      DriveService.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined at request time
      });
      
      updateStatus(true);
      return true;
    } catch (err) {
      console.error("GAPI Init Error:", err);
      updateStatus(false);
      return false;
    }
  },

  login: () => {
    return new Promise((resolve, reject) => {
      if (!DriveService.tokenClient) return reject("Token Client not init");
      
      DriveService.tokenClient.callback = async (resp) => {
        if (resp.error) reject(resp);
        resolve(resp);
      };
      
      DriveService.tokenClient.requestAccessToken({ prompt: 'consent' });
    });
  },

  findFile: async () => {
    const res = await window.gapi.client.drive.files.list({
      q: `name = '${FILE_NAME}' and trashed = false`,
      fields: 'files(id, name)',
    });
    return res.result.files.length > 0 ? res.result.files[0] : null;
  },

  saveData: async (data) => {
    const fileContent = JSON.stringify(data);
    const file = await DriveService.findFile();
    
    const fileMetadata = {
      name: FILE_NAME,
      mimeType: 'application/json',
    };

    const multipartRequestBody =
      `\r\n--foo_bar_baz\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(fileMetadata)}\r\n--foo_bar_baz\r\nContent-Type: application/json\r\n\r\n${fileContent}\r\n--foo_bar_baz--`;

    if (file) {
      // Update existing
      await window.gapi.client.request({
        path: `/upload/drive/v3/files/${file.id}`,
        method: 'PATCH',
        params: { uploadType: 'multipart' },
        headers: { 'Content-Type': 'multipart/related; boundary=foo_bar_baz' },
        body: multipartRequestBody
      });
    } else {
      // Create new
      await window.gapi.client.request({
        path: '/upload/drive/v3/files',
        method: 'POST',
        params: { uploadType: 'multipart' },
        headers: { 'Content-Type': 'multipart/related; boundary=foo_bar_baz' },
        body: multipartRequestBody
      });
    }
  },

  loadData: async () => {
    const file = await DriveService.findFile();
    if (!file) return null;
    
    const res = await window.gapi.client.drive.files.get({
      fileId: file.id,
      alt: 'media'
    });
    return res.result;
  }
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

  // Form State
  const [form, setForm] = useState({ name: '', category: 'Flower', price: '', thc: '', cbd: '', desc: '', image: '' });

  const categories = ['Flower', 'Edibles', 'Concentrates', 'Topicals'];

  // Init Google API
  useEffect(() => {
    if(GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
        console.warn("Google Client ID not set. Drive sync will not work.");
    }
    DriveService.init(setGapiReady);
  }, []);

  // Initial Load (Fallback to Local, then try Drive if logged in)
  useEffect(() => {
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
  }, []);

  const handleGoogleLogin = async () => {
    if (!gapiReady) return alert('Google API not ready. Check keys.');
    try {
      await DriveService.login();
      setUser(true);
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

  const syncFromCloud = async () => {
    setSyncing(true);
    try {
      const cloudData = await DriveService.loadData();
      if (cloudData) {
        setProducts(cloudData);
        localStorage.setItem('ft-products', JSON.stringify(cloudData));
      }
    } catch (e) {
      console.error("Cloud Load Error", e);
    } finally {
      setSyncing(false);
    }
  };

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
