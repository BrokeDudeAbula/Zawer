/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Google Material 色板，取自 Google Maps 实际使用的取值
        gm: {
          blue: '#1a73e8',
          'blue-hover': '#1765cc',
          'blue-light': '#e8f0fe',
          red: '#d93025',
          green: '#1e8e3e',
          yellow: '#f9ab00',
          orange: '#e8710a',
        },
        // 文字与描边层级
        ink: {
          primary: '#202124',
          secondary: '#5f6368',
          tertiary: '#70757a',
        },
        surface: {
          DEFAULT: '#ffffff',
          variant: '#f1f3f4',
          hover: '#f8f9fa',
        },
        outline: '#dadce0',
        // Zawer 指数语义色，对齐 Google 色板
        'zawer-danger': '#d93025',
        'zawer-warning': '#e8710a',
        'zawer-neutral': '#f9ab00',
        'zawer-safe': '#1e8e3e',
        'zawer-excellent': '#188038',
      },
      boxShadow: {
        // Google 的 elevation 体系，用双层阴影模拟纸片高度
        'gm-1': '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)',
        'gm-2': '0 1px 2px 0 rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15)',
        'gm-3': '0 1px 3px 0 rgba(60,64,67,.3), 0 4px 8px 3px rgba(60,64,67,.15)',
        'gm-4': '0 2px 3px 0 rgba(60,64,67,.3), 0 6px 10px 4px rgba(60,64,67,.15)',
      },
      borderRadius: {
        gm: '8px',
        'gm-lg': '12px',
        pill: '9999px',
      },
      fontSize: {
        'gm-xs': ['11px', '16px'],
        'gm-sm': ['12px', '16px'],
        'gm-base': ['14px', '20px'],
        'gm-lg': ['16px', '24px'],
        'gm-xl': ['22px', '28px'],
      },
    },
  },
  plugins: [],
}
