/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#e2e8f0',
          100: '#cbd5e1',
          200: '#94a3b8',
          300: '#64748b',
          400: '#475569',
          500: '#334155',
          600: '#1e293b',
          700: '#0f172a',
          800: '#0b1220',
          900: '#070c16'
        },
        primary: '#0F172A',
        secondary: '#10B981',
        accent: '#3B82F6',
        warning: '#F59E0B',
        danger: '#EF4444',
        neutral: {
          50: '#f8fafc',
          100: '#e2e8f0',
          200: '#cbd5e1',
          300: '#94a3b8',
          400: '#64748b',
          500: '#475569',
          600: '#334155',
          700: '#1e293b',
          800: '#0f172a',
          900: '#0b1220'
        }
      },
      fontFamily: {
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      boxShadow: {
        card: '0 10px 30px rgba(15, 23, 42, 0.08)',
        glass: '0 20px 50px rgba(15, 23, 42, 0.18)'
      },
      backgroundImage: {
        'hero-radial':
          'radial-gradient(circle at 20% 20%, rgba(59,130,246,0.18), transparent 30%), radial-gradient(circle at 80% 10%, rgba(16,185,129,0.18), transparent 28%), radial-gradient(circle at 50% 80%, rgba(15,23,42,0.22), transparent 32%)'
      }
    }
  },
  plugins: []
};
