// watchApi.js – Supabase integration for live watches catalog
import { supabase } from '../supabaseClient';

const API_BASE_URL = '/api';
const LOCAL_STORAGE_KEY = 'gershon_watches_catalog';

export const initialWatches = [];

// ── Local storage helpers ─────────────────────────────────────────────────────

export const getStoredWatches = () => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Failed to read from localStorage:', e);
  }
  return [];
};

export const setStoredWatches = (watches) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(watches));
    // Notify React components listening for live updates
    window.dispatchEvent(new CustomEvent('watches-updated'));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
};

// ── Supabase real-time subscription ──────────────────────────────────────────

const subscribeToSupabase = () => {
  supabase
    .channel('public:watches')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'watches' }, (payload) => {
      const current = getStoredWatches();
      let updated = current;

      if (payload.eventType === 'INSERT') {
        if (!current.find((w) => w.id === payload.new.id)) {
          updated = [payload.new, ...current];
        }
      } else if (payload.eventType === 'DELETE') {
        updated = current.filter((w) => w.id !== payload.old.id);
      } else if (payload.eventType === 'UPDATE') {
        updated = current.map((w) => (w.id === payload.new.id ? payload.new : w));
      }

      setStoredWatches(updated);
    })
    .subscribe();
};

// Start subscription once when module loads
subscribeToSupabase();

// ── API functions ─────────────────────────────────────────────────────────────

export const fetchWatches = async () => {
  try {
    const { data, error } = await supabase.from('watches').select('*');
    if (!error && Array.isArray(data) && data.length > 0) {
      setStoredWatches(data);
      return data;
    }
  } catch (e) {
    console.warn('Supabase fetch error:', e);
  }
  return getStoredWatches();
};

export const postWatch = async (watchData) => {
  const newWatch = { id: Date.now(), ...watchData };
  try {
    const { error } = await supabase.from('watches').insert([newWatch]);
    if (error) throw error;
  } catch (e) {
    console.warn('Supabase insert error (storing locally):', e);
  }
  const updated = [newWatch, ...getStoredWatches().filter((w) => w.id !== newWatch.id)];
  setStoredWatches(updated);
  return newWatch;
};

export const deleteWatch = async (id) => {
  try {
    const { error } = await supabase.from('watches').delete().eq('id', id);
    if (error) throw error;
  } catch (e) {
    console.warn('Supabase delete error (deleting locally):', e);
  }
  const updated = getStoredWatches().filter((w) => w.id !== id);
  setStoredWatches(updated);
  return true;
};

export const createPaymentIntent = async (amount) => {
  try {
    const response = await fetch(`${API_BASE_URL}/checkout/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency: 'eur' }),
    });
    if (!response.ok) throw new Error('Failed to create payment intent');
    return await response.json();
  } catch (error) {
    return { clientSecret: 'mock_client_secret_test_key' };
  }
};
