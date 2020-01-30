import Vue from 'vue'
import { firebaseDb } from '../../config/config.js'

const state = {
  comments: {}
}
const mutations = {
  removeComment (state, payload) {
    Vue.delete(state.comments[payload.postId], payload.commentId)
  },
  clearComments (state, payload) {
    state.comments = {}
  },
  addComment (state, payload) {
    const { commentData, commentId, postId } = payload
    if (!state.comments[postId]) {
      Vue.set(state.comments, postId, { [commentId]: commentData })
    } else {
      Vue.set(state.comments[postId], commentId, commentData)
    }
  }
}
const actions = {
  firebaseGetComments ({ commit }, postId) {
    const commentsRef = firebaseDb.ref('posts/' + postId + '/comments')
    commentsRef.on('child_added', snapshot => {
      const commentData = snapshot.val()
      const commentId = snapshot.key
      commit('addComment', {
        postId,
        commentData,
        commentId
      })
    })
    commentsRef.on('child_removed', snapshot => {
      const commentId = snapshot.key
      commit('removeComment', {
        commentId,
        postId
      })
    })
  },
  firebaseStopGettingComments ({ commit }, postId) {
    const commentsRef = firebaseDb.ref('posts/' + postId + '/comments')
    commentsRef.off('child_added')
    commit('clearComments')
  },
  firebaseSendComment ({ commit }, payload) {
    const commentRef = firebaseDb.ref(
      'posts/' + payload.comment.postId + '/comments'
    )
    console.log(payload.comment)
    commentRef.push(payload.comment)
  },
  firebaseDeleteComment ({ commit }, payload) {
    const { postId, id } = payload
    const commentRef = firebaseDb.ref('posts/' + postId + '/comments/' + id)
    commentRef.remove()
  },
  firebaseEditComment ({ commit }, payload) {
    const { postId, id, text } = payload
    const commentRef = firebaseDb.ref('posts/' + postId + '/comments/' + id)
    commentRef.update({ text })
  }
}
const getters = {
  myComments: state => state.comments,
  commentsCount: state => id => {
    if (!state.comments[id]) {
      return 0
    } else {
      return Object.keys(state.comments[id]).length
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
