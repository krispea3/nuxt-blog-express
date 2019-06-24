<template>
  <b-form>
    <label for="form-input-search">
    </label>
    <b-input
      id="form-input-search"
      class="mb-2 mr-sm-2 mb-sm-0"
      placeholder="Search"
      v-model="search"
    >
    </b-input>
  </b-form>
</template>

<script>
export default {
  computed: {
    search: {
      get () {
        return this.$store.getters.searchString
      },
      set (search) {
        this.$store.dispatch('setSearchString', search)
      }
    }
  }
}
</script>
