// ---------- START OF PATCHED app.js ----------

const { useState, useEffect, useRef } = React;

// --- BIG STORAGE (IndexedDB) ---
// Drop-in replacement for localStorage for large data (stores objects directly).
const bigStorage = {
  _open() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) return reject(new Error('IndexedDB not supported'));
      const req = indexedDB.open('FT_BIG_DB', 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('kv')) db.createObjectStore('kv');
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },

  async set(key, value) {
    // Try IndexedDB, fallback to localStorage
    try {
      const db = await this._open();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('kv', 'readwrite');
        tx.objectStore('kv').put(value, key);
        tx.oncomplete = () => { db.close(); resolve(true); };
        tx.onerror = (e) => { db.close(); reject(e); };
      });
    } catch (err) {
      // Fallback to localStorage (stringify)
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e2) {
        console.warn('bigStorage fallback failed', e2);
        throw e2;
      }
    }
  },

  async get(key) {
    try {
      const db = await this._open();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('kv', 'readonly');
        const req = tx.objectStore('kv').get(key);
        req.onsuccess = () => { db.close(); resolve(req.result); };
        req.onerror = (e) => { db.close(); reject(e); };
      });
    } catch (err) {
      // Fallback to localStorage (parse)
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      } catch (e2) {
        console.warn('bigStorage fallback read failed', e2);
        return null;
      }
    }
  },

  async clear(key) {
    try {
      const db = await this._open();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('kv', 'readwrite');
        tx.objectStore('kv').delete(key);
        tx.oncomplete = () => { db.close(); resolve(true); };
        tx.onerror = (e) => { db.close(); reject(e); };
      });
    } catch (err) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e2) {
        return false;
      }
    }
  }
};

// --- CONFIGURATION ---
const GOOGLE_API_KEY = '';
const GOOGLE_CLIENT_ID = '713729695172-4970qtjlc5l3pf4tua5lodq4r50oliji.apps.googleusercontent.com';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const FILE_NAME = 'fraction_theory_inventory.json';

// --- ICONS (unchanged) ---
const Icons = { /* ... same SVG icons as before ... */ 
  X: () => <svg width="16" height="16" viewBox="0 0 24 24" ...></svg>,
  Plus: () => <svg ...></svg>,
  Edit: () => <svg ...></svg>,
  Trash: () => <svg ...></svg>,
  ChevronDown: () => <svg ...></svg>,
  ChevronUp: () => <svg ...></svg>,
  Camera: () => <svg ...></svg>,
  Upload: () => <svg ...></svg>,
  Google: () => <svg ...></svg>,
  Cloud: () => <svg ...></svg>,
  Refresh: () => <svg ...></svg>
};

// (For brevity in this pasted snippet I'm not repeating each SVG full markup. In your actual file,
// keep the Icons object exactly as you had it.)

// --- DATA PLACEHOLDERS (unchanged) ---
const PLACEHOLDERS = {
  flower: "data:image/svg+xml;base64,...",
  edible: "data:image/svg+xml;base64,...",
  extract: "data:image/svg+xml;base64,..."
};

// --- DRIVE SERVICE (unchanged) ---
const DriveService = {
  tokenClient: null,
  init: async (updateStatus) => {
    if (!window.gapi || !window.google) {
      console.warn("Google Scripts not loaded");
      return false;
    }
    try {
      await new Promise((resolve) => window.gapi.load('client', resolve));
      await window.gapi.client.init({ discoveryDocs: [DISCOVERY_DOC] });
      await window.gapi.client.load('drive', 'v3');
      DriveService.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: SCOPES,
        callback: '',
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
        if (window.gapi.client) window.gapi.client.setToken(resp);
        resolve(resp);
      };
      DriveService.tokenClient.requestAccessToken({ prompt: 'consent' });
    });
  },

  findFile: async () => {
    try {
      const res = await window.gapi.client.drive.files.list({
        q: `name = '${FILE_NAME}' and trashed = false`,
        fields: 'files(id, name)',
      });
      return res.result.files.length > 0 ? res.result.files[0] : null;
    } catch (e) {
      console.error("Error finding file:", e);
      return null;
    }
  },

  saveData: async (data) => {
    try {
      const fileContent = JSON.stringify(data);
      const file = await DriveService.findFile();

      const fileMetadata = {
        name: FILE_NAME,
        mimeType: 'application/json',
      };

      const multipartRequestBody =
        `\r\n--foo_bar_baz\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(fileMetadata)}\r\n--foo_bar_baz\r\nContent-Type: application/json\r\n\r\n${fileContent}\r\n--foo_bar_baz--`;

      const uploadUrl = 'https://www.googleapis.com/upload/drive/v3/files';

      const requestParams = {
        path: file ? `${uploadUrl}/${file.id}` : uploadUrl,
        method: file ? 'PATCH' : 'POST',
        params: { uploadType: 'multipart' },
        headers: { 'Content-Type': 'multipart/related; boundary=foo_bar_baz' },
        body: multipartRequestBody
      };

      await window.gapi.client.request(requestParams);
      console.log("Drive Sync Successful");
    } catch (e) {
      console.error("Drive Sync Error", e);
      throw e;
    }
  },

  loadData: async () => {
    const file = await DriveService.findFile();
    if (!file) return null;
    try {
      const res = await window.gapi.client.drive.files.get({
        fileId: file.id,
        alt: 'media'
      });
      // res.body may be the text; res.result may be parsed already.
      const raw = res.body || res.result;
      // If it's a string, parse; if object, return directly
      if (typeof raw === 'string') {
        try { return JSON.parse(raw); } catch (e) { console.error("Drive parse error", e); return null; }
      }
      return raw;
    } catch (e) {
      console.error("JSON Parse Error", e);
      return null;
    }
  }
};

