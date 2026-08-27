/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        cyber: {
          dark: '#050118',
          card: '#0c0a24',
          border: '#1e1b3a',
          accent: '#5b9fd4',   // Softer sky blue
          neon: '#8b7ccf',     // Muted lavender
          danger: '#e85a75',   // Softer rose
          warning: '#e8a84c',
          glow: '#6352dc',     // Warmer indigo
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar': 'radar 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s infinite linear',
        'float': 'float 8s ease-in-out infinite',
        'slide-up': 'slideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'gradient-shift': 'gradientShift 10s ease infinite',
        'bounce-short': 'bounceShort 0.5s ease-out',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'scale(0.97)', opacity: '0.7' },
          '50%': { transform: 'scale(1.03)', opacity: '0.4' },
          '100%': { transform: 'scale(0.97)', opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        bounceShort: {
          '0%': { transform: 'translateY(-8px)', opacity: '0' },
          '60%': { transform: 'translateY(2px)', opacity: '1' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
