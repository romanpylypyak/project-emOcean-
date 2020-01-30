import { getLikedList } from '@/services/posts'

const getDefaultState = () => {
  return {
    list: []
  }
}

export default {
  actions: {
    clear ({ commit }) {
      commit('clear')
    },
    async getLikedList (ctx, videoId) {
      getLikedList(videoId)
        .then((response) => {
          ctx.commit('updateLikedList', response.data.result)
        })
        .catch(error => {
          return error.statusText
        })
    }
  },

  mutations: {
    clear (state) {
      Object.assign(state, getDefaultState())
    },
    updateLikedList (state, list) {
      state.list = list
    }
  },

  state: getDefaultState(),

  getters: {
    getLikes (state) {
      return state.list
    }
  }
}
