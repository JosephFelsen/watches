import React from 'react';
import { ShoppingBag, Trash2, Mail } from 'lucide-react';
import { useI18n } from '../i18n/i18nContext';

export const WatchCard = ({ watch, isAdminLoggedIn, onAddToCart, onDeleteWatch, onOpenConcierge }) => {
  const { t } = useI18n();

  const isPriceNull = watch.price === null || watch.price === undefined || watch.price === '';

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="watch-card" id={`watch-card-${watch.id}`}>
      <div className="watch-image-wrapper">
        <span className="badge-brand">{watch.brand || 'Gershon Atelier'}</span>
        {isPriceNull && (
          <span className="badge-por">{t('priceOnRequest')}</span>
        )}
        <img 
          src={watch.imageUrl || '/images/watch1.png'} 
          alt={watch.name} 
          className="watch-image"
          onError={(e) => {
            e.target.src = '/images/watch1.png';
          }}
        />
      </div>

      <div className="watch-card-body">
        <h3 className="watch-title">{watch.name}</h3>
        <p className="watch-desc">{watch.description || 'Exclusive luxury horological timepiece.'}</p>

        <div className="watch-card-footer">
          <div>
            {isPriceNull ? (
              <div className="price-null-tag">{t('priceOnRequest')}</div>
            ) : (
              <div className="price-tag">{formatPrice(watch.price)}</div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {isPriceNull ? (
              <button 
                className="btn-secondary" 
                onClick={() => onOpenConcierge(watch)}
                style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
              >
                <Mail size={16} />
                <span>{t('contactConcierge')}</span>
              </button>
            ) : (
              <button 
                className="btn-primary" 
                onClick={() => onAddToCart(watch)}
                style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
                id={`add-to-cart-${watch.id}`}
              >
                <ShoppingBag size={16} />
                <span>{t('addToCart')}</span>
              </button>
            )}

            {/* Delete button only visible when Owner Admin is logged in! */}
            {isAdminLoggedIn && (
              <button 
                className="btn-danger" 
                onClick={() => onDeleteWatch(watch.id)}
                title={t('deleteWatch')}
                id={`delete-watch-${watch.id}`}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
