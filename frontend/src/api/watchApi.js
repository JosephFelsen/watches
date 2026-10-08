const API_BASE_URL = '/api';

// Initial sample data if server is offline or database empty
export const initialWatches = [
  {
    id: 1,
    name: "Gershon Royal Chronograph Rose Gold",
    brand: "Gershon Genève",
    price: 34500.00,
    imageUrl: "/images/watch1.png",
    description: "Handcrafted 18k rose gold chronograph featuring obsidian guilloché dial, self-winding mechanical movement with 72-hour power reserve, and hand-stitched alligator strap."
  },
  {
    id: 2,
    name: "Grand Tourbillon Skeleton Edition",
    brand: "Gershon Atelier",
    price: 89000.00,
    imageUrl: "/images/watch2.png",
    description: "High complication skeletonized tourbillon encased in polished 950 platinum with anti-reflective sapphire glass crystal."
  },
  {
    id: 3,
    name: "Nautilus Vintage Golden Sunburst",
    brand: "Gershon Heritage",
    price: null, // Null price -> "Price on Request" / Concierge acquisition!
    imageUrl: "/images/watch3.png",
    description: "Ultra-rare vintage golden dress timepiece featuring deep cobalt blue sunburst dial and yellow gold integrated bezel. Private acquisition only."
  }
];

export const fetchWatches = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/watches`);
    if (!response.ok) throw new Error('API server returned error');
    const data = await response.json();
    return data && data.length > 0 ? data : initialWatches;
  } catch (error) {
    console.warn('Backend server connection pending, using default initial showcase:', error);
    return initialWatches;
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
    return await response.json();
  } catch (error) {
    console.warn('Backend post failed, creating local fallback item:', error);
    return {
      id: Date.now(),
      ...watchData
    };
  }
};

export const deleteWatch = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/watches/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete watch');
    return true;
  } catch (error) {
    console.warn('Backend delete failed, performing local delete action:', error);
    return true;
  }
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
