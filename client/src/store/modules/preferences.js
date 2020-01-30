const state = {
  preferences: {
    'id_1': {
      src: '../preferences/animals.jpg',
      hashtag: 'animals',
      chosen: false
    },
    'id_2': {
      src: '../preferences/cinema.jpg',
      hashtag: 'cinema',
      chosen: false
    },
    'id_3': {
      src: '../preferences/culinary.jpg',
      hashtag: 'food',
      chosen: false
    },
    'id_4': {
      src: '../preferences/dance.jpg',
      hashtag: 'dance',
      chosen: false
    },
    'id_5': {
      src: '../preferences/extreme.jpg',
      hashtag: 'extreme',
      chosen: false
    },
    'id_6': {
      src: '../preferences/game.jpg',
      hashtag: 'game',
      chosen: false
    },
    'id_7': {
      src: '../preferences/health.jpg',
      hashtag: 'health',
      chosen: false
    },
    'id_8': {
      src: '../preferences/learn.jpg',
      hashtag: 'learn',
      chosen: false
    },
    'id_9': {
      src: '../preferences/nature.jpg',
      hashtag: 'nature',
      chosen: false
    },
    'id_10': {
      src: '../preferences/prank.jpg',
      hashtag: 'prank',
      chosen: false
    },
    'id_11': {
      src: '../preferences/science.jpg',
      hashtag: 'science',
      chosen: false
    },
    'id_12': {
      src: '../preferences/sport.jpg',
      hashtag: 'sport',
      chosen: false
    },
    'id_13': {
      src: '../preferences/travel.jpg',
      hashtag: 'travel',
      chosen: false
    },
    'id_14': {
      src: '../preferences/fun.jpg',
      hashtag: 'fun',
      chosen: false
    }
  }
}

const mutations = {
  updatePreference (state, payload) {
    Object.assign(state.preferences[payload.key], payload.updates)
  },
  rollbackChanges (state, tags) {
    for (let tag of tags) {
      for (let obj in state.preferences) {
        if (state.preferences[obj].hashtag === tag) {
          state.preferences[obj].chosen = false
        }
      }
    }
  },
  updateTagState (state, tags) {
    for (let tag of tags) {
      for (let obj in state.preferences) {
        if (state.preferences[obj].hashtag === tag) {
          state.preferences[obj].chosen = true
        }
      }
    }
  }
}

const actions = {
  updatePreference ({ commit }, payload) {
    commit('updatePreference', payload)
  },
  rollbackChanges ({ commit }, tags) {
    commit('rollbackChanges', tags)
  },
  updateTagState ({ commit }, tags) {
    commit('updateTagState', tags)
  }
}

const getters = {
  getPreferences: (state) => {
    return state.preferences
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
