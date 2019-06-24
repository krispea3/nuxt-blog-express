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
    onSave (formData) {
      this.$store.dispatch('addPost', formData)
      // The addPost action returns the axios promise. So we will enter .then when axios wrote the data to firebase
        .then(() => {
          if (!this.error) {
           this.$router.push('/admin')
          }
        })
    }
  },
  middleware: ['check-auth', 'auth']
}
</script>
