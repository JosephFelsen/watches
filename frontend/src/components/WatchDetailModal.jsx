import React, { useState } from 'react';
import { X, Share2, Check, Mail, ShoppingBag } from 'lucide-react';
import { useI18n } from '../i18n/i18nContext';

export const WatchDetailModal = ({ watch, isOpen, onClose, onAddToCart, onOpenConcierge }) => {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !watch) return null;

  const isPriceNull = watch.price === null || watch.price === undefined || watch.price === '';

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${watch.name} | Gershon Watches`,
      text: `${watch.brand ? watch.brand + ' - ' : ''}${watch.name}: ${watch.description || 'Exclusive timepiece.'}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Share error:', err);
        }
      }
    }

    // Fallback: Copy to clipboard
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
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn('Clipboard copy error:', e);
    }
  };

  return (
    <div className="modal-overlay watch-detail-overlay" onClick={onClose}>
      <div className="watch-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Top actions: Share & Close */}
        <div className="watch-detail-header-actions">
          <button 
            className="btn-detail-action" 
            onClick={handleShare} 
            title="Share timepiece"
          >
            {copied ? <Check size={18} color="var(--forest-green)" /> : <Share2 size={18} />}
            <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>
              {copied ? 'Link Copied!' : 'Share'}
            </span>
          </button>

          <button className="btn-detail-close" onClick={onClose} title="Close">
            <X size={22} />
          </button>
        </div>

        {/* Large Watch Image Showcase */}
        <div className="watch-detail-image-box">
          <img 
            src={watch.imageUrl || 'images/watch1.png'} 
            alt={watch.name} 
            className="watch-detail-image"
            onError={(e) => {
              e.target.src = 'images/watch1.png';
            }}
          />
        </div>

        {/* Watch Details Information */}
        <div className="watch-detail-info">
          {watch.brand && (
            <div className="watch-detail-brand">{watch.brand}</div>
          )}
          <h2 className="watch-detail-title">{watch.name}</h2>

          <div className="watch-detail-price">
            {isPriceNull ? (
              <span className="price-null-tag" style={{ fontSize: '1.25rem' }}>
                {t('priceOnRequest')}
              </span>
            ) : (
              <span className="price-tag" style={{ fontSize: '1.35rem' }}>
                {formatPrice(watch.price)}
              </span>
            )}
          </div>

          <p className="watch-detail-description">
            {watch.description || 'Exclusive luxury horological timepiece crafted with the finest complications, finishing, and Swiss precision.'}
          </p>

          <div className="watch-detail-actions">
            {isPriceNull ? (
              <button 
                className="btn-primary" 
                style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
                onClick={() => {
                  onClose();
                  onOpenConcierge(watch);
                }}
              >
                <Mail size={18} />
                <span>{t('contactConcierge') || 'Inquire Concierge'}</span>
              </button>
            ) : (
              <button 
                className="btn-primary" 
                style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
                onClick={() => {
                  onAddToCart(watch);
                  onClose();
                }}
              >
                <ShoppingBag size={18} />
                <span>{t('addToCart')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
