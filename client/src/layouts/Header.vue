<template>
  <div class="header" id="main-header" @click="visible">
    <q-header bordered class="bg-white text-primary">
      <q-toolbar ref="toolbar">
        <div class="homeRouterLink" @click="navigate">
          <img src="@/assets/img/logoSmall.jpg" class="logo lt-sm" />
          <img src="@/assets/img/logo.jpeg" class="logo gt-xs" />
        </div>
        <div v-if="isAuthenticated" class="backToProfile">
          <span>Hi there,</span>
          <router-link
            class="myProfileRouterlink"
            :to="{
              name: 'profile',
              params: { nickname: myProfile.nickname }
            }"
          >
            {{myProfile.nickname}}
          </router-link>
        </div>
        <q-space></q-space>
        <q-icon v-if="emojiSearch" class="cursor-pointer" @click="showEmoji" size="sm" name="insert_emoticon" />
        <q-dialog
          seamless
          v-model="showEmojisBool"
          transition-show="slide-up"
          transition-hide="slide-down"
        >
          <q-card>
            <q-card-section
              style="background: #f0f0f0;"
              class="row items-center no-wrap text-primary"
            >
              <div class="text-h6">Select Emogi</div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>
            <VEmojiPicker @select="selectEmoji" />
          </q-card>
        </q-dialog>
        <div
          id="input-search"
          ref="search"
          class="fixed-top-center"
          :style="{ visibility: 'hidden'}"
        >
          <q-input v-model="userInput" @input="searchByNick" @keyup.enter="searchTag" />
          <nickname-search
            v-if="showSearch"
            id="search-result"
            :results="nicknameSearchResults"
            @closeSearch="closeSearchComponent"
          />
        </div>
        <div ref="searchWrapper">
          <q-btn flat round dense icon="search" @click="visible" class="q-mr-xs text-cyan" />
        </div>
        <q-btn flat round dense icon="menu" class="text-cyan">
          <q-menu>
            <q-list style="min-width: 100px">
              <template v-if="isAuthenticated">
                <q-item to="/settings" clickable>
                  <q-item-section>Settings</q-item-section>
                </q-item>
                <q-item clickable @click="logOut">
                  <q-item-section>Log out</q-item-section>
                </q-item>
              </template>
              <template v-else>
                <q-item to="/login" clickable>
                  <q-item-section>Login</q-item-section>
                </q-item>
                <q-item to="/register" clickable>
                  <q-item-section>Register</q-item-section>
                </q-item>
              </template>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>
  </div>
</template>

<script>
import NicknameSearch from '../components/NicknameSearch.vue'
import debounce from 'lodash/debounce'
import { searchByNick } from '@/services/profile.js'
import { isAuthorized } from '@/services/Authorized.js'
import VEmojiPicker from 'v-emoji-picker'
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'

