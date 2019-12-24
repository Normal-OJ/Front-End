const manifestPlugin = require('pwa-manifest-webpack-plugin')
const path = require('path')

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    disableHostCheck: true
  },
  configureWebpack: {
    plugins: [
      new manifestPlugin({
        name: 'NOJ',
        short_name: 'NOJ',
        description: 'a normal online judge system.',
        display: 'standalone',
        start_url: '/',
        orientation: 'portrait-primary',
        icon: {
          src: path.resolve('public/NOJ.png'),
          sizes: [200]
        },
        background_color: '#003865',
        theme_color: '#003865'
      })
    ]
  }
}