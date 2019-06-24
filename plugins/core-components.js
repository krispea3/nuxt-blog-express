// Here we can import components that are used often
// We need to then add this file in the plugins array in nuxt.config
// This will make these components available globaly without the need 
// to import them and register them in each component we use them 

import Vue from 'vue'
import PostList from '../components/posts/PostList.vue'

Vue.component('PostList', PostList)