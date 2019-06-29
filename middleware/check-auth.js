export default function(context) {
  const token = context.app.$cookies.get('token', {path: '/'})
  const expirationDate = context.app.$cookies.get('expirationDate')
  const now = new Date().toISOString()

  function parseISO(s) {
    s = s.split(/\D/);
    return new Date(Date.UTC(s[0],--s[1],s[2],s[3],s[4],s[5],s[6]));
  }

  // Logout if no token or token expired
  if (!token || parseISO(now) > parseISO(expirationDate)) {
    context.store.commit('logout')
  }
}