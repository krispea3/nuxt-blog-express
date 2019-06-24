<template>
  <div>
    <b-row align-h="between" no-gutters>
      <b-col cols="6">
        <Search />
      </b-col>
      <b-row align-v="end" align-h="start" no-gutters>
        <b-col>
          <i
            id="list" 
            class="material-icons"
            :class="{selected: selected==='list'}"
            @click="displayType('list')">
              view_headline
          </i>
          <i
            id="card" 
            class="material-icons"
            :class="{selected: selected==='card'}"
            @click="displayType('card')">
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
  props: {
    selected: ''
  },
  components: {
    Search
  },
  methods: {
    displayType (type) {
      this.$emit('displayType', type)
    }
  }
}
</script>
