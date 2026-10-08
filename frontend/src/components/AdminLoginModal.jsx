import React, { useState } from 'react';
import { Lock, X, KeyRound, ShieldAlert } from 'lucide-react';
import { useI18n } from '../i18n/i18nContext';

export const AdminLoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const { t } = useI18n();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    // Default admin passcode for gershon/watches (e.g., '1234' or 'gershon2026')
    if (passcode === '1234' || passcode === 'gershon2026' || passcode === 'admin') {
      onLoginSuccess();
      setPasscode('');
      setError(false);
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)' }}>
            <Lock size={22} />
            {t('adminAuthTitle') || 'Admin Authentication'}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            {t('adminAuthDesc') || 'Enter owner passcode to access watch management and deletion features.'}
          </p>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fca5a5',
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <ShieldAlert size={16} />
              <span>{t('adminAuthError') || 'Invalid admin passcode. Try: 1234'}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">{t('adminPasscodeLabel') || 'Owner Passcode'}</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                className="form-input"
                placeholder="Enter passcode (Default: 1234)"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError(false);
                }}
                required
                autoFocus
                id="admin-passcode-input"
              />
              <KeyRound size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
            <div className="form-help">Default owner PIN: <strong>1234</strong></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              {t('cancel')}
            </button>
            <button type="submit" className="btn-primary" id="admin-login-submit-btn">
              {t('adminLoginBtn') || 'Authenticate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
