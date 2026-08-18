/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        banking: {
          navy: '#0D1B2A',       // 60% Primary / Overall
          softBlue: '#E8EEF6',   // 30% Secondary / Sections
          background: '#F7F9FC', // 30% Main Page Background
          card: '#FFFFFF',       // 30% Card Background
          primary: '#2563EB',    // 10% Primary Action Blue
          success: '#16A34A',    // 10% Approved / Success
          warning: '#F59E0B',    // 10% Pending / Warning
          error: '#DC2626',      // 10% Declined / Error
          info: '#0891B2',       // 10% Information / AI
        },
        text: {
          primary: '#1A1F2B',
          secondary: '#6B7280',
          muted: '#9CA3AF',
        },
        border: {
          DEFAULT: '#D1D5DB',
          light: '#E5E7EB',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'], // Primary typography
      },
      keyframes: {
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'check-pop': {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '60%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'slide-in-left': 'slide-in-left 0.25s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'toast-in': 'toast-in 0.25s ease-out',
        'check-pop': 'check-pop 0.35s ease-out',
      },
    },
  },
  plugins: [],
}