// --- ImageInput (unchanged) ---
const ImageInput = ({ value, onChange }) => {
  const trigger = (capture) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    if(capture) input.setAttribute('capture', capture);
    input.style.display = 'none';
    document.body.appendChild(input);
    input.onchange = (e) => {
      const file = e.target.files[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onloadend = () => onChange(reader.result);
      reader.readAsDataURL(file);
      document.body.removeChild(input);
    };
    input.click();
    setTimeout(() => { if(document.body.contains(input)) document.body.removeChild(input); }, 60000);
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
  const [user, setUser] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Form State
  const [form, setForm] = useState({ name: '', category: 'Flower', price: '', thc: '', cbd: '', desc: '', image: '' });

  const categories = ['Hash', 'Flower', 'Edibles','Rosin', ];

  // --- SYNC FUNCTIONS ---
  const syncFromCloud = async () => {
    setSyncing(true);
    try {
      const cloudData = await DriveService.loadData();
      if (cloudData) {
        setProducts(cloudData);
        try {
          await bigStorage.set('ft-products', cloudData);
        } catch (e) {
          console.error('bigStorage set error after cloud load', e);
        }
      }
    } catch (e) {
      console.error("Cloud Load Error", e);
    } finally {
      setSyncing(false);
    }
  };

  const syncToCloud = async (newData) => {
    if (!user) return;
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

  // Init Google API
  useEffect(() => {
    DriveService.init(setGapiReady);
  }, []);

  // Initial Load
  useEffect(() => {
    const loadData = async () => {
      try {
        const local = await bigStorage.get('ft-products');
        if (local) {
          setProducts(local);
        } else {
          const defaults = [
            { id: '1', name: 'Blue Dream', category: 'Flower', price: '$45', thc: '22%', cbd: '<1%', desc: 'Classic sativa-dominant hybrid.', image: PLACEHOLDERS.flower },
            { id: '2', name: 'Magic Gummies', category: 'Edibles', price: '$20', thc: '100mg', cbd: '0mg', desc: 'Watermelon gummies.', image: PLACEHOLDERS.edible },
            { id: '3', name: 'Live Rosin', category: 'Concentrates', price: '$70', thc: '85%', cbd: '2%', desc: 'Solventless extract.', image: PLACEHOLDERS.extract }
          ];
          setProducts(defaults);
          try { await bigStorage.set('ft-products', defaults); } catch (e) { console.error('bigStorage set error defaults', e); }
        }

        if (gapiReady && window.gapi.client.getToken && window.gapi.client.getToken().access_token) {
          await syncFromCloud();
          setUser(true);
        }
      } catch (e) {
        console.error('Initial load error', e);
      }
    };
    loadData();
  }, [gapiReady]);

  const handleGoogleLogin = async () => {
    if (!gapiReady) return alert('Google API not ready.');
    try {
      await DriveService.login();
      setUser(true);
      await syncFromCloud();
    } catch (err) {
      console.error(err);
      alert('Login Failed');
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
    try {
      await bigStorage.set('ft-products', newProducts);
    } catch (e) {
      console.error('bigStorage set error on save', e);
      // optional: attempt to cleanup or inform user
    }

    if(user) {
      await syncToCloud(newProducts);
    }

    closeModal();
  };

  const handleDelete = async (id) => {
    if(confirm('Delete item?')) {
      const newProducts = products.filter(p => p.id !== id);
      setProducts(newProducts);
      try {
        await bigStorage.set('ft-products', newProducts);
      } catch (e) {
        console.error('bigStorage set error on delete', e);
      }
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
      {/* Rest of your JSX unchanged — header, main, admin, modal — keep as-is */}
      {/* For brevity I am not repeating all the JSX again here; in your file keep the original JSX from your version. */}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

// ---------- END OF PATCHED app.js ----------
