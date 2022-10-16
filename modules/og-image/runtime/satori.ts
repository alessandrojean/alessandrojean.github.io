import satori from 'satori'
import parseISO from 'date-fns/parseISO'
import type { SatoriOptions } from 'satori'
import type { FontOptions, ModuleOptions, ReactNode } from '../types'

export interface CreateOgImageArgs {
  title: string;
  description: string;
  section?: string;
  publishedTime?: string;
  fonts: FontOptions[];
  avatar: string;
  options: ModuleOptions;
}

const formatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' })

export async function createOgImage(args: CreateOgImageArgs) {
  const errorLog = console.log
  globalThis.console.error = () => null

  const options: SatoriOptions = {
    width: args.options.width,
    height: args.options.height,
    fonts: args.fonts,
  }

  const published = args.publishedTime ? parseISO(args.publishedTime) : null
  const date = published ? formatter.format(published) : null

  const element: ReactNode = {
    type: 'div',
    props: {
      style: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: 'white',
        color: 'black',
        fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"'
      },
      children: {
        type: 'div',
        props: {
          tw: 'flex flex-col justify-end w-full h-full',
          children: {
            type: 'div',
            props: {
              tw: 'flex flex-col w-full p-6 border-b-4 border-sky-600',
              children: [
                {
                  type: 'div',
                  props: {
                    tw: 'flex flex-col pr-12',
                    children: [
                      {
                        type: 'div',
                        props: {
                          tw: 'font-bold text-4xl text-gray-900 text-left mb-0',
                          children: args.title
                        }
                      },
                      {
                        type: 'div',
                        props: {
                          tw: 'text-lg text-gray-600 text-left mt-3 mb-0',
                          children: args.description
                        }
                      },
                    ]
                  }
                },
                {
                  type: 'div',
                  props: {
                    tw: 'flex items-center justify-between mt-10 w-full',
                    children: [
                      {
                        type: 'div',
                        props: {
                          tw: 'flex',
                          children: [
                            {
                              type: 'img',
                              props: {
                                src: `data:image/png;base64,${args.avatar}`,
                                width: 40,
                                height: 40,
                                tw: 'rounded-full border border-gray-200 shadow-sm'
                              }
                            },
                            {
                              type: 'div',
                              props: {
                                tw: 'ml-4 flex flex-col',
                                children: [
                                  {
                                    type: 'div',
                                    props: {
                                      tw: 'font-medium text-sm text-gray-700',
                                      children: 'Alessandro Jean'
                                    }
                                  },
                                  {
                                    type: 'div',
                                    props: {
                                      tw: 'text-xs text-gray-600',
                                      children: 'alessandrojean.github.io'
                                    }
                                  }
                                ]
                              }
                            },
                          ]
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          tw: `flex items-center ${!date && !args.section ? 'hidden' : ''}`,
                          children: [
                            {
                              type: 'div',
                              props: {
                                tw: `text-sm text-gray-600 mr-4 ${!args.section ? 'hidden' : ''}`,
                                children: `Publicado em ${date ?? ''}`
                              }
                            },
                            {
                              type: 'div',
                              props: {
                                tw: `bg-sky-100 rounded-full text-xs tracking-wide font-medium px-3 py-1 text-sky-800 ${!args.section ? 'hidden' : ''}`,
                                children: args.section ?? ''
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                },
              ]
            }
          },
        }
      } 
    }
  }

  const svg = await satori(element, options)

  globalThis.console.error = errorLog

  return svg
}