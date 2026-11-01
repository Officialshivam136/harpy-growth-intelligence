/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        harpy: {
          navy: '#090D14',        // Deep navy primary background
          charcoal: '#0D111A',    // Dark charcoal sidebar and deep surfaces
          card: '#0F1726',        // Enterprise card surface
          cardHover: '#131E31',   // Card hover background
          cardBorder: '#1A2338',  // Subtle enterprise border
          cardBorderHover: '#2A3B5C',
          subtle: '#94A3B8',      // Muted slate text
          muted: '#64748B',       // Deep muted
        },
        emerald: {
          DEFAULT: '#22C55E',     // Primary accent
          glow: 'rgba(34, 197, 94, 0.25)',
          muted: '#052E16',
          border: '#14532D',
        },
        electric: {
          DEFAULT: '#38BDF8',     // Secondary electric blue accent
          light: '#7DD3FC',
          dark: '#0284C7',
          glow: 'rgba(56, 189, 248, 0.25)',
          muted: '#0C4A6E',
          border: '#0369A1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 2px 6px -2px rgba(0, 0, 0, 0.3)',
        'emerald-glow': '0 0 20px -4px rgba(34, 197, 94, 0.35)',
        'electric-glow': '0 0 20px -4px rgba(56, 189, 248, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'harpy-glow': 'radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.08) 0%, transparent 60%)',
        'emerald-gradient': 'linear-gradient(135deg, #22C55E 0%, #10B981 100%)',
        'electric-gradient': 'linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

