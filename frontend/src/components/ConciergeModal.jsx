import React, { useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { useI18n } from '../i18n/i18nContext';

export const ConciergeModal = ({ watch, isOpen, onClose }) => {
  const { t } = useI18n();
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen || !watch) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 3000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ color: 'var(--accent-rose)' }}>{t('conciergeTitle')}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <CheckCircle2 size={48} color="var(--accent-gold)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>{t('conciergeSuccess')}</h3>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem', fontSize: '0.95rem' }}>
              {t('conciergeDesc')}
            </p>

            <div style={{ 
              background: 'rgba(255, 255, 255, 0.03)', 
              padding: '1rem', 
              borderRadius: '8px', 
              border: '1px solid var(--border-gold)',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <img src={watch.imageUrl || '/images/watch1.png'} alt={watch.name} style={{ width: 50, height: 50, objectFit: 'contain' }} />
              <div>
                <strong style={{ color: '#fff', display: 'block' }}>{watch.name}</strong>
                <span style={{ color: 'var(--accent-rose)', fontSize: '0.85rem' }}>{t('priceOnRequest')}</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Your Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="client@luxury.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message / Preferred Appointment Date</label>
              <textarea 
                rows="3" 
                className="form-textarea" 
                placeholder="I would like to inquire about private acquisition of this timepiece..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Send size={18} />
              <span>{t('conciergeSend')}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
