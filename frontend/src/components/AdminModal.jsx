import React, { useState } from 'react';
import { X, Sparkles, Upload, Image as ImageIcon } from 'lucide-react';
import { useI18n } from '../i18n/i18nContext';

export const AdminModal = ({ isOpen, onClose, onPostWatch }) => {
  const { t } = useI18n();

  const [formData, setFormData] = useState({
    name: '',
    brand: 'Gershon Genève',
    price: '',
    imageUrl: '/images/watch1.png',
    description: ''
  });

  const [imagePreview, setImagePreview] = useState('/images/watch1.png');

  if (!isOpen) return null;

  // Handle direct local image file upload (converts to base64 Data URL)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setImagePreview(base64Image);
        setFormData((prev) => ({ ...prev, imageUrl: base64Image }));
      };
      reader.readAsDataURL(file);
    }
  };

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
    setImagePreview('/images/watch1.png');
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

          {/* File Upload Box */}
          <div className="form-group">
            <label className="form-label">{t('formUploadImage') || 'Upload Watch Image'}</label>
            
            <div style={{
              border: '2px dashed var(--border-gold)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.02)',
              cursor: 'pointer',
              marginBottom: '0.75rem',
              position: 'relative'
            }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  cursor: 'pointer',
                  width: '100%',
                  height: '100%'
                }}
                id="file-upload-input"
              />
              <Upload size={32} color="var(--accent-gold)" style={{ marginBottom: '0.5rem' }} />
              <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>
                {t('clickToUpload') || 'Click or drag image file here to upload'}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                PNG, JPG, WEBP or GIF supported
              </div>
            </div>

            {/* Image Preview Box */}
            {imagePreview && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                background: 'rgba(0,0,0,0.4)',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--border-gold)'
              }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ width: '60px', height: '60px', objectFit: 'contain', background: '#000', borderRadius: '6px' }} 
                />
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold-light)', fontWeight: 600, display: 'block' }}>
                    Image Selected
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Ready for publication
                  </span>
                </div>
              </div>
            )}

            {/* Sample Image Presets */}
            <div style={{ marginTop: '0.75rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Or pick a sample timepiece image:</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['/images/watch1.png', '/images/watch2.png', '/images/watch3.png'].map((img, idx) => (
                  <button
                    type="button"
                    key={idx}
                    className="btn-secondary"
                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                    onClick={() => {
                      setImagePreview(img);
                      setFormData({ ...formData, imageUrl: img });
                    }}
                  >
                    Sample {idx + 1}
                  </button>
                ))}
              </div>
            </div>
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
