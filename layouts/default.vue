<template>
  <b-container>
    <Header />
    <nuxt />
  </b-container>
</template>

<script>
import Header from '~/components/header/Header'

export default {
  components: {
    Header
  },
}
</script>
