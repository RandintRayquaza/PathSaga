import { useSelector } from 'react-redux';
import translations from './translations';

/**
 * useT — returns a translation lookup function `t(key)`.
 * Falls back to English if a key is missing in the active language.
 *
 * Usage:
 *   const t = useT();
 *   <h2>{t('basicInfo')}</h2>
 */
export default function useT() {
  const lang = useSelector((s) => s.language?.lang ?? 'en');
  const dict = translations[lang] ?? translations.en;
  return (key) => dict[key] ?? translations.en[key] ?? key;
}
