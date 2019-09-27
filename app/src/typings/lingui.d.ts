declare module '@lingui/react' {
  export * from '@lingui/react/cjs/index'
}

declare module '@lingui/core' {
  export * from '@lingui/core/cjs/index'
}

declare module '@lingui/macro' {
  import { MessageDescriptor } from '@lingui/core'

  export function t(
    literals: TemplateStringsArray,
    ...placeholders: any[]
  ): string
  export function plural(
    arg: number | string,
    options: Record<string, any>
  ): string
  export function selectOrdinal(
    arg: number | string,
    options: Record<string, any>
  ): string
  export function select(
    arg: string,
    choices: { [key: string]: string }
  ): string
  export function defineMessages<
    M extends { [key: string]: MessageDescriptor }
  >(messages: M): M
  export function defineMessage(
    descriptor: MessageDescriptor
  ): MessageDescriptor

  export const Trans
  export const Plural
  export const Select
  export const SelectOrdinal
  export const DateFormat
  export const NumberFormat
}
