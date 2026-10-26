import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WatchCard } from './components/WatchCard';
import { AdminModal } from './components/AdminModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ConciergeModal } from './components/ConciergeModal';
import { CartDrawer } from './components/CartDrawer';
import { StripeCheckoutModal } from './components/StripeCheckout';
import { useI18n } from './i18n/i18nContext';
import { fetchWatches, postWatch as apiPostWatch, deleteWatch as apiDeleteWatch, getStoredWatches } from './api/watchApi';
import { Search, Award, Shield, Truck } from 'lucide-react';

export const App = () => {
  const { t } = useI18n();

  const [watches, setWatches] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Modals visibility
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedConciergeWatch, setSelectedConciergeWatch] = useState(null);

  // Initial fetch + Live Synchronization (cross-tab & Supabase real-time)
  useEffect(() => {
    let isMounted = true;

    const loadWatches = async () => {
      const data = await fetchWatches();
      if (isMounted && data) {
        setWatches(data);
      }
    };

    loadWatches();

    // Sync when localStorage changes in another tab
    const handleStorageChange = (e) => {
      if (e.key === 'gershon_watches_catalog' && isMounted && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setWatches(parsed);
          }
        } catch (err) {
          console.warn('Storage sync parse error:', err);
        }
      }
    };

    // Custom event fired by watchApi when Supabase pushes a change
    const handleSupabaseUpdate = () => {
      const data = getStoredWatches();
      if (isMounted && Array.isArray(data)) {
        setWatches(data);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('watches-updated', handleSupabaseUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('watches-updated', handleSupabaseUpdate);
    };
  }, []);

  // Post Watch Handler (requires admin authorization)
  const handlePostWatch = async (newWatchData) => {
    if (!isAdminLoggedIn) {
      setIsAdminLoginOpen(true);
      return;
    }
    const created = await apiPostWatch(newWatchData);
    setWatches((prev) => [created, ...prev.filter((w) => w.id !== created.id)]);
  };

  // Delete Watch Handler (requires admin authorization)
  const handleDeleteWatch = async (id) => {
    if (!isAdminLoggedIn) {
      setIsAdminLoginOpen(true);
      return;
    }
    if (window.confirm(t('deleteConfirm'))) {
      await apiDeleteWatch(id);
      setWatches((prev) => prev.filter((w) => w.id !== id));
    }
  };

  // Add to Cart Handler
  const handleAddToCart = (watch) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === watch.id);
      if (exists) return prev;
      return [...prev, { ...watch, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  // Remove from Cart Handler
  const handleRemoveFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Filter watches
  const filteredWatches = watches.filter((watch) => {
    const matchesSearch =
      watch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (watch.brand && watch.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (watch.description && watch.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const isNullPrice = watch.price === null || watch.price === undefined || watch.price === '';

    if (filterType === 'priced') return matchesSearch && !isNullPrice;
    if (filterType === 'por') return matchesSearch && isNullPrice;
    return matchesSearch;
  });

  const cartTotalAmount = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);

  return (
    <div className="app-container">
      {/* Header with Navigation & Admin Status */}
      <Header
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdmin={() => {
          if (!isAdminLoggedIn) {
            setIsAdminLoginOpen(true);
          } else {
            setIsAdminOpen(true);
          }
        }}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onLogoutAdmin={() => setIsAdminLoggedIn(false)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartItems.length}
      />

      {/* Hero Section â€“ bigger background image + EWE text block */}
      <section
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.50) 0%, rgba(248,249,250,0.72) 70%, #f8f9fa 100%), url("images/header-bg.jpg")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          minHeight: '520px',
          padding: '3rem 2rem 3rem',
        }}
      >
        <div className="hero-subtitle">{t('tagline')}</div>
        <h1 className="hero-title">{t('heroTitle')}</h1>
        <p className="hero-desc">{t('heroSubtitle')}</p>

        {/* EWE About Block - clean, no card */}
        <div style={{ maxWidth: '700px', margin: '1.8rem auto 2rem', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', letterSpacing: '0.2em', marginBottom: '1rem', color: '#1a1a1a' }}>TIMEPIECES</h2>
          <p style={{ color: '#444', lineHeight: '1.75', marginBottom: '0.8rem', fontSize: '0.91rem' }}>European Watch Enthusiasts is a newly launched online community and media platform dedicated to the art, craft, and culture of fine timepieces. Created for those who appreciate the precision of horology and the stories behind every watch, EWE bridges passionate collectors, independent microbrands, and established maisons from across Europe.</p>
          <p style={{ color: '#444', lineHeight: '1.75', marginBottom: '0.8rem', fontSize: '0.91rem' }}>Our mission is to celebrate the diversity of watchmaking — from legendary Swiss complications to the rising wave of European microbrands redefining elegance and innovation. Through curated articles, interviews, and exclusive content, we bring together enthusiasts who share a common passion: timeless design and mechanical beauty.</p>
          <p style={{ color: '#444', lineHeight: '1.75', fontSize: '0.91rem' }}>Follow our journey on Instagram: <a href="https://www.instagram.com/european_watch_enthusiasts?igsh=MW9kenFmMmd2ZzVsag==" target="_blank" rel="noopener noreferrer" style={{ color: '#b8963e', fontWeight: '600', textDecoration: 'none' }}>?? @european_watch_enthusiasts</a></p>
        </div>

        <button
          className="btn-primary"
          onClick={() => {
            const el = document.getElementById('catalog-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          {t('exploreCatalog')}
        </button>
      </section>

      {/* Controls Bar: Search & Filter Tabs */}
      <div className="controls-bar" id="catalog-section">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="watch-search-input"
          />
        </div>

        <div className="filter-group">
          <button
            className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            {t('filterAll')}
          </button>
          <button
            className={`filter-btn ${filterType === 'priced' ? 'active' : ''}`}
            onClick={() => setFilterType('priced')}
          >
            {t('filterPriceAvailable')}
          </button>
          <button
            className={`filter-btn ${filterType === 'por' ? 'active' : ''}`}
            onClick={() => setFilterType('por')}
          >
            {t('filterPriceOnRequest')}
          </button>
        </div>
      </div>

      {/* Watch Catalog Showcase */}
      <main className="catalog-container">
        {filteredWatches.length > 0 ? (
          <div className="watch-grid">
            {filteredWatches.map((watch) => (
              <WatchCard
                key={watch.id}
                watch={watch}
                isAdminLoggedIn={isAdminLoggedIn}
                onAddToCart={handleAddToCart}
                onDeleteWatch={handleDeleteWatch}
                onOpenConcierge={(w) => setSelectedConciergeWatch(w)}
              />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-gold)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
            maxWidth: '650px',
            margin: '0 auto'
          }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '0.75rem', color: '#111827' }}>
              Exclusive Collection Awaiting Exhibition
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              The showcase is currently being curated. Authenticate as Owner Admin to post new luxury timepieces to the catalog.
            </p>
            {!isAdminLoggedIn && (
              <button
                className="btn-primary"
                onClick={() => setIsAdminLoginOpen(true)}
              >
                Authenticate as Owner Admin
              </button>
            )}
            {isAdminLoggedIn && (
              <button
                className="btn-primary"
                onClick={() => setIsAdminOpen(true)}
              >
                + Post First Timepiece
              </button>
            )}
          </div>
        )}
      </main>

      {/* Guarantee & Authenticity Banner */}
      <section className="guarantee-banner">
        <div className="guarantee-item">
          <Award size={36} className="guarantee-icon" />
          <h3>{t('guaranteeTitle')}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            {t('guaranteeText')}
          </p>
        </div>
        <div className="guarantee-item">
          <Shield size={36} className="guarantee-icon" />
          <h3>Swiss Horology Standard</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            Certified movement accuracy tested in extreme environments.
          </p>
        </div>
        <div className="guarantee-item">
          <Truck size={36} className="guarantee-icon" />
          <h3>Insured Global Delivery</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            Armored white-glove courier dispatch to over 80 countries.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <p>{t('footerText')}</p>
      </footer>

      {/* Admin Passcode Authentication Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdminLoggedIn(true);
          setIsAdminOpen(true);
        }}
      />

      {/* Admin Post Watch Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onPostWatch={handlePostWatch}
      />

      {/* Concierge Inquiry Modal for Null Prices */}
      <ConciergeModal
        isOpen={!!selectedConciergeWatch}
        watch={selectedConciergeWatch}
        onClose={() => setSelectedConciergeWatch(null)}
      />

      {/* Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveFromCart={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Stripe Payment Modal */}
      <StripeCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        totalAmount={cartTotalAmount}
        onPaymentSuccess={() => {
          setCartItems([]);
        }}
      />
    </div>
  );
};
