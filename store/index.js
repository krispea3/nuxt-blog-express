var FormData = require('form-data')

export const state = () => ({
  posts: [],
  user: {},
  postsView: 'list', //'list' or 'card'
  error: '',
  isLoading: [],
  searchString: ''
})

export const mutations = {
  loadPosts (state, posts) {
    state.posts = posts
  },
  addPostToPosts (state, post) {
    state.posts.push(post)
  },
  updatePostInPosts (state, post) {
    const index = state.posts.findIndex(i => i._id === post._id)
    state.posts[index] = post
  },
  updatePostAuthor (state, user) {
    state.posts.forEach(e => {
      if (e.userid === user._id) {
        e.firstname = user.firstname
        e.surname = user.surname
      }
    })
  },
  deletePostInPosts (state, id) {
    const index = state.posts.findIndex(i => i._id === id)
    state.posts.splice(index, 1)
  },
  setPostsView (state, viewType) {
    state.postsView = viewType
  },
  login (state, user) {
    state.user = user
  },
  logout (state) {
    state.user = {}
    state.error = ''
    state.isLoading = []
  },
  loadUser (state, user) {
    state.user = user
  },
  updateUser (state, user) {
    state.user = user
  },
  setError (state, msg) {
    state.error = msg
  },
  isLoading (state, element) {
    if (element) {
      state.isLoading.push(element)
    } else {
      state.isLoading = []
    }
  },
  setSearchString (state, searchString) {
    state.searchString = searchString
  }

}

