<template>
  <div class="row justify-around">
    <q-btn
      v-for="(preference, key) in getPreferences"
      :key="key"
      @click="updatePreference({key: key, updates: {chosen: !preference.chosen}})"
      size="40px"
      round
      class="q-ma-xs"
    >
      <q-avatar size="120px">
        <img :src="preference.src" :class="{chosen: preference.chosen}" />
        <div
          :class="[preference.chosen ? 'chosen' : 'img-caption',
            'absolute-center',
            'text-subtitle1',
            'text-center']"
        >{{preference.hashtag}}</div>
      </q-avatar>
    </q-btn>
    <q-btn size="40px" round color="teal" @click="savePreferences(getPreferences)">go</q-btn>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { isAuthorized } from '@/services/Authorized.js'

export default {
  name: 'EditPreferences',
  data: function () {
    return {
      preferences: []
    }
  },
  async created () {
    try {
      const auth = await isAuthorized()
      this.isAuthenticated = auth
    } catch (e) {
      this.isAuthenticated = false
    }
  },
  async beforeMount () {
    if (this.isAuthenticated) {
      await this.getMyProfile()
      if (this.myProfile.preferences.length !== 0) {
        this.updateTagState(this.myProfile.preferences)
      }
    }
  },
  methods: {
    ...mapActions('preferences', ['updatePreference', 'updateTagState']),
    ...mapActions({ getMyProfile: 'profile/getMyProfile', setPreferences: 'profile/setPreferencesAction' }),
    ...mapActions({ getPostsAction: 'posts/getPostsAction' }),
    getChosenTags: function (state) {
      for (let obj in state) {
        if (state[obj].chosen) {
          this.preferences.push(state[obj].hashtag)
        }
      }
    },
    savePreferences: async function (state) {
      this.getChosenTags(state)
      await this.setPreferences(this.preferences)
      this.showNotifSaveData()
      await this.getPostsAction({ type: 'preferences' })
      this.$router.push('/feed?tab=preferences')
    },
    showNotifSaveData () {
      this.$q.notify({
        message: 'Your preferences were saved. Enjoy your new feed ',
        icon: 'announcement',
        color: 'primary'
      })
    }
  },
  computed: {
    ...mapGetters('preferences', ['getPreferences']),
    ...mapGetters({ myProfile: 'profile/myProfile' })
  }
}
</script>

<style scoped>
.chosen {
  background-color: rgba(2, 211, 176, 0.801);
  color: #000;
  width: 90%;
  height: 20%;
  align-self: center;
  border-radius: 0 40px 0 40px;
}

img.chosen {
  filter: grayscale(100%);
}

.img-caption {
  background-color: rgba(39, 39, 39, 0.602);
  color: #fff;
  width: 90%;
  height: 20%;
  align-self: center;
  border-radius: 0 40px 0 40px;
}
</style>
