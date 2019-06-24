<template>
  <div>
    <LoginForm v-if="$route.query.isLogin"
      @login="login" />
    <RegisterForm v-if="$route.query.isRegister" 
      @register="register" />
  </div>
</template>

<script>
import LoginForm from '~/components/auth/LoginForm'
import RegisterForm from '~/components/auth/RegisterForm'

export default {
  components: {
    LoginForm,
    RegisterForm
  },
  computed: {
    error () {
      return this.$store.getters.error
    }
  },
  methods: {
    login (form) {
      this.$store.dispatch('login', form)
        .then( () => {
          this.$store.dispatch('isLoading', false)
          if (!this.error) {
            this.$router.push('/admin')
          }
        })
    },
    register (form) {
      this.$store.dispatch('register', form)
        .then( () => {
          this.$store.dispatch('isLoading', false)
          if (!this.error) {
            this.$router.push('/admin')
          }
        })
    },
  }
}
</script>
