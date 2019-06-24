<template>
  <div>
    <b-row align-h="center">
      <b-col>
        <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>
        <b-jumbotron 
            header="Get the latest Tech-News!" 
            lead="All about programming, frameworks and lot more" 
            align="center"
            class="bg-image">
          <p>To get all the articles, register now! Or login if you are already a member</p>
          <b-button 
            @click="login" 
            variant="success"
            :disabled="isLoggedIn">
              Login
          </b-button>
          <b-button 
            @click="register" 
            class="ml-3" 
            variant="primary"
            :disabled="isLoggedIn">
              Register
          </b-button>
        </b-jumbotron>
      </b-col>
    </b-row>
    <PostList :isAdmin="isAdmin" />
  </div>  
</template>

<script>
// no need import anymore as it is defined in plugins
// import PostList from '~/components/posts/PostList'

export default {
  data () {
    return {
      isAdmin: false
    }
  },
  computed: {
    error () {
      return this.$store.getters.error
    },
    isLoggedIn () {
      return this.$store.getters.isLoggedIn
    }
  },
  methods: {
    login () {
      this.$router.push('/auth?isLogin=true')
    },
    register () {
      this.$router.push('/auth?isRegister=true')
    }
  }
  // No need to declare the component as it is defined in plugins
  // components: {
  //   PostList
  // }
}
</script>

<style scoped>
  .bg-image {
    background-image: url('../assets/images/jumbotron.jpg');
    color: white;
  }
  .jumbotron {
    margin-bottom: -10px;
  }
</style>

