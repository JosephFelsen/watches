import React from 'react';
import { ShoppingBag, PlusCircle, ShieldCheck, LogOut, Lock } from 'lucide-react';
import { useI18n } from '../i18n/i18nContext';
import { LanguageSelector } from './LanguageSelector';

export const Header = ({ onOpenAdmin, onOpenAdminLogin, isAdminLoggedIn, onLogoutAdmin, onOpenCart, cartCount }) => {
  const { t } = useI18n();

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="brand-logo">
          <img src="images/logo.png" alt="Gershon Watches Logo" className="custom-logo-img" />
          <div>
            <div className="brand-name">{t('brand')}</div>
          </div>
        </div>

        <div className="nav-actions">
          <LanguageSelector />

          {isAdminLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid var(--accent-gold)',
                color: 'var(--accent-gold-light)',
                padding: '0.4rem 0.8rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <ShieldCheck size={16} />
                {t('adminModeActive')}
              </span>

              <button className="btn-primary" onClick={onOpenAdmin} id="open-post-watch-btn">
                <PlusCircle size={18} />
                <span>{t('postWatchBtn')}</span>
              </button>

              <button className="btn-secondary" onClick={onLogoutAdmin} title={t('logoutAdmin')} style={{ padding: '0.55rem' }}>
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button className="btn-secondary" onClick={onOpenAdminLogin} id="open-admin-login-btn">
              <Lock size={16} />
              <span>Owner Admin</span>
            </button>
          )}

          <button className="cart-icon-btn" onClick={onOpenCart} id="open-cart-btn" title={t('navCart')}>
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
};
