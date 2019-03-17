declare module '*.scss' {
  interface Module {
    [className: string]: string
  }

  const styleObj: Module

  export = styleObj
}
