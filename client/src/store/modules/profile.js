import {
  getProfileById,
  getProfileByNickname,
  updateProfile,
  setPreferences,
  getSubscriptionsById,
  profileAction
} from '@/services/profile'

const getDefaultState = () => {
  return {
    myProfile: {},
    myProfileId: '',
    profile: {},
    profileFollowers: [],
    profileFollowings: [],
    errors: [],
    message: [],
    isLoading: false
  }
}
export default {
  namespaced: true,
  actions: {
    clear ({ commit }) {
      commit('clear')
    },
    updateMyProfile (ctx, editedData) {
      return updateProfile(editedData)
        .then(() => {
          ctx.commit('updateMyProfile', editedData)
        })
    },
    async getMyProfile (ctx) {
      try {
        const response = await getProfileById(ctx.state.myProfileId)
        ctx.commit('updateMyProfile', response.data.profile)
      } catch (error) {
        ctx.commit('setErrors', error.response.data)
      }
    },
    updateMyProfileId (ctx, myProfileId) {
      return ctx.commit('updateMyProfileId', myProfileId)
    },
    async uploadProfile ({ commit }, nickname) {
      try {
        const response = await getProfileByNickname(nickname)
        commit('updateProfile', response.data.profile)
      } catch (error) {
        if (error) {
          commit('setErrors', error.response.data)
        }
      }
    },
    uploadProfileAction ({ commit }, data) {
      // console.log(data)
      profileAction(data)
        .then(response => {
          commit('updateMessage', response.data)
          if (response.data.result === "User succesfully followed") {
            commit('addFollower', data.id)
          } else if (response.data.result === "User succesfully unfollowed") {
            commit('removeFollower', data.id)
          }
          // console.log(response.data.result)
        })
        .catch(error => {
          commit('setErrors', error.response.data)
        })
    },
    async setPreferencesAction ({ commit }, preferences) {
      await setPreferences({ preferences })
      commit('setPreferences', preferences)
    },
    clearSubs ({ commit }) {
      commit('clearSubscriptions')
    },
    async uploadSubscriptions ({ commit }, data) {
      try {
        commit('setLoading', true)
        const response = await getSubscriptionsById(data.id, data.type)
        commit('setLoading', false)
        commit('updateSubscriptions', { type: data.type, data: response.data.result.data })
      } catch (error) {
        commit('setLoading', false)
        commit('setErrors', error.response.data)
        commit('updateSubscriptions', { type: data.type, data: [] })
      }
    },
    deleteError ({ commit }) {
      commit('deleteError')
    }
  },
  mutations: {
    clear (state) {
      Object.assign(state, getDefaultState())
    },
    updateMessage (state, myProfileData) {
      state.message = []
    },
    addFollower (state, newFollower) {
      // console.log(newFollower)
      state.myProfile.followingsId.push(newFollower)
      // console.log(state.myProfile.followingsId)
    },
    removeFollower (state, newFollower) {
      // console.log(newFollower)
      let arr = state.myProfile.followingsId
      state.myProfile.followingsId = arr.filter(function (elem) {
        return elem !== newFollower
      })
      // console.log(state.myProfile.followingsId)
    },
    updateMyProfile (state, myProfileData) {
      state.myProfile = myProfileData
    },
    updateMyProfileId (state, myProfileId) {
      state.myProfileId = myProfileId
    },
    updateProfile (state, profileData) {
      state.profile = profileData
    },
    setPreferences (state, data) {
      state.myProfile.preferences = data
    },
    clearSubscriptions (state) {
      state.profileFollowers = []
      state.profileFollowings = []
    },
    updateSubscriptions (state, profileData) {
      if (profileData.type === 'followings') {
        state.profileFollowings = profileData.data
      } else if (profileData.type === 'followers') {
        state.profileFollowers = profileData.data
      }
    },
    setLoading (state, payload) {
      state.isLoading = payload
    },
    setErrors (state, data) {
      state.errors = [...state.errors, data]
    },
    deleteError (state) {
      state.errors = state.errors.filter(el => el.error !== "You have been blocked by this user")
    }
  },
  state: getDefaultState(),
  getters: {
    profileGetter (state) {
      window.localStorage.setItem('lastProfileId', state.profile.userId)
      return state.profile
    },
    followingGetter (state) {
      return state.profileFollowings
    },
    followersGetter (state) {
      return state.profileFollowers
    },
    myProfile (state) {
      return state.myProfile
    },
    myProfileId (state) {
      return state.myProfileId
    },
    setPreferences (state, data) {
      state.myProfile.preferences = data
    },
    isLoading (state) {
      return state.isLoading
    },
    deleteError (state) {
      state.errors = state.errors.filter(el => el.error !== "You have been blocked by this user")
    },
    errorGetter (state) {
      return state.errors
    }
  }
}
