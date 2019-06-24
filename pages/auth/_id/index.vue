<template>
  <RegisterForm
    @updateUser="updateUser"
    :user="loadedUser" />
</template>

<script>
import RegisterForm from '~/components/auth/RegisterForm'

export default {
  components: {
    RegisterForm
  },
  computed: {
    loadedUser () {
      return this.$store.getters.user
    }
  },
  methods: {
    updateUser (form) {
      this.$store.dispatch('updateUser', form)
        .then(() => {
          this.$store.dispatch('isLoading', false)
          if (!this.$store.getters.error) {
            this.$router.push('/')
          }
        })
    }
  },
  middleware: ['check-auth', 'auth']
}
</script>
