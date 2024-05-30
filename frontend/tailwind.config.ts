import type { Config } from "tailwindcss"
import colors from "tailwindcss/colors"

export default <Partial<Config>> {
  theme: {
    screens: {
      xs: '320px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      "2xl": '1536px'
    },
    extend: {
      colors: {
        primary: colors.blue
      }
    }
  }
}