import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          dark: '#1D4ED8',
        },
        hashkey: {
          primary: '#09f',      // 主要蓝色
          secondary: '#0072c6', // 次要蓝色
          accent: '#00bcd4',    // 强调色
          dark: {
            DEFAULT: '#0a0a15',  // 深色背景
            100: '#090915',
            200: '#0f0f20',
            300: '#171730',
            400: '#1e1e40',
          },
          light: {
            DEFAULT: '#f0f4f8', // 浅色背景
            100: '#e6f3ff',
            200: '#cce7ff',
          },
          // 其他功能性颜色
          success: '#00c853',
          warning: '#ffd600',
          error: '#f44336',
          info: '#2196f3',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hashkey-grid': "url('/grid-pattern.svg')",
      },
      boxShadow: {
        'hashkey': '0 4px 14px 0 rgba(9, 153, 255, 0.1)',
        'hashkey-lg': '0 10px 25px -3px rgba(9, 153, 255, 0.1), 0 4px 6px -2px rgba(9, 153, 255, 0.05)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
};
export default config;
