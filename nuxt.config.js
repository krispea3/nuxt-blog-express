const bodyParser = require('body-parser')

module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: 'Tech-Blog',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      // Google fonts Open Sans
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css?family=Open+Sans&display=swap"},
      // Google materia-design icons
      { rel: "stylesheet", href: "https://fonts.googleapis.com/icon?family=Material+Icons"},
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    './assets/styles/main.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~plugins/core-components.js',
    '~plugins/date-filter.js',
    '~plugins/Vuelidate.js'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/microcipcip/cookie-universal/tree/master/packages/cookie-universal-nuxt
    'cookie-universal-nuxt'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL: process.env.BASE_URL || 'https://nuxt-blog-9be94.firebaseio.com',
    credentials: false
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  },

  env: {
    FB_API_KEY: 'AIzaSyC7ItGWr8uZpRAHrGC8_qztVg8QxMulzZE',
    DATABASE_URL: 'postgres://localhost:5432/blog'
  },

  router: {
    middleware: 'clearErrorMsg'
  },

  pageTransition: {
    name: 'fade',
    mode: 'out-in'
  },

  serverMiddleware: [
    // will parse the req.body in node Express
    bodyParser.json(),
    // Path to the server. Will look for index.js in this path
    '~/server/api'
  ]

}
