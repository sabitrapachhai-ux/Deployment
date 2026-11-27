export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { 900: '#0B2545', 700: '#13315C', 500: '#1D5FA8' },
        accent: { 500: '#F59E0B', 100: '#FEF3C7' },
        surface: '#F8FAFC', card: '#FFFFFF', ink: '#0F172A', muted: '#64748B', border: '#E2E8F0',
        success: '#16A34A', warning: '#D97706', danger: '#DC2626', info: '#2563EB',
      },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
