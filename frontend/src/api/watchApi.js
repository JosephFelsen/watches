const API_BASE_URL = '/api';
const LOCAL_STORAGE_KEY = 'gershon_watches_catalog';

// Initial sample data if server is offline or database empty
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
  // Initialize with initial watches if empty
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialWatches));
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

export const fetchWatches = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/watches`);
    if (!response.ok) throw new Error('API server returned error');
    const data = await response.json();
    if (data && data.length > 0) {
      setStoredWatches(data);
      return data;
    }
    return getStoredWatches();
  } catch (error) {
    console.warn('Backend connection pending, using persisted catalog:', error);
    return getStoredWatches();
  }
};

export const postWatch = async (watchData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/watches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(watchData)
    });
    if (!response.ok) throw new Error('Failed to post watch');
    const created = await response.json();
    const current = getStoredWatches();
    const updated = [created, ...current];
    setStoredWatches(updated);
    return created;
  } catch (error) {
    console.warn('Backend post failed, creating persistent local item:', error);
    const newWatch = {
      id: Date.now(),
      ...watchData
    };
    const current = getStoredWatches();
    const updated = [newWatch, ...current];
    setStoredWatches(updated);
    return newWatch;
  }
};

export const deleteWatch = async (id) => {
  try {
    await fetch(`${API_BASE_URL}/watches/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.warn('Backend delete failed, performing persistent local deletion:', error);
  }
  const current = getStoredWatches();
  const updated = current.filter((w) => w.id !== id);
  setStoredWatches(updated);
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
