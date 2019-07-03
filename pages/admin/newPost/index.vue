<template>
  <PostForm @onSave="onSave" :error="error" />
</template>

<script>
import PostForm from '~/components/posts/PostForm'

export default {
  components: {
    PostForm
  },
  computed: {
    error () {
      return this.$store.getters.error
    }
  },
  methods: {
    onSave (payload) {
      this.$store.dispatch('addPost', payload)
      // The addPost action returns the axios promise. So we will enter .then when axios wrote the data to firebase
        .then(() => {
          this.$store.dispatch('isLoading', null)
          if (!this.error) {
           this.$router.push('/admin')
          }
        })
    }
  },
  middleware: ['check-auth', 'auth']
}
</script>