export default {
  name: 'Header',
  components: {
    NicknameSearch,
    VEmojiPicker
  },
  data () {
    return {
      userInput: '',
      nickname: '',
      showSearch: true,
      nicknameSearchResults: [],
      isAuthenticated: false,
      emojiSearch: false,
      showEmojisBool: false
    }
  },
  computed: {
    ...mapGetters({
      token: 'auth/getToken',
      myProfile: 'profile/myProfile'
    })
  },
  async created () {
    try {
      const auth = await isAuthorized()
      this.isAuthenticated = auth
    } catch (e) {
      this.isAuthenticated = false
    }
    await this.getMyProfile()
  },

  watch: {
    token () {
      isAuthorized()
        .then(res => {
          this.isAuthenticated = res
        })
        .catch(() => {
          this.isAuthenticated = false
        })
    }
  },
  methods: {
    ...mapActions({
      getMyProfile: 'profile/getMyProfile'
    }),
    showEmoji () {
      this.showEmojisBool = !this.showEmojisBool
    },
    selectEmoji (emoji) {
      this.userInput = emoji.data
      this.showEmojisBool = !this.showEmojisBool
      this.searchPostByEmogi()
    },
    searchPostByEmogi () {
      if (this.$route.query.emoji === this.userInput) {
        this.$router.push('')
        this.$router.push(`/?tab=search&emoji=${this.userInput}`)
      } else {
        this.$router.push(`/?tab=search&emoji=${this.userInput}`)
      }
      this.userInput = ''
      this.emojiSearch = false
      this.showEmojisBool = false
      this.$refs.search.style.visibility = 'hidden'
    },
    searchByNick: debounce(function (value) {
      if (!/^#/.test(value) && value !== '') {
        this.nicknameSearchResults = []
        this.showSearch = true
        searchByNick({ nickname: value })
          .then(res => {
            this.nicknameSearchResults = []
            res.data.message.forEach(element => {
              this.nicknameSearchResults.push({
                id: element.profileId,
                nickname: element.nickname,
                avatar: element.avatarUrl
              })
            })
          })
          .catch(err => {
            if (err.response.data.error === 'No user has been found') {
              this.nicknameSearchResults = []
              this.nicknameSearchResults.push({ error: 'No matches found' })
            }
          })
      } else {
        this.showSearch = false
        this.nicknameSearchResults = []
      }
    }, 300),
    searchTag: function () {
      if (this.userInput) {
        const hashRegex = /^#/
        const tagsQuery = this.userInput.split(' ').filter(item => hashRegex.test(item)
        ).map(item => item.replace(hashRegex, '')).join('-')
        if (tagsQuery) {
          if (this.$route.name === 'Feed') {
            if (
              this.$route.query.tab === 'search' &&
              this.$route.query.tags === tagsQuery
            ) {
              this.$router.replace({ query: { tab: '', tags: '' } })
            }
            this.$router.replace({ query: { tab: 'search', tags: tagsQuery } })
          } else {
            this.$router.push(`/?tab=search&tags=${tagsQuery}`)
          }
        }
      }
    },
    visible (e) {
      if (e.target === this.$refs.toolbar.$el) {
        this.emojiSearch = false
        this.showEmojisBool = false
        this.$refs.search.style.visibility = 'hidden'
      } else if (e.target.textContent === this.$refs.searchWrapper.textContent) {
        this.emojiSearch = true
        this.$refs.search.style.visibility = 'visible'
      }
    },
    logOut () {
      this.$store.dispatch('profile/clear')
      this.$store.dispatch('clear')
      this.$store.dispatch('auth/signin', { token: '', user: '' })
      window.localStorage.removeItem('token')
      window.localStorage.removeItem('profileId')
      delete axios.defaults.headers.common['Authorization']
      this.$q.notify({
        textColor: 'white',
        actions: [{ icon: 'close', color: 'white' }],
        timeout: 3000,
        color: 'primary',
        message: 'You logged out.'
      })
      this.$router.push('/login')
    },
    navigate () {
      if (this.$route.path === '/') {
        if (this.$route.query.tab === 'search') {
          this.$router.replace({ query: { tab: 'popular' } })
        }
        this.$router.go()
      } else {
        this.$router.push('/')
      }
    },
    closeSearchComponent () {
      this.showSearch = false
      this.userInput = ''
    }
  }
}
</script>

<style>
.logo {
  height: 100%;
  margin: 0;
}

.homeRouterLink {
  height: 60px;
  display: block;
  padding: 8px 0;
  cursor: pointer;
}

#input-search .q-field__control {
  height: 24px;
  position: relative;
}

#search-result {
  position: absolute;
}

.backToProfile {
  margin-left: 20px;
  text-align: center;
}

.backToProfile .myProfileRouterlink {
  font-size: 17px;
}

.backToProfile .myProfileRouterlink:hover {
    color: #DE5235;
}

@media screen and (max-width: 699px){
  .backToProfile {
    display: none;
  }
}
</style>
