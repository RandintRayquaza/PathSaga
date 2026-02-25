/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Outfit"', 'system-ui', 'sans-serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(2.5rem, 6vw, 4.5rem)',  { lineHeight: '1.05', letterSpacing: '-0.04em', fontWeight: '700' }],
        'h1':      ['clamp(2rem, 5vw, 3.5rem)',    { lineHeight: '1.1',  letterSpacing: '-0.03em', fontWeight: '700' }],
        'h2':      ['clamp(1.375rem, 3vw, 2.25rem)',{ lineHeight: '1.2',  letterSpacing: '-0.025em', fontWeight: '600' }],
        'h3':      ['clamp(1.125rem, 2vw, 1.5rem)',{ lineHeight: '1.3',  letterSpacing: '-0.015em', fontWeight: '600' }],
      },
      animation: {
        'fade-in':  'fadeIn 0.35s ease-out both',
        'slide-up': 'slideUp 0.4s ease-out both',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' },                               to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
