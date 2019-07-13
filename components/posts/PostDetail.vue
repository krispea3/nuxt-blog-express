<template>
  <div>
    <!-- Card view -->
    <b-card v-if="!isPreview | viewType === 'card'"
      class="text-center flex-fill mb-2 mr-1" 
      :class="{draft: post.draft}"
      :img-src="post.img_url"
      img-top
      :alt="post.imgalt"
      :title="post.title"
      :sub-title="post.description"
    >
      <b-card-text v-if="!isPreview">
        {{ post.content }}
      </b-card-text>

      <div slot="footer">
        <small class="text-muted">{{post.updated ?post.updated :post.created | date }} by {{ post.firstname + ' ' + post.surname }}</small>
      </div>

      <b-button v-if="!isPreview"
        @click="goBack" 
        variant="primary">
          Return
      </b-button>
      <b-button v-if="isPreview"
        @click="postDetail(post._id)" 
        variant="primary"
        class="mr-1"
        size="sm">
          View
        <b-spinner v-if="isLoading.includes(post._id)" small></b-spinner>
      </b-button>
      <b-button v-if="isAdmin & viewType === 'card'"
        @click="postEdit(post._id)" 
        variant="success"
        size="sm">
          Edit
        <b-spinner v-if="isLoading.includes(post.id)" small></b-spinner>
      </b-button>
      <b-button v-if="isAdmin & viewType === 'card'"
        @click="postDelete(post._id)" 
        variant="danger"
        class="mr-1 ml-1"
        size="sm">
          Delete
        <b-spinner v-if="isLoading.includes(post.id & 'delete')" small></b-spinner>
      </b-button>
    </b-card>

    <!-- List view-->
    <b-card v-if="isPreview & viewType === 'list' " 
      no-body 
      class="overflow-hidden" 
    >
      <b-row align-v="center">
        <b-col md="2">
          <b-card-img 
            :src="post.img_url" 
            class="rounded-0"
          >
          </b-card-img>
        </b-col>
        <b-col md="7">
          <b-card-body :title="post.title">
            <b-card-text>
              {{ post.description }}
            </b-card-text>
              <div slot="footer">
                <small class="text-muted">Updated on {{post.updated ?post.updated :post.created | date }} by {{ post.firstname + ' ' + post.surname }}</small>
              </div>
          </b-card-body>
        </b-col>
        <b-col  
          md="3"
          align-self="center"
        >
          <span class="float-right">
            <b-button
              @click="postDetail(post._id)" 
              variant="primary"
              class="mr-1"
              size="sm">
                View
              <b-spinner v-if="isLoading.includes(post._id)" small></b-spinner>
            </b-button>
            <b-button v-if="isAdmin"
              @click="postEdit(post._id)" 
              variant="success"
              size="sm">
                Edit
              <b-spinner v-if="isLoading.includes(post.id)" small></b-spinner>
            </b-button>
            <b-button v-if="isAdmin"
              @click="postDelete(post._id)" 
              variant="danger"
              class="mr-1 ml-1"
              size="sm">
                Delete
              <b-spinner v-if="isLoading.includes(post.id & 'delete')" small></b-spinner>
            </b-button>
          </span>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isLoading: [],
    }
  },
  props: {
    post: Object,
    isAdmin: {
      type: Boolean,
      required: true
    },
    isPreview: {
      type: Boolean,
      required: false
    }
  },
  computed: {
    viewType () {
      return this.$store.getters.postsView
    },
    // imgUrl () {
    //   if (this.post.img_name) {
    //     return process.env.baseURL +'/api/image/' + this.post.img_name
    //   } else {
    //     return ''
    //   }
    // },
    // imgThumb () {
    //   if (this.post.img_name) {
    //     return process.env.baseURL +'/api/thumbnail/' + this.post.img_name
    //   } else {
    //     return ''
    //   }
    // },
    // img432 () {
    //   if (this.post.img_name) {
    //     return process.env.baseURL +'/api/img432/' + this.post.img_name
    //   } else {
    //     return ''
    //   }

    // }
  },
  methods: {
    postDetail (id) {
      this.isLoading.push(id)
      this.$router.push('posts/' + id)
    },
    postEdit (id) {
      this.isLoading.push(id)
      this.$router.push('admin/' + id)
    },
    postDelete (id) {
      const isDelete = confirm('Permanently delete post "' + this.post.title + '"?')
      if (isDelete) {
        this.isLoading.push(id, 'delete')
        const payload = {id: id, image: this.post.img_name}
        this.$store.dispatch('deletePost', payload)
      }
    },
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
  .lineBreak {
    white-space: pre-wrap;
  }
  .draft {
    font-style: italic;
    font-weight: lighter;
  }
</style>
