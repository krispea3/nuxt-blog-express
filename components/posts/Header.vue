<template>
  <div>
    <b-row align-h="between" no-gutters>
      <b-col cols="6">
        <Search />
      </b-col>
      <b-row align-v="end" align-h="start" no-gutters>
        <b-col class="d-none d-md-block">
          <i v-if="selected !=='list'"
            id="list" 
            class="material-icons"
            :class="{selected: selected==='list'}"
            @click="setDisplayType('list')">
              view_list
          </i>
          <i v-if="selected !=='card'"
            id="card" 
            class="material-icons"
            :class="{selected: selected==='card'}"
            @click="setDisplayType('card')">
              view_module
          </i>
        </b-col>
      </b-row>
    </b-row>
  </div>
</template>

<script>
import Search from '~/components/Search'

export default {
  computed: {
    selected () {
      return this.$store.getters.postsView
    }
  },
  // props: {
  //   selected: ''
  // },
  components: {
    Search
  },
  methods: {
    setDisplayType (type) {
      this.$store.dispatch('setPostsView', type)
    }
    // displayType (type) {
    //   this.$emit('displayType', type)
    // }
  }
}
</script>
