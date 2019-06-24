export default function (context) {
  if (!context.store.getters.isLoggedIn) {
    context.redirect('/auth?isLogin=true')
  }
}
