var FormData = require('form-data')

export const state = () => ({
  posts: [],
  user: {},
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
    const index = state.posts.findIndex(i => i.id === id)
    state.posts.splice(index, 1)
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
            const token = context.app.$cookies.get('token')
            const userid = context.app.$cookies.get('user')
            const expirationDate = context.app.$cookies.get('expirationDate')
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
    // return (
      // Fetching posts
      // context.app.$axios.$get('/post.json')
      //   .then(data => {
      //     const posts = []
      //     for (const key in data) {
      //       posts.push({...data[key], id: key})
      //     }
      //     vuexContext.commit('loadPosts', posts)
      // Fetching user if cookie token available
        //   if (context.req.headers.cookie) {
        //     const token = context.app.$cookies.get('token')
        //     const userEmail = context.app.$cookies.get('user')
        //     const expirationDate = context.app.$cookies.get('expirationDate')
        //     let user = {}
        //     return context.app.$axios.$get('/users.json')
        //       .then(data => {
        //         for (let key in data) {
        //           if (data[key].email === userEmail) {
        //             user = data[key]
        //             user.id = key
        //             user.idToken = token
        //             vuexContext.commit('loadUser', user)
        //             vuexContext.commit('setError', '')
        //             break
        //           }
        //         }    
        //       })
        //       .catch(err => {
        //         vuexContext.commit('setError', 'Could not Autologin. Refresh the page or Login again')
        //         return context.error(err)
        //       })
        //   } else {
        //       return
        //     }
        // })
        // .catch(err => {
        //   return context.error(err)
        // })         
      // )
  },
  addPost ({ commit, state }, formData) {
    let form = new FormData();
    form.append('title', formData.title)
    form.append('description', formData.description)
    form.append('content', formData.content)
    form.append('imgurl', formData.imgurl)
    form.append('img', formData.img)
    form.append('imgalt', formData.imgalt)
    form.append('draft', formData.draft)
    form.append('published', formData.published)
    form.append('userid', formData.userid)
    form.append('created', formData.created)
    return (
      this.$axios.$post('/api/post', form)
        .then((data) => {
          console.log('post data', data)
          formData._id = data.postid
          commit('setError', '')
          commit('addPostToPosts', formData)
        })
        .catch(err => {
          // commit('setError', 'Post not added. Please try again later')
          commit('setError', err.response.data.error.message)
          console.log('post err', err.response.data.error.message)
          console.error(err.response)
        })
      // this.$axios.$post('/post.json' + '?auth=' + state.user.idToken, formData)
      //   .then(data => {
      //     commit('setError', '')
      //     commit('addPostToPosts', {formData: formData, id: data.name})
      //   })
      //   .catch(err => {
      //     commit('setError', 'Cannot add post. Try again later')
      //   })
    )
  },
  updatePost ({ commit, state }, post) {
    post.updated = new Date().toISOString()
    return (
      this.$axios.$put('/api/post/' + post._id, post)
        .then(() => {
          commit('setError', '')
          commit('updatePostInPosts', post)
        })
        .catch(err => {
          commit('setError', 'Cannot update post. Please try again later')
          return console.log(err)
        })
    )
  },

  deletePost ({ commit, state }, id) {
    return (
      this.$axios.$delete('/api/post/' + id)
        .then(() => {
          commit('setError', '')
          commit('deletePostInPosts', id)
        })
        .catch(err => {
          commit('setError', 'Error deleting the post. Try again later')
          console.log(err)
        })
    )
    // return (
    //   this.$axios.$delete('/post/' + id + '.json' + '?auth=' + state.user.idToken)
    //     .then(data => {
    //       commit('setError', '')
    //       commit('deletePostInPosts', id)
    //     })
    //     .catch(err => {
    //       commit('setError', 'Error deleting the post. Try again later')
    //     })
    // )
  },
  register ({ commit, dispatch }, formData) {
    // Write user in postgres database
    return (
      this.$axios.$post('/api/user', formData)
        .then(data => {
          // Write cookies
          const now = new Date()
          const expirationDate = new Date(now.getTime() + data.expiresIn * 1000)
          // Set cookies. Token returned from addUser api
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
          console.log(err.response.data)
        })
    )
    // return (
    //   this.$axios.$post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' + process.env.FB_API_KEY, {
    //     email: formData.email, 
    //     password: formData.password, 
    //     returnSecureToken: true
    //   })
    //     .then( data => {
    //       // Write cookies
    //       const now = new Date()
    //       const expirationDate = new Date(now.getTime() + data.expiresIn * 1000)
    //       this.$cookies.set('token', data.idToken, {
    //         path: '/',
    //         expires: expirationDate
    //       })
    //       this.$cookies.set('user', formData.email, {
    //         path: '/',
    //         expires: expirationDate
    //       })
    //       this.$cookies.set('expirationDate', expirationDate, {
    //         path: '/',
    //         expires: expirationDate
    //       })
    //       // Write user record to firebase database
    //       const userData = formData
    //       delete userData['password']
    //       this.$axios.$post('/users.json' + '?auth=' + data.idToken, userData)
    //         .then(data => {
    //         })
    //         .catch(err => console.log(err))
    //       const user = {
    //         firstname: formData.firstname,
    //         surname: formData.surname,
    //         email: formData.email,
    //         idToken: data.idToken
    //       }
    //       commit('setError', '') 
    //       commit('login', user)
    //       dispatch('setAutologout', data.expiresIn * 1000)
    //       // Example how we could write our own express-server DB
    //       // Write data to our Express server api track-data
    //       return (
    //         this.$axios.post('/api/track-data', {data: formData.email})
    //           .then(res => {
    //             console.log(res)
    //             if (res.status < 400) {
    //               console.log('Success')
    //             } else {
    //               console.log('Something went wrong')
    //             }
    //           })
    //           .catch(err => console.log(err))
    //   )
    //     })
    //     .catch(err => {
    //       commit('setError', 'Cannot login the user, try again later')
    //     })
    // )
  },
  login ({ commit, dispatch }, formData) {
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
    // return (
    //   this.$axios.$post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' + process.env.FB_API_KEY, {
    //     email: formData.email, 
    //     password: formData.password, 
    //     returnSecureToken: true
    //   })
    //     .then( data => {
    //       // Set cookies
    //       const now = new Date()
    //       const expirationDate = new Date(now.getTime() + data.expiresIn * 1000)
    //       this.$cookies.set('token', data.idToken, {
    //         path: '/',
    //         expires: expirationDate
    //       })
    //       this.$cookies.set('user', formData.email, {
    //         path: '/',
    //         expires: expirationDate
    //       })
    //       this.$cookies.set('expirationDate', expirationDate, {
    //         path: '/',
    //         expires: expirationDate
    //       })
    //       commit('setError', '')
    //       // Read user data on firebase
    //       const wrkIdToken = data.idToken
    //       const wrkExpiresIn = data.expiresIn
    //       let user = {}
    //       return (
    //         this.$axios.$get('/users.json?orderBy="email"&equalTo="' + formData.email + '"')
    //           .then(data => {
    //             const id = Object.keys(data)
    //             user = data[id]
    //             user.id = id[0]
    //             user.idToken = wrkIdToken
    //             commit('login', user)
    //             commit('setError', '')
    //             dispatch('setAutologout', wrkExpiresIn * 1000)
    //             // Example how we could write our own express-server DB
    //             // Write data to our Express server API track-data
    //             return (
    //               this.$axios.post('/api/track-data', {data: formData.email})
    //                 .then(res => {
    //                   console.log(res)
    //                   if (res.status < 400) {
    //                     console.log('Success')
    //                   } else {
    //                     console.log('Something went wrong')
    //                   }
    //                 })
    //                 .catch(err => console.log(err))
    //             )
    //           })
    //           .catch(err => console.log(err))
    //       )
    //     })
    //     .catch(err => {
    //       commit('setError', 'Invalid email or password')
    //     })
    // )
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
          commit('setError', 'Could not update the user. Please try again later')
          console.error(err)
          console.log(err)
        })
    )
    // let user = {...form}
    // delete user['id']
    // delete user['idToken']
    // return (
    //   this.$axios.$put('/users/' + form.id + '.json' + '?auth=' + form.idToken, user)
    //     .then(data => {
    //       commit('setError', '')
    //       commit('updateUser', form)
    //     })
    //     .catch(err => {
    //       commit('setError', 'Could not update the user. Please try again later')
    //     })
    // )
  },
  logout (context) {
    // Remove cookies
    // this.$cookies.removeAll() //works only on root-path '/'
    this.$cookies.remove('token', {path: '/'})
    this.$cookies.remove('user', {path: '/'})
    this.$cookies.remove('expirationDate', {path: '/'})    
    context.commit('logout')
    this.$router.push('/auth?isLogin="true"')
  },
  setAutologout (context, duration) {
    setTimeout(()=>{
      context.dispatch('logout')
      alert("Your session has expired! Login again")  
    }, duration)
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
