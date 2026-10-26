// watchApi.js – Supabase integration for live watches catalog
import { supabase } from '../supabaseClient';

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
    console.warn('localStorage read error:', e);
  }
  return [];
};

export const setStoredWatches = (watches) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(watches));
    window.dispatchEvent(new CustomEvent('watches-updated'));
  } catch (e) {
    console.warn('localStorage write error:', e);
  }
};

// ── Normalize DB row to frontend watch format ─────────────────────────────────
const normalizeWatch = (w) => {
  if (!w) return null;
  return {
    id: w.id,
    name: w.name || '',
    brand: w.brand || '',
    price: w.price !== null && w.price !== undefined ? parseFloat(w.price) : null,
    imageUrl: w.imageUrl || w.image_url || w.image || 'images/watch1.png',
    description: w.description || '',
    created_at: w.created_at
  };
};

// ── Supabase real-time subscription ──────────────────────────────────────────
const subscribeToSupabase = () => {
  supabase
    .channel('watches-realtime')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'watches' }, (payload) => {
      console.log('[Supabase] INSERT received', payload.new);
      const newWatch = normalizeWatch(payload.new);
      const current = getStoredWatches();
      if (!current.find((w) => String(w.id) === String(newWatch.id))) {
        setStoredWatches([newWatch, ...current]);
      }
    })
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'watches' }, (payload) => {
      console.log('[Supabase] DELETE received', payload.old);
      if (payload.old && payload.old.id) {
        const updated = getStoredWatches().filter((w) => String(w.id) !== String(payload.old.id));
        setStoredWatches(updated);
      } else {
        // Refetch full table if payload.old doesn't contain the id
        fetchWatches();
      }
    })
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'watches' }, (payload) => {
      const updatedWatch = normalizeWatch(payload.new);
      const updated = getStoredWatches().map((w) =>
        String(w.id) === String(updatedWatch.id) ? updatedWatch : w
      );
      setStoredWatches(updated);
    })
    .subscribe((status) => {
      console.log('[Supabase] Realtime status:', status);
    });
};

subscribeToSupabase();

// ── API functions ─────────────────────────────────────────────────────────────

// Fetch all watches from Supabase
export const fetchWatches = async () => {
  try {
    const { data, error } = await supabase
      .from('watches')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error);
      throw error;
    }

    if (Array.isArray(data)) {
      const normalized = data.map(normalizeWatch);
      setStoredWatches(normalized);
      return normalized;
    }
  } catch (e) {
    console.warn('Supabase fetch failed, falling back to local storage cache:', e);
  }
  return getStoredWatches();
};

// Insert watch into Supabase
export const postWatch = async (watchData) => {
  // Support both snake_case and camelCase column definitions
  const dbPayload = {
    name: watchData.name,
    brand: watchData.brand,
    price: watchData.price,
    imageUrl: watchData.imageUrl,
    description: watchData.description
  };

  try {
    const { data, error } = await supabase
      .from('watches')
      .insert([dbPayload])
      .select();

    if (error) {
      console.error('Supabase insert failed with imageUrl, retrying with image_url:', error);
      // Fallback if user's table has column image_url or image
      const fallbackPayload = {
        name: watchData.name,
        brand: watchData.brand,
        price: watchData.price,
        image_url: watchData.imageUrl,
        description: watchData.description
      };
      const retry = await supabase.from('watches').insert([fallbackPayload]).select();
      if (retry.error) {
        console.error('Supabase retry insert error:', retry.error);
        throw retry.error;
      }
      if (retry.data && retry.data[0]) {
        const item = normalizeWatch(retry.data[0]);
        const updated = [item, ...getStoredWatches().filter((w) => String(w.id) !== String(item.id))];
        setStoredWatches(updated);
        return item;
      }
    }

    if (data && data[0]) {
      const item = normalizeWatch(data[0]);
      const updated = [item, ...getStoredWatches().filter((w) => String(w.id) !== String(item.id))];
      setStoredWatches(updated);
      return item;
    }
  } catch (e) {
    console.error('Failed to post watch to Supabase:', e);
  }

  // Fallback so it doesn't crash if offline
  const localWatch = {
    id: Date.now(),
    ...watchData
  };
  const updated = [localWatch, ...getStoredWatches().filter((w) => String(w.id) !== String(localWatch.id))];
  setStoredWatches(updated);
  return localWatch;
};

// Delete watch from Supabase
export const deleteWatch = async (id) => {
  try {
    const { error } = await supabase.from('watches').delete().eq('id', id);
    if (error) console.error('Supabase delete error:', error);
  } catch (e) {
    console.error('Failed to delete watch from Supabase:', e);
  }

  const updated = getStoredWatches().filter((w) => String(w.id) !== String(id));
  setStoredWatches(updated);
  return true;
};

export const createPaymentIntent = async (amount) => {
  return { clientSecret: 'mock_client_secret_test_key' };
};
