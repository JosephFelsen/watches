import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useI18n } from '../i18n/i18nContext';

export const CartDrawer = ({ isOpen, onClose, cartItems, onRemoveFromCart, onProceedToCheckout }) => {
  const { t } = useI18n();

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((acc, item) => {
    return acc + (item.price || 0) * (item.quantity || 1);
  }, 0);

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <>
      <div className="cart-drawer-overlay" onClick={onClose} />
      <div className="cart-drawer">
        <div className="modal-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)' }}>
            <ShoppingBag size={22} />
            {t('cartTitle')}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-items-list">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '3rem' }}>
              <ShoppingBag size={48} strokeWidth={1} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>{t('cartEmpty')}</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.imageUrl || 'images/watch1.png'} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <div className="cart-item-title">{item.name}</div>
                  <div className="cart-item-price">{formatPrice(item.price)}</div>
                </div>
                <button 
                  className="btn-danger" 
                  onClick={() => onRemoveFromCart(item.id)}
                  style={{ padding: '0.4rem' }}
                  title="Remove"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>{t('subtotal')}</span>
              <span style={{ color: 'var(--accent-gold)' }}>{formatPrice(totalAmount)}</span>
            </div>
            <button 
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
              onClick={onProceedToCheckout}
              id="proceed-to-checkout-btn"
            >
              <span>{t('checkoutBtn')}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};
