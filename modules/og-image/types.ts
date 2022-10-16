import satori from 'satori'
import type { SatoriOptions } from 'satori'

export interface ModuleOptions {
  routes: string[];
  dir: string;
  avatar: string;
  width: number;
  height: number;
}

export type FontOptions = SatoriOptions['fonts'][number]
export type FontWeight = SatoriOptions['fonts'][number]['weight']
export type ReactNode = Parameters<typeof satori>[0]
