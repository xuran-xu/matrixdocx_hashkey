import type { Config } from 'tailwindcss'
// @ts-ignore
const daisyui = require('daisyui')

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sora: ['var(--font-sora)', 'sans-serif'],
      },
      colors: {
        primary: '#E4BE7D',
      }
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        dark: {
          "color-scheme": "dark",
          "base-100": "oklch(25.33% 0.016 252.42)",
          "base-200": "oklch(23.26% 0.014 253.1)",
          "base-300": "oklch(21.15% 0.012 254.09)",
          "base-content": "oklch(97.807% 0.029 256.847)",
          "primary": "oklch(85% 0.199 91.936)",
          "primary-content": "oklch(26% 0.051 172.552)",
          "secondary": "oklch(87% 0.169 91.605)",
          "secondary-content": "oklch(0% 0 0)",
          "accent": "oklch(94% 0.129 101.54)",
          "accent-content": "oklch(26% 0.051 172.552)",
          "neutral": "oklch(27% 0.006 286.033)",
          "neutral-content": "oklch(92% 0.004 286.32)",
          "info": "oklch(98% 0.003 247.858)",
          "info-content": "oklch(26% 0.051 172.552)",
          "success": "oklch(82% 0.189 84.429)",
          "success-content": "oklch(37% 0.077 168.94)",
          "warning": "#9370DB",
          "warning-content": "oklch(98% 0.002 247.839)",
          "error": "oklch(71% 0.194 13.428)",
          "error-content": "oklch(27% 0.105 12.094)",
          "--rounded-box": "0.5rem",
          "--rounded-btn": "0.25rem",
          "--rounded-badge": "0.25rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        },
      },
    ],
    base: true,
    styled: true,
    utils: true,
    logs: true,
    darkTheme: "dark",
  },
}

export default config