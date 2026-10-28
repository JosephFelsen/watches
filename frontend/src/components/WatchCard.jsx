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
        <img 
          src={watch.imageUrl || 'images/watch1.png'} 
          alt={watch.name} 
          className="watch-image"
          onError={(e) => {
            e.target.src = 'images/watch1.png';
          }}
        />
      </div>

      <div className="watch-card-body">
        <h3 className="watch-title">{watch.name}</h3>
        <p className="watch-desc">{watch.description || 'Exclusive luxury horological timepiece.'}</p>

        <div className="watch-card-footer">
          <div className="watch-price-row">
            {isPriceNull ? (
              <span className="price-null-tag">{t('priceOnRequest')}</span>
            ) : (
              <span className="price-tag">{formatPrice(watch.price)}</span>
            )}
          </div>

          <div className="watch-actions-row">
            {isPriceNull ? (
              <button 
                className="btn-concierge-minimal" 
                onClick={() => onOpenConcierge(watch)}
              >
                <Mail size={15} strokeWidth={1.5} />
                <span>{t('contactConcierge') || 'Inquire Concierge'}</span>
              </button>
            ) : (
              <button 
                className="btn-concierge-minimal" 
                onClick={() => onAddToCart(watch)}
                id={`add-to-cart-${watch.id}`}
              >
                <ShoppingBag size={15} strokeWidth={1.5} />
                <span>{t('addToCart')}</span>
              </button>
            )}

            {isAdminLoggedIn && (
              <button 
                className="btn-delete-minimal" 
                onClick={() => onDeleteWatch(watch.id)}
                title={t('deleteWatch')}
                id={`delete-watch-${watch.id}`}
              >
                <Trash2 size={15} strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
