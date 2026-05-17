/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff2ee',
          100: '#ffe2d5',
          200: '#ffc3a9',
          300: '#ff9d6f',
          400: '#ff8149',
          500: '#ff6b35', // primary
          600: '#f74f11',
          700: '#d93b07',
          800: '#b2300b',
          900: '#92310f',
        },
        secondary: {
          50: '#ecfcfa',
          100: '#d0f7f1',
          200: '#a5efe5',
          300: '#6be2d2',
          400: '#39d0bc',
          500: '#2ec4b6', // secondary
          600: '#169485',
          700: '#17756c',
          800: '#185c57',
          900: '#194d48',
        },
        accent: {
          50: '#fef2f2',
          100: '#fde3e3',
          200: '#fccccd',
          300: '#f9a8a9',
          400: '#f57577',
          500: '#e71d36', // accent
          600: '#d41227',
          700: '#b10e21',
          800: '#930f20',
          900: '#7b111f',
        },
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        success: {
          50: '#ecfdf5',
          500: '#10b981',
          700: '#047857',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          700: '#b45309',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          700: '#b91c1c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '0': '0',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.08)',
        elevated: '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'none': '0',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        'full': '9999px',
      },
    },
  },
  plugins: [],
}