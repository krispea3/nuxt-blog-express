// Middleware are executed before the loading of a route (page)
// It's executed on the server for the first load. After that it's executed locally

// Middleware can be executed on:
// - layouts
// - pages (see pages/posts/index.vue)
// - nuxt.config.js (under router object)

export default function (context) {
  // For asynchronous tasks we need to return the task
  // For synchronous tasks no need to return anything
  console.log('[Middleware] The log middleware is running!')
}