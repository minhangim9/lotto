/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          black: "#08090C",
          dark: "#0F1016",
          card: "#161722",
          card2: "#1C1E2B",
          border: "rgba(212, 175, 55, 0.2)",
          gold: "#D4AF37",
          goldLight: "#FDE047",
          goldChampagne: "#F7E7CE",
          goldDark: "#946B00",
          goldGlow: "rgba(212, 175, 55, 0.4)",
          accent: "#FF9E00",
          silver: "#C0C0C0"
        }
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #FFE072 0%, #D4AF37 50%, #996515 100%)',
        'gold-shine': 'linear-gradient(45deg, #FFEAA7 0%, #DFBA51 25%, #9E7412 50%, #E7C967 75%, #FBF0B9 100%)',
        'gold-subtle': 'linear-gradient(180deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.02) 100%)',
        'dark-gradient': 'radial-gradient(ellipse at top, #1A1C29 0%, #08090C 100%)',
      },
      boxShadow: {
        'gold-sm': '0 0 10px rgba(212, 175, 55, 0.2)',
        'gold-md': '0 0 20px rgba(212, 175, 55, 0.35)',
        'gold-lg': '0 0 35px rgba(212, 175, 55, 0.5)',
        'gold-inner': 'inset 0 1px 3px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'bounce-subtle': 'bounce 2s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
