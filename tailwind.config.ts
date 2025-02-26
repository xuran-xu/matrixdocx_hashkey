import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2A4858', // 深青灰色
        secondary: '#8EADC3', // 柔和蓝灰色
        accent: '#95B2B8', // 淡青色
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#2A4858",
          "secondary": "#8EADC3",
          "accent": "#95B2B8",
          "neutral": "#4A5568",
          "base-100": "#FFFFFF",
          "base-200": "#F7FAFC",
          "base-300": "#E2E8F0",
          "info": "#63B3ED",
          "success": "#68D391",
          "warning": "#F6AD55",
          "error": "#FC8181",
        },
      },
    ],
  },
}

export default config