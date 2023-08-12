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
    colors: {
      ...colors,
      gray: colors.zinc,
    },
    fontFamily: {
      ...defaultTheme.fontFamily,
      sans: ['Inter', ...defaultTheme.fontFamily.sans],
      'sans-var': ['\'Inter var\'', ...defaultTheme.fontFamily.sans],
      display: [
        ['\'Inter var\'', ...defaultTheme.fontFamily.sans],
        {
          fontFeatureSettings: '"cv08", "cv11", "ss01"',
          fontVariationSettings: '"opsz" 32'
        }
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
          'fontFamily': theme('fontFamily.sans'),
          'fontFeatureSettings': '"cv08", "cv11", "ss01"',
          'fontVariationSettings': '"opsz" 32',
          '@supports (font-variation-settings: normal)': {
            fontFamily: theme('fontFamily.sans-var'),
            fontFeatureSettings: '"cv08", "cv11", "ss01"',
            fontVariationSettings: '"opsz" 32',
          },
        },
      })
    })
  ],
}
