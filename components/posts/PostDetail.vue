<template>
      <b-card class="mb-3 text-center" :class="{draft: post.draft}">

        <b-card-img v-if="!isPreview"
          class="mb-3"
          :src="imgUrl"
          :alt="post.imgalt"
          img-top>
        </b-card-img>

        <b-card-title
          :title="post.title">
        </b-card-title>

        <b-card-sub-title
          class="mb-2"
          :sub-title="post.description">
        </b-card-sub-title>

        <b-card-text v-if="!isPreview">
          <p class="lineBreak">{{ post.content }}</p>
        </b-card-text>

        <div class="mt-3">
        <b-button v-if="!isPreview"
          @click="goBack" 
          variant="primary">
            Return
        </b-button>

        <b-button v-if="!isAdmin & isPreview"
          @click="postDetail(post._id)" 
          variant="primary"
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
        </div>
        
        <div slot="footer">
          <small class="text-muted">Updated on {{post.updated ?post.updated :post.created | date }} by {{ post.firstname + ' ' + post.surname }}</small>
        </div>
      </b-card>
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
    imgUrl () {
      return process.env.baseURL +'/api/image/' + this.post.img_name
    }
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
