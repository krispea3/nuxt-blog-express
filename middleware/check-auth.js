import { networkInterfaces } from "os";

export default function(context) {
  const token = context.app.$cookies.get('token', {path: '/'})
  if (context.store.getters.user.idToken) {
    if (!token) {
      context.store.commit('logout')
    }
  }
}