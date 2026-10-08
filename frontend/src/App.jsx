import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WatchCard } from './components/WatchCard';
import { AdminModal } from './components/AdminModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ConciergeModal } from './components/ConciergeModal';
import { CartDrawer } from './components/CartDrawer';
import { StripeCheckoutModal } from './components/StripeCheckout';
import { useI18n } from './i18n/i18nContext';
import { fetchWatches, postWatch as apiPostWatch, deleteWatch as apiDeleteWatch } from './api/watchApi';
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

  useEffect(() => {
    const loadWatches = async () => {
      const data = await fetchWatches();
      setWatches(data);
    };
    loadWatches();
  }, []);

  // Post Watch Handler (requires admin authorization)
  const handlePostWatch = async (newWatchData) => {
    if (!isAdminLoggedIn) {
      setIsAdminLoginOpen(true);
      return;
    }
    const created = await apiPostWatch(newWatchData);
    setWatches((prev) => [created, ...prev]);
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

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-subtitle">{t('tagline')}</div>
        <h1 className="hero-title">{t('heroTitle')}</h1>
        <p className="hero-desc">{t('heroSubtitle')}</p>
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
