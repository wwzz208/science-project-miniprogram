import type { UserConfigExport } from "@tarojs/cli"

export default {

  mini: {
    debugReact: true,
  },
  h5: {
    devServer: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
} satisfies UserConfigExport<'vite'>
