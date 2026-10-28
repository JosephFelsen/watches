import React, { useState } from 'react';
import { ShoppingBag, Trash2, Mail, Share2, Check } from 'lucide-react';
import { useI18n } from '../i18n/i18nContext';

export const WatchCard = ({ watch, isAdminLoggedIn, onAddToCart, onDeleteWatch, onOpenConcierge, onSelectWatch }) => {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const isPriceNull = watch.price === null || watch.price === undefined || watch.price === '';

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    const shareData = {
      title: `${watch.name} | Gershon Watches`,
      text: `${watch.brand ? watch.brand + ' - ' : ''}${watch.name}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err.name !== 'AbortError') console.warn(err);
      }
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(window.location.href);
      } else {
        const input = document.createElement('input');
        input.value = window.location.href;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div 
      className="watch-card" 
      id={`watch-card-${watch.id}`}
      onClick={() => onSelectWatch && onSelectWatch(watch)}
    >
      <div className="watch-image-wrapper">
        <img 
          src={watch.imageUrl || 'images/watch1.png'} 
          alt={watch.name} 
          className="watch-image"
          onError={(e) => {
            e.target.src = 'images/watch1.png';
          }}
        />
        {/* Quick share button on hover */}
        <button 
          className="btn-quick-share" 
          onClick={handleShare}
          title="Share timepiece"
        >
          {copied ? <Check size={14} color="var(--forest-green)" /> : <Share2 size={14} />}
        </button>
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
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenConcierge(watch);
                }}
              >
                <Mail size={15} strokeWidth={1.5} />
                <span>{t('contactConcierge') || 'Inquire Concierge'}</span>
              </button>
            ) : (
              <button 
                className="btn-concierge-minimal" 
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(watch);
                }}
                id={`add-to-cart-${watch.id}`}
              >
                <ShoppingBag size={15} strokeWidth={1.5} />
                <span>{t('addToCart')}</span>
              </button>
            )}

            {isAdminLoggedIn && (
              <button 
                className="btn-delete-minimal" 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteWatch(watch.id);
                }}
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
