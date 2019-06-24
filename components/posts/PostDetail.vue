<template>
      <b-card class="mb-3 text-center">

        <b-card-img v-if="!isPreview"
          class="mb-3"
          :src="post.imgUrl" 
          :alt="post.imgAlt"
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
          @click="postDetail(post.id)" 
          variant="primary"
          size="sm">
            View
          <b-spinner v-if="isLoading.includes(post.id)" small></b-spinner>
        </b-button>

        <b-button v-if="isAdmin"
          @click="postEdit(post.id)" 
          variant="success"
          size="sm">
            Edit
          <b-spinner v-if="isLoading.includes(post.id)" small></b-spinner>
        </b-button>
        </div>
        
        <div slot="footer">
          <small class="text-muted">Last updated on {{ post.updated | date }} by {{ post.author }}</small>
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
</style>
