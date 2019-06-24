<template>
  <b-row align-h="center">
    <b-col col sm="12" md="10">
      <PostDetail :post="loadedPost" :isAdmin="false" :isPreview="false" />
    </b-col>
  </b-row>
</template>

<script>
import PostDetail from '~/components/posts/PostDetail'
// No need import anymore. It is defined in nuxt.config modules
// import axios from 'axios'

export default {
  // created () {
  //   this.$store.dispatch('setPost', this.$route.params.id)
  // },
  asyncData (context) {
    return (
      context.app.$axios.$get('/post/' + context.params.id + '.json')
        .then(data => {
          return {
            loadedPost: data
          }
        })
        .catch(err => {
          return context.error(err)
        })
    )
  },
  components: {
    PostDetail
  },
  // Here we overwrite the head in nuxt.config.js. Only works in route pages
  head: {title: 'Blog Post detail'}
}
</script>
