// watchApi.js – Supabase integration for live watches catalog
import { supabase } from '../supabaseClient';

export const initialWatches = [];

// ── Normalize DB row to frontend watch format ─────────────────────────────────
const normalizeWatch = (w) => {
  if (!w) return null;
  return {
    id: w.id,
    name: w.name || '',
    brand: w.brand || '',
    price: w.price !== null && w.price !== undefined ? parseFloat(w.price) : null,
    imageUrl: w.image || w.image_url || w.imageUrl || 'images/watch1.png',
    description: w.description || '',
    created_at: w.created_at
  };
};

// ── Helper to notify App.jsx of any updates ──────────────────────────────────
const dispatchUpdate = () => {
  window.dispatchEvent(new CustomEvent('watches-updated'));
};

// Memory cache only for the current active tab
let memoryWatches = [];

export const getStoredWatches = () => memoryWatches;

export const setStoredWatches = (watches) => {
  memoryWatches = watches;
  dispatchUpdate();
};

// ── Supabase real-time subscription ──────────────────────────────────────────
const subscribeToSupabase = () => {
  supabase
    .channel('watches-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'watches' }, async (payload) => {
      console.log('[Supabase Realtime Event]', payload);
      // Whenever ANY device adds, edits, or deletes a watch, refetch clean from Supabase
      await fetchWatches();
    })
    .subscribe((status) => {
      console.log('[Supabase Realtime Status]:', status);
    });
};

subscribeToSupabase();

// ── API functions ─────────────────────────────────────────────────────────────

// Fetch all watches from Supabase (sole source of truth across all devices)
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
      memoryWatches = normalized;
      dispatchUpdate();
      return normalized;
    }
  } catch (e) {
    console.warn('Supabase fetch failed:', e);
  }
  return memoryWatches;
};

// Insert watch into Supabase
export const postWatch = async (watchData) => {
  // Your database has column: image (or image_url, imageUrl)
  const payloadWithImage = {
    name: watchData.name,
    brand: watchData.brand,
    price: watchData.price,
    image: watchData.imageUrl,
    description: watchData.description
  };

  try {
    const { data, error } = await supabase
      .from('watches')
      .insert([payloadWithImage])
      .select();

    if (error) {
      console.warn('Insert with "image" failed, trying with "image_url" / "imageUrl":', error);
      const fallback = {
        name: watchData.name,
        brand: watchData.brand,
        price: watchData.price,
        image_url: watchData.imageUrl,
        imageUrl: watchData.imageUrl,
        description: watchData.description
      };
      const retry = await supabase.from('watches').insert([fallback]).select();
      if (retry.error) throw retry.error;
      if (retry.data && retry.data[0]) {
        await fetchWatches();
        return normalizeWatch(retry.data[0]);
      }
    }

    if (data && data[0]) {
      await fetchWatches();
      return normalizeWatch(data[0]);
    }
  } catch (e) {
    alert('Failed to save to database. Please check your internet connection or Supabase status: ' + (e.message || e));
    console.error('Post watch failed:', e);
  }

  return null;
};

// Delete watch from Supabase
export const deleteWatch = async (id) => {
  try {
    const { error } = await supabase.from('watches').delete().eq('id', id);
    if (error) throw error;
    await fetchWatches();
    return true;
  } catch (e) {
    console.error('Delete watch failed:', e);
    alert('Failed to delete from database: ' + (e.message || e));
  }
  return false;
};

export const createPaymentIntent = async (amount) => {
  return { clientSecret: 'mock_client_secret_test_key' };
};
