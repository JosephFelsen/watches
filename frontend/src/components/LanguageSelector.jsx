import React from 'react';
import { useI18n } from '../i18n/i18nContext';

export const LanguageSelector = () => {
  const { lang, setLang } = useI18n();

  return (
    <div className="lang-selector">
      <button 
        className={`lang-btn ${lang === 'en' ? 'active' : ''}`} 
        onClick={() => setLang('en')}
        title="English"
      >
        🇬🇧 EN
      </button>
      <button 
        className={`lang-btn ${lang === 'fr' ? 'active' : ''}`} 
        onClick={() => setLang('fr')}
        title="Français"
      >
        🇫🇷 FR
      </button>
      <button 
        className={`lang-btn ${lang === 'nl' ? 'active' : ''}`} 
        onClick={() => setLang('nl')}
        title="Nederlands"
      >
        🇳🇱 NL
      </button>
    </div>
  );
};
