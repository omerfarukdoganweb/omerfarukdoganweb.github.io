/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.neutral.800'),
            a: { color: theme('colors.neutral.900'), textDecoration: 'underline' },
            'h1,h2,h3,h4': { color: theme('colors.neutral.900'), fontWeight: '700' },
            code: { color: theme('colors.neutral.700') },
          },
        },
        invert: {
          css: {
            color: theme('colors.neutral.300'),
            a: { color: theme('colors.neutral.100') },
            'h1,h2,h3,h4': { color: theme('colors.neutral.100') },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
