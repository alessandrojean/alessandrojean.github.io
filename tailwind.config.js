const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  darkMode: 'class',
  theme: {
    fontFamily: {
      ...defaultTheme.fontFamily,
      sans: ['Inter', ...defaultTheme.fontFamily.sans],
      'sans-var': ['Inter var', ...defaultTheme.fontFamily.sans],
      mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono]
    },
    extend: {
      colors: {
        primary: colors.sky,
        secondary: colors.amber,
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            code: {
              backgroundColor: theme('colors.primary.100'),
              color: theme('colors.primary.700'),
              padding: `${theme('padding')['0.5']} ${theme('padding.1')}`,
              borderRadius: theme('borderRadius.md'),
              '&::before, &::after': {
                content: '"" !important'
              }
            }
          }
        },
        invert: {
          css: {
            code: {
              backgroundColor: theme('colors.gray.700'),
              color: theme('colors.gray.200')
            }
          }
        }
      })
    },
  },
  plugins: [
    require('@headlessui/tailwindcss'),
    require('@tailwindcss/typography'),
    function ({ addVariant }) {
      addVariant(
        'supports-backdrop-blur',
        '@supports (backdrop-filter: blur(0)) or (-webkit-backdrop-filter: blur(0))'
      )
      addVariant(
        'supports-var-font',
        '@supports (font-variation-settings: normal)'
      )
    }
  ],
}
