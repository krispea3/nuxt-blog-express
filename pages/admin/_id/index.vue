<template>
  <PostForm 
    @onSave="onSave"
    @onDelete="onDelete"
    :post="loadedPost"
    :error="error" />
</template>

<script>
import PostForm from '~/components/posts/PostForm'
// No need import anymore. It is defined in nuxt.config modules
// import axios from 'axios'

export default {
  asyncData (context) {
    return (
      context.app.$axios.$get('http://localhost:3000/api/post/' + context.params.id)
        .then(data => {
          return {
            loadedPost: data.post
          }
        })
        .catch(err => {
          return console.log(err)
        })
    )
    // return (
    //   context.app.$axios.$get('/post/' + context.params.id + '.json')
    //     .then(data => {
    //       return {
    //         loadedPost: data
    //       }
    //     })
    //     .catch(err => context.error(err))
    // )
  },
  computed: {
    error () {
      return this.$store.getters.error
    }
  },
  components: {
    PostForm
  },
  methods: {
    onSave (formData) {
      formData._id = +this.$route.params.id
      this.$store.dispatch('updatePost', formData)
      // The updatePost action returns the axios promise. So we will enter .then when axios wrote the data to firebase
        .then(() => {
          this.$store.dispatch('isLoading', null)
          if (!this.error) {
           this.$router.push('/admin')
          }
        })
    },
    onDelete () {
      this.$store.dispatch('deletePost', +this.$route.params.id)
        .then(() => {
          this.$store.dispatch('isLoading', null)
          this.$router.push('/admin')
        })
    }
  },
  middleware: ['check-auth', 'auth']
}
</script>

