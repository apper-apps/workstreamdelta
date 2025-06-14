/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B46E0',
        secondary: '#1A1A1A',
        accent: '#00D4AA',
        surface: '#FFFFFF',
        background: '#F8F9FA',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        'surface-50': '#f8fafc',
        'surface-100': '#f1f5f9',
        'surface-200': '#e2e8f0',
        'surface-300': '#cbd5e1',
        'surface-400': '#94a3b8',
        'surface-500': '#64748b',
        'surface-600': '#475569',
        'surface-700': '#334155',
        'surface-800': '#1e293b',
        'surface-900': '#0f172a'
      },
      fontFamily: { 
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui'],
        heading: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui']
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.563rem',
        '3xl': '1.953rem',
        '4xl': '2.441rem',
        '5xl': '3.052rem'
      }
    },
  },
  plugins: [],
}