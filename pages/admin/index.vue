<template>
  <div>
    <PostList :isAdmin="true" />
    <b-row no-gutters>
      <b-button @click="addPost" class="mt-3" variant="success">Add post</b-button>
    </b-row>
  </div>
</template>

<script>
// no need import anymore as it is defined in plugins
// import PostList from '~/components/posts/PostList'

export default {
  data () {
    return {
      isAdmin: true
    }
  },
  // No need to declare the component as it is defined in plugins
  // components: {
  //   PostList
  // },
  methods: {
    addPost () {
      this.$router.push('admin/newPost')
    }
  },
  middleware: ['check-auth', 'auth']
}
</script>
