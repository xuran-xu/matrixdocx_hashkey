declare module 'daisyui' {
  import { Config } from 'tailwindcss'
  const plugin: Config['plugins'][number]
  export default plugin
}
