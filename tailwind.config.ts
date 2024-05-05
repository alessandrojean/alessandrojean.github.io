import colors from 'tailwindcss/colors'
import defaultTheme from 'tailwindcss/defaultTheme'
import plugin from 'tailwindcss/plugin'

import headlessUiPlugin from '@headlessui/tailwindcss'
import typographyPlugin from '@tailwindcss/typography'

import type { PluginUtils } from 'tailwindcss/types/config'

export default {
  content: [],
  darkMode: 'class',
  theme: {
    fontFamily: {
      ...defaultTheme.fontFamily,
      sans: ['Inter', ...defaultTheme.fontFamily.sans],
      'sans-var': ['\'Inter var\'', ...defaultTheme.fontFamily.sans],
      display: [
        ['InterDisplay', ...defaultTheme.fontFamily.sans],
        {
          fontFeatureSettings: '"cv05", "cv08", "ss01"',
          fontVariationSettings: '"opsz" 32'
        }
      ],
      'display-var': [
        ['\'Inter var\'', ...defaultTheme.fontFamily.sans],
        {
          fontFeatureSettings: '"cv05", "cv08", "ss01"',
          fontVariationSettings: '"opsz" 32'
        }
      ],
      mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
      emoji: [
        "'Twemoji Mozilla'", "'Apple Color Emoji'", "'Segoe UI Emoji'", 
        "'Segoe UI Symbol'", "'Noto Color Emoji'", 'ui-sans-serif',
      ]
    },
    extend: {
      colors: {
        primary: colors.sky,
        secondary: colors.amber,
        gray: colors.zinc,
      },
      fontWeight: {
        inherit: 'inherit'
      },
      typography: ({ theme }: PluginUtils) => ({
        DEFAULT: {
          css: {
            code: {
              backgroundColor: theme('colors.primary.50'),
              color: `${theme('colors.primary.700')} !important`,
              padding: `${theme('padding')['0.5']} ${theme('padding')['1.5']}`,
              borderRadius: theme('borderRadius.md'),
              fontWeight: 500,
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
              backgroundColor: theme('colors.gray.800'),
              color: `${theme('colors.gray.200')} !important`
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
    }),

    /** Custom variable font safe utilities. */
    plugin(({ addUtilities, theme }) => {
      addUtilities({
        '.font-sans-safe': {
          fontFamily: theme('fontFamily.sans'),
          fontFeatureSettings: 'initial',
          fontVariationSettings: 'initial',
          '@supports (font-variation-settings: normal)': {
            fontFamily: theme('fontFamily.sans-var'),
            fontFeatureSettings: 'initial',
            fontVariationSettings: 'initial',
          }
        },
        '.font-display-safe': {
          'fontFamily': theme('fontFamily.display'),
          'fontFeatureSettings': '"cv05", "cv08", "ss01"',
          'fontVariationSettings': '"opsz" 32',
          '@supports (font-variation-settings: normal)': {
            fontFamily: theme('fontFamily.display-var'),
            fontFeatureSettings: '"cv05", "cv08", "ss01"',
            fontVariationSettings: '"opsz" 32',
          },
        },
      })
    })
  ],
}