export const actions = {
  nuxtServerInit (vuexContext, context) {
    return (
      // Fetching posts
      context.app.$axios.$get('/api/posts')
        .then(data => {
          vuexContext.commit('loadPosts', data.posts)
          // Loading user from cookies
          if (context.req.headers.cookie) {
            const userid = context.app.$cookies.get('user')
            return(
              context.app.$axios.$get('/api/user/' + userid)
                .then(data => {
                  vuexContext.commit('loadUser', data.user)
              })
              .catch(err => {
                return console.log(err)
              })
            )
          }
        })
        .catch(err => {
          return console.log(err)
        })
    ) 
  },
  addPost ({ commit }, payload) {
    const formData = payload.formData
    const img_upload = payload.img_upload
    // Using form-data module to handle mutipart file on server. We have formData and image file 
    let form = new FormData();
    form.append('title', formData.title)
    form.append('description', formData.description)
    form.append('content', formData.content)
    form.append('img_upload', img_upload)
    form.append('imgalt', formData.imgalt)
    form.append('draft', formData.draft)
    form.append('published', formData.published)
    form.append('userid', formData.userid)
    return (
      this.$axios.$post('/api/post', form)
        .then((data) => {
          formData._id = data.post.id
          formData.created = data.post.created
          formData.img_name = data.file.name
          formData.img_original_name = data.file.originalName
          commit('setError', '')
          commit('addPostToPosts', formData)
        })
        .catch(err => {
          commit('setError', err.response.data.error.message)
          console.error(err.response)
        })
    )
  },
  updatePost ({ commit, dispatch }, payload) {
    const formData = payload.formData
    const img_upload = payload.img_upload
    // Using form-data module to handle mutipart file on server. We have formData and image file 
    let form = new FormData()
    form.append('title', formData.title)
    form.append('description', formData.description)
    form.append('content', formData.content)
    form.append('img_name', formData.img_name)
    form.append('img_original_name', formData.img_original_name)
    form.append('img_upload', img_upload)
    form.append('imgalt', formData.imgalt)
    form.append('draft', formData.draft)
    form.append('published', formData.published)
    form.append('userid', formData.userid)
    form.append('updated', formData.updated)
    return (
      this.$axios.$put('/api/post/' + formData._id, form)
        .then((data) => {
          // Delete old image when image updated
          if (img_upload != null & formData.img_name != '') {
            dispatch('deleteImages', formData.img_name)
          }
          formData.updated = data.post.updated
          formData.img_name = data.file.name
          formData.img_original_name = data.file.originalName
          commit('setError', '')
          commit('updatePostInPosts', formData)
        })
        .catch(err => {
          commit('setError', err.response.data.error.message)
          return console.error(err)
        })
    )
  },
  deletePost ({ commit, dispatch }, payload) {
    if (payload.image !== '') {
      // Delete post
      return this.$axios.$delete('/api/post/' + payload.id)
      .then(() => {
        commit('setError', '')
        commit('deletePostInPosts', payload.id)
        dispatch('deleteImages', payload.image)
      })
      .catch(err => {
        commit('setError', 'Error deleting the post. Try again later')
        console.error(err)
      })
    }
  },
  deleteImages (context, imageName) {
    this.$axios.$delete('/api/image/' + imageName)
      .then(() => {
        console.log('File deleted')
      })
      .catch(err => {
        console.error(err.response)
      })
  },
  setPostsView ({ commit }, viewType) {
    commit('setPostsView', viewType)
  },
  register ({ commit }, formData) {
    // Write user in postgres database
    return (
      this.$axios.$post('/api/user', formData)
        .then(data => {
          // Set cookies. Token returned from addUser api
          const now = new Date()
          const expirationDate = new Date(now.getTime() + data.expiresIn * 1000)
          this.$cookies.set('token', data.token, {
            path: '/',
            expires: expirationDate
          })
          this.$cookies.set('user', data.userid, {
            path: '/',
            expires: expirationDate
          })
          this.$cookies.set('expirationDate', expirationDate, {
            path: '/',
            expires: expirationDate
          })

          delete formData['password']
          formData.idToken = data.token
          commit('setError', '') 
          commit('login', formData)
        })
        .catch(err => {
          commit('setError', err.response.data)
          console.error(err)
        })
    )    
  },
  login ({ commit }, formData) {
    // Login user through Postgres DB
    return (
      this.$axios.$post('/api/login', formData)
        .then(data => {
          // Set Cookies. Token returned from Login
          const now = new Date()
          const expirationDate = new Date(now.getTime() + data.expiresIn * 1000)
          this.$cookies.set('token', data.token, {
            path: '/',
            expires: expirationDate
          })
          this.$cookies.set('user', data.user._id, {
            path: '/',
            expires: expirationDate
          })
          this.$cookies.set('expirationDate', expirationDate, {
            path: '/',
            expires: expirationDate
          })
          commit('setError', "")
          commit('login', data.user)
        })
        .catch(err => {
          // Invalid email
          if (err.response.status === 500) {
            commit('setError', 'Invalid email')
          // // Invalid password
          } else if (err.response.status === 401) {
            commit('setError', 'Invalid password')
          }
        })
    )    
  },
  updateUser ({ commit }, form) {
    form.updated = new Date().toISOString()
    return (
      this.$axios.$put('/api/user', form)
        .then(() => {
          commit('setError', '')
          commit('updateUser', form)
          commit('updatePostAuthor', form)
        })
        .catch(err => {
          commit('setError', err.response.data.error.message)
          console.error(err)
        })
    )
  },
  logout (context) {
    // Remove cookies
    this.$cookies.remove('token', {path: '/'})
    this.$cookies.remove('user', {path: '/'})
    this.$cookies.remove('expirationDate', {path: '/'})    
    context.commit('logout')
    this.$router.push('/auth?isLogin="true"')
  },
  isLoading ({ commit }, element) {
    commit('isLoading', element)
  },
  setSearchString ({ commit }, searchValue) {
    commit('setSearchString', searchValue)
  }
}

export const getters = {
  posts (state) {
    return state.posts
  },
  post (state) {
    return state.post
  },
  user (state) {
    return state.user
  },
  isLoggedIn (state) {
    if (state.user.idToken) {
      return true
    } else {
      return false
    }
  },
  postsView (state) {
    return state.postsView
  },
  error (state) {
    return state.error
  },
  isLoading (state) {
    return state.isLoading
  },
  searchString (state) {
    return state.searchString
  }
}
