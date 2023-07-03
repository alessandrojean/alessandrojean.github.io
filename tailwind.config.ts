import colors from 'tailwindcss/colors'
import defaultTheme from 'tailwindcss/defaultTheme'
import plugin from 'tailwindcss/plugin'

import typographyPlugin from '@tailwindcss/typography'
import headlessUiPlugin from '@headlessui/tailwindcss'

import type { PluginUtils } from 'tailwindcss/types/config'

export default {
  content: [],
  darkMode: 'class',
  theme: {
    fontFamily: {
      ...defaultTheme.fontFamily,
      sans: [
        ['Inter', ...defaultTheme.fontFamily.sans],
        { fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"' }
      ],
      'sans-var': [
        ['Inter var', ...defaultTheme.fontFamily.sans],
        { fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"' }
      ],
      mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono]
    },
    extend: {
      colors: {
        primary: colors.sky,
        secondary: colors.amber,
      },
      fontWeight: {
        inherit: 'inherit'
      },
      typography: ({ theme }: PluginUtils) => ({
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
            },
            'pre, code': {
              fontFeatureSettings: "'calt'"
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
      }),
    },
  },
  plugins: [
    headlessUiPlugin,
    typographyPlugin,
    plugin(({ addVariant }) => {
      addVariant(
        'supports-backdrop-blur',
        '@supports (backdrop-filter: blur(0)) or (-webkit-backdrop-filter: blur(0))'
      )
      addVariant(
        'supports-var-font',
        '@supports (font-variation-settings: normal)'
      )
    }),
  ],
}
