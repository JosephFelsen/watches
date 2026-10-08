import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ShieldCheck, CreditCard, CheckCircle2 } from 'lucide-react';
import { useI18n } from '../i18n/i18nContext';

// Standard Stripe public key (publishable test key format)
const stripePromise = loadStripe('pk_test_51PxGershonWatchesStripeMockKey123456789');

const CheckoutForm = ({ totalAmount, onSuccessClose }) => {
  const { t } = useI18n();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Simulate Stripe payment intent processing for luxury checkout demo
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onSuccessClose();
      }, 3000);
    }, 1500);
  };

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: '#f3f4f6',
        fontFamily: 'Outfit, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#9ca3af',
        },
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
        <CheckCircle2 size={54} color="var(--accent-gold)" style={{ marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.5rem' }}>{t('paymentSuccess')}</h3>
        <p style={{ color: 'var(--text-muted)' }}>{t('guaranteeText')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border-gold)',
        padding: '1.25rem',
        borderRadius: '12px',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Card Payment Details</span>
          <CreditCard size={20} color="var(--accent-gold)" />
        </div>
        <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold-light)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        <ShieldCheck size={18} />
        <span>End-to-End Encrypted via Stripe SSL</span>
      </div>

      <button 
        type="submit" 
        className="btn-primary" 
        disabled={loading}
        style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
        id="stripe-pay-button"
      >
        {loading ? t('processing') : `${t('payNow')} - €${totalAmount.toLocaleString('fr-FR')}`}
      </button>
    </form>
  );
};

export const StripeCheckoutModal = ({ isOpen, onClose, totalAmount, onPaymentSuccess }) => {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ color: 'var(--accent-gold)' }}>{t('stripeTitle')}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <Elements stripe={stripePromise}>
          <CheckoutForm 
            totalAmount={totalAmount} 
            onSuccessClose={() => {
              onPaymentSuccess();
              onClose();
            }} 
          />
        </Elements>
      </div>
    </div>
  );
};
