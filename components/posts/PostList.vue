<template>
  <div>
    <!-- Display posts as cards -->
    <div v-if="selectedDisplayType === 'card'">
      <b-row class="mb-3" no-gutters align-h="center">
        <b-col cols="12">
          <Header
            :selected="displayType"
            @displayType="setDisplayType" />
      </b-col>
      </b-row>
      <b-row no-gutters align-h="center">
        <b-card-group deck>
        <div  v-for="post in filteredPosts" :key="post._id">
          <PostDetail
            :isPreview="true" 
            :isAdmin="isAdmin" 
            :post="post">
          </PostDetail>
        </div>
        </b-card-group>
      </b-row>
    </div>
    
    <!-- Display posts as list -->
    <div v-if="selectedDisplayType === 'list'">
      <b-row class="mb-3" no-gutters align-h="center">
        <b-col cols="10">
          <Header
            :selected="displayType"
            @displayType="setDisplayType"/>
        </b-col>
      </b-row>
      <div  v-for="post in filteredPosts" :key="post._id">
        <b-row no-gutters align-h="center">
          <b-col cols="10">
          <PostDetail
            :isPreview="true" 
            :isAdmin="isAdmin" 
            :post="post">
          </PostDetail>
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script>
import PostDetail from './PostDetail'
import Search from '~/components/Search'
import Header from '~/components/posts/Header'

export default {
  // This vue lifecycle hook executes on the client
  created () {
    this.posts = this.$store.getters.posts
  },
  data () {
    return {
      posts: [],
      displayType: 'card'
    }
  },
  computed: {
    filteredPosts () {
      const search = this.$store.getters.searchString
      const userId = this.$store.getters.user._id
      // Display non-draft/non-published posts when no search and not Admin page
      if (search === '' & !this.isAdmin) {
        const noDraft = this.posts.filter(el => {
          return el.draft === false & el.published === true
        })
        return noDraft
      }
      // Display only posts from logged in User in admin section
      let filteredPosts = []
      if (this.isAdmin) {
        filteredPosts = this.posts.filter(e => {
          return e.userid == userId
        })
      } else {
        filteredPosts = this.posts
      }
      // Finally filter by search string
      let displayPosts = []
      if (search != '') {
        displayPosts = filteredPosts.filter(e => e.title.toUpperCase().includes(search.toUpperCase()))
      } else {
        displayPosts = filteredPosts
      }
      return displayPosts
    },
    
    selectedDisplayType () {
      return this.displayType
    }
  },
  components: {
    PostDetail,
    Search,
    Header
  },
  props: {
    isAdmin: {
      type: Boolean,
      required: true
    },
  },
  methods: {
    setDisplayType (type) {
      this.displayType = type
    }
  }
}
</script>
