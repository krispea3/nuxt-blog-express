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
        <div  v-for="post in filteredPosts" :key="post.id">
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
      <div  v-for="post in filteredPosts" :key="post.id">
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
      if (search === '') {
        return this.posts
      } else {
        return this.posts.filter(e => e.title.toUpperCase().includes(search.toUpperCase()))
      }
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
