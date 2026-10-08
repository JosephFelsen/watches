import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useI18n } from '../i18n/i18nContext';

export const AdminModal = ({ isOpen, onClose, onPostWatch }) => {
  const { t } = useI18n();

  const [formData, setFormData] = useState({
    name: '',
    brand: 'Gershon Genève',
    price: '', // can be left empty for null!
    imageUrl: '/images/watch1.png',
    description: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const watchData = {
      name: formData.name || 'Untitled Timepiece',
      brand: formData.brand || 'Gershon Atelier',
      price: formData.price !== '' && !isNaN(formData.price) ? parseFloat(formData.price) : null,
      imageUrl: formData.imageUrl || '/images/watch1.png',
      description: formData.description
    };

    onPostWatch(watchData);
    setFormData({
      name: '',
      brand: 'Gershon Genève',
      price: '',
      imageUrl: '/images/watch1.png',
      description: ''
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)' }}>
            <Sparkles size={20} />
            {t('adminPanelTitle')}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t('formTitle')}</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Royal Perpetual Calendar" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              id="input-watch-name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('formBrand')}</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Gershon Genève" 
              value={formData.brand} 
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              id="input-watch-brand"
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('formPrice')}</label>
            <input 
              type="number" 
              step="0.01"
              className="form-input" 
              placeholder="e.g. 45000 (or leave empty for null)" 
              value={formData.price} 
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              id="input-watch-price"
            />
            <div className="form-help">{t('formPriceHelp')}</div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('formImage')}</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="/images/watch1.png or image URL" 
              value={formData.imageUrl} 
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              id="input-watch-image"
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              {['/images/watch1.png', '/images/watch2.png', '/images/watch3.png'].map((img, idx) => (
                <button
                  type="button"
                  key={idx}
                  className="btn-secondary"
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                  onClick={() => setFormData({ ...formData, imageUrl: img })}
                >
                  Sample {idx + 1}
                </button>
              ))}
            </div>
            <div className="form-help">{t('formImageHelp')}</div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('formDescription')}</label>
            <textarea 
              rows="3" 
              className="form-textarea" 
              placeholder="Detail movement, casing, gold purity, or rarity..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              id="input-watch-desc"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              {t('cancel')}
            </button>
            <button type="submit" className="btn-primary" id="submit-post-watch-btn">
              {t('submitPost')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
