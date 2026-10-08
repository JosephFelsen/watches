const API_BASE_URL = '/api';
const CLOUD_SYNC_URL = 'https://gershon-watches-default-rtdb.firebaseio.com/watches.json';
const LOCAL_STORAGE_KEY = 'gershon_watches_catalog';

// Initial default luxury timepieces
export const initialWatches = [
  {
    id: 1,
    name: "Gershon Royal Chronograph Rose Gold",
    brand: "Gershon Genève",
    price: 34500.00,
    imageUrl: "images/watch1.png",
    description: "Handcrafted 18k rose gold chronograph featuring obsidian guilloché dial, self-winding mechanical movement with 72-hour power reserve, and hand-stitched alligator strap."
  },
  {
    id: 2,
    name: "Grand Tourbillon Skeleton Edition",
    brand: "Gershon Atelier",
    price: 89000.00,
    imageUrl: "images/watch2.png",
    description: "High complication skeletonized tourbillon encased in polished 950 platinum with anti-reflective sapphire glass crystal."
  },
  {
    id: 3,
    name: "Nautilus Vintage Golden Sunburst",
    brand: "Gershon Heritage",
    price: null, // Null price -> "Price on Request" / Concierge acquisition!
    imageUrl: "images/watch3.png",
    description: "Ultra-rare vintage golden dress timepiece featuring deep cobalt blue sunburst dial and yellow gold integrated bezel. Private acquisition only."
  }
];

// Helper to read persisted watches from localStorage
export const getStoredWatches = () => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to read from localStorage:', e);
  }
  return initialWatches;
};

// Helper to save watches list to localStorage
export const setStoredWatches = (watches) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(watches));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
};

// Global Fetch: Syncs from Cloud Database across ALL visitors worldwide
export const fetchWatches = async () => {
  try {
    // 1. Try local Spring Boot REST API
    const response = await fetch(`${API_BASE_URL}/watches`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        setStoredWatches(data);
        return data;
      }
    }
  } catch (e) {
    // Backend API offline, fallback to cloud database
  }

  try {
    // 2. Cloud Database Sync (Worldwide live synchronization across all devices!)
    const cloudRes = await fetch(CLOUD_SYNC_URL);
    if (cloudRes.ok) {
      const cloudData = await cloudRes.json();
      if (cloudData) {
        // Firebase objects can be key-value maps or arrays
        const list = Array.isArray(cloudData) 
          ? cloudData.filter(Boolean) 
          : Object.values(cloudData).filter(Boolean);
        if (list.length > 0) {
          setStoredWatches(list);
          return list;
        }
      }
    }
  } catch (e) {
    console.warn('Cloud sync offline, reading local cache:', e);
  }

  return getStoredWatches();
};

// Global Post: Publishes watch to Cloud Database so ALL visitors see it immediately
export const postWatch = async (watchData) => {
  const newWatch = {
    id: Date.now(),
    ...watchData
  };

  const current = getStoredWatches();
  const updated = [newWatch, ...current];
  setStoredWatches(updated);

  // Sync to Cloud Database worldwide
  try {
    await fetch(CLOUD_SYNC_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
  } catch (e) {
    console.warn('Cloud sync update failed:', e);
  }

  // Also notify local Spring Boot API if running
  try {
    await fetch(`${API_BASE_URL}/watches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(watchData)
    });
  } catch (e) {
    // Ignore local API error
  }

  return newWatch;
};

// Global Delete: Removes watch from Cloud Database worldwide
export const deleteWatch = async (id) => {
  const current = getStoredWatches();
  const updated = current.filter((w) => w.id !== id);
  setStoredWatches(updated);

  // Sync deletion to Cloud Database worldwide
  try {
    await fetch(CLOUD_SYNC_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
  } catch (e) {
    console.warn('Cloud sync deletion failed:', e);
  }

  // Also notify local Spring Boot API if running
  try {
    await fetch(`${API_BASE_URL}/watches/${id}`, {
      method: 'DELETE'
    });
  } catch (e) {
    // Ignore local API error
  }

  return true;
};

export const createPaymentIntent = async (amount) => {
  try {
    const response = await fetch(`${API_BASE_URL}/checkout/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency: 'eur' })
    });
    if (!response.ok) throw new Error('Failed to create payment intent');
    return await response.json();
  } catch (error) {
    return { clientSecret: 'mock_client_secret_test_key' };
  }
};
