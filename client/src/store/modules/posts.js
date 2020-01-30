import {
  getPostsByType,
  savePost,
  getUserPostsById,
  getUserLikedPostsById
} from '@/services/posts'

const getDefaultState = () => {
  return {
    posts: [],
    index: 'Last index',
    errors: [],
    userPosts: [],
    userLikedPosts: [],
    loading: false
  }
}

const state = getDefaultState()

const mutations = {
  clear (state) {
    Object.assign(state, getDefaultState())
  },
  addPost (state, payload) {
    state.posts = [payload.post, ...state.posts]
  },
  updateErrors (state, payload) {
    state.errors = [...state.errors, payload]
  },
  setPosts (state, payload) {
    state.posts = state.posts.concat(...payload)
  },
  setIndex (state, payload) {
    state.index = payload
  },
  clearPosts (state) {
    state.posts = []
  },
  clearUserPosts (state) {
    state.userPosts = []
  },
  setLoading (state, payload) {
    state.loading = payload
  },
  setUserPosts (state, payload) {
    state.userPosts = payload
  },
  setUserLikedPosts (state, payload) {
    state.userLikedPosts = payload
  },
  dislikePost (state, postId) {
    const userId = localStorage.getItem('profileId')
    return state.posts.forEach(function (value) {
      if (value.postId === postId) {
        value.likes.filter(function (elem) {
          return elem !== userId
        })
        value.likesCount--
      }
    })
  },
  likePost (state, postId) {
    const userId = localStorage.getItem('profileId')
    return state.posts.forEach(function (value) {
      if (value.postId === postId) {
        value.likes.push(userId)
        value.likesCount++
      }
    })
  }
}

const actions = {
  clear ({ commit }) {
    commit('clear')
  },
  async getUserPostsAction ({ commit }, payload) {
    commit('setLoading', true)
    commit('clearUserPosts')
    getUserPostsById(payload)
      .then(res => {
        commit('setLoading', false)
        commit('setUserPosts', res.data.result)
      })
      .catch(err => {
        commit('updateErrors', err.response.data)
        commit('clearUserPosts')
        commit('setLoading', false)
      })
  },
  async getUserLikedPostsAction ({ commit }, payload) {
    commit('setLoading', true)
    commit('clearUserPosts')
    getUserLikedPostsById(payload)
      .then(res => {
        commit('setLoading', false)
        commit('setUserLikedPosts', res.data.result)
      })
      .catch(err => {
        commit('updateErrors', err.response.data)
        commit('clearUserPosts')
        commit('setLoading', false)
      })
  },
  clearPostsAction ({ commit }) {
    commit('clearPosts')
  },
  clearUserPostsAction ({ commit }) {
    commit('clearUserPosts')
  },
  dislikePost ({ commit }, postId) {
    commit('dislikePost', postId)
  },
  likePost ({ commit }, postId) {
    commit('likePost', postId)
  },
  async addPostAction ({ commit }, payload) {
    try {
      commit('setLoading', true)
      await savePost(payload)
      commit('setLoading', false)
    } catch (err) {
      commit('updateErrors', err.response.data)
      commit('setLoading', false)
    }
  },
  async getPostsAction ({ commit }, payload) {
    try {
      commit('setLoading', true)
      if (!payload.index) {
        commit('clearPosts')
        commit('setIndex', 'Last index')
      }
      const response = await getPostsByType(payload)
      commit('setPosts', response.data.result.data)
      commit('setIndex', response.data.result.lastIndex)
      commit('setLoading', false)
    } catch (error) {
      console.log(error)
      if (error.response.data.error === 'No more posts left') {
        commit('setIndex', 'Last index')
      }
      commit('updateErrors', error.response.data)
      commit('setLoading', false)
    }
  }
}

const getters = {
  postsGetter: state => {
    return state.posts
  },
  paginationIndexGetter: state => {
    return state.index
  },
  errorsGetter: state => {
    return state.errors
  },
  loadingGetter: state => {
    return state.loading
  },
  userPostsGetter: state => {
    return state.userPosts
  },
  userLikedPostsGetter: state => {
    return state.userLikedPosts
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
