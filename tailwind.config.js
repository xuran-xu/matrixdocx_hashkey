const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        goldRush: {
          "color-scheme": "dark",
          "base-100": "oklch(25.33% 0.016 252.42)",
          "base-200": "oklch(23.26% 0.014 253.1)", 
          "base-300": "oklch(21.15% 0.012 254.09)",
          "base-content": "oklch(97.807% 0.029 256.847)",
          "primary": "oklch(85% 0.199 91.936)",
          "primary-content": "oklch(96% 0.018 272.314)",
          "secondary": "oklch(98% 0.003 247.858)",
          "secondary-content": "oklch(0% 0 0)",
          "accent": "oklch(90% 0.182 98.111)",
          "accent-content": "oklch(0% 0 0)",
          "neutral": "oklch(27% 0.006 286.033)",
          "neutral-content": "oklch(92% 0.004 286.32)",
          "info": "oklch(74% 0.16 232.661)",
          "info-content": "oklch(29% 0.066 243.157)",
          "success": "oklch(76% 0.177 163.223)",
          "success-content": "oklch(37% 0.077 168.94)",
          "warning": "oklch(87% 0.169 91.605)",
          "warning-content": "oklch(82% 0.189 84.429)",
          "error": "oklch(71% 0.194 13.428)",
          "error-content": "oklch(27% 0.105 12.094)",
        },
      },
    ],
  },
}
