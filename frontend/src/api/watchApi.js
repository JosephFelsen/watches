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

// ── Supabase real-time subscription ──────────────────────────────────────────
// Fires whenever ANY device adds or deletes a watch → updates UI instantly

const subscribeToSupabase = () => {
  supabase
    .channel('watches-realtime')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'watches' }, (payload) => {
      console.log('[Supabase] INSERT received', payload.new);
      const current = getStoredWatches();
      if (!current.find((w) => String(w.id) === String(payload.new.id))) {
        setStoredWatches([payload.new, ...current]);
      }
    })
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'watches' }, (payload) => {
      console.log('[Supabase] DELETE received', payload.old);
      const updated = getStoredWatches().filter((w) => String(w.id) !== String(payload.old.id));
      setStoredWatches(updated);
    })
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'watches' }, (payload) => {
      const updated = getStoredWatches().map((w) =>
        String(w.id) === String(payload.new.id) ? payload.new : w
      );
      setStoredWatches(updated);
    })
    .subscribe((status) => {
      console.log('[Supabase] Realtime status:', status);
    });
};

subscribeToSupabase();

// ── API functions ─────────────────────────────────────────────────────────────

// Fetch all watches from Supabase (source of truth for every device)
export const fetchWatches = async () => {
  try {
    const { data, error } = await supabase
      .from('watches')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Always trust Supabase — overwrite local cache
    setStoredWatches(data ?? []);
    return data ?? [];
  } catch (e) {
    console.warn('Supabase fetch failed, using local cache:', e);
    return getStoredWatches();
  }
};

// Insert watch into Supabase → real-time will push it to all other devices
export const postWatch = async (watchData) => {
  const { data, error } = await supabase
    .from('watches')
    .insert([watchData])
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    // Fallback: save locally so the admin at least sees it
    const local = { id: Date.now(), ...watchData };
    setStoredWatches([local, ...getStoredWatches()]);
    return local;
  }

  // Add to local cache immediately (real-time will confirm shortly)
  setStoredWatches([data, ...getStoredWatches().filter((w) => String(w.id) !== String(data.id))]);
  return data;
};

// Delete watch from Supabase → real-time will remove it on all devices
export const deleteWatch = async (id) => {
  const { error } = await supabase.from('watches').delete().eq('id', id);

  if (error) {
    console.error('Supabase delete error:', error);
  }

  // Remove from local cache immediately
  setStoredWatches(getStoredWatches().filter((w) => String(w.id) !== String(id)));
  return true;
};

export const createPaymentIntent = async (amount) => {
  return { clientSecret: 'mock_client_secret_test_key' };
};
