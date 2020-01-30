<template>
  <div>
    <q-list>
      <q-item-label header>General</q-item-label>
      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label>Accounts you follow</q-item-label>
          <q-item-label caption>Manage followings</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator spaced />
      <q-item-label header>Notifications</q-item-label>

      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>Comment to video</q-item-label>
          <q-item-label caption>Allow notification</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle color="teal" v-model="comment" />
        </q-item-section>
      </q-item>

      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>Like post</q-item-label>
          <q-item-label caption>Allow notification</q-item-label>
        </q-item-section>
        <q-item-section side top>
          <q-toggle color="teal" v-model="like" />
        </q-item-section>
      </q-item>

      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>Reply</q-item-label>
          <q-item-label caption>Allow notification</q-item-label>
        </q-item-section>
        <q-item-section side top>
          <q-toggle color="teal" v-model="reply" />
        </q-item-section>
      </q-item>

      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>Video uploaded</q-item-label>
          <q-item-label caption>Allow notification</q-item-label>
        </q-item-section>
        <q-item-section side top>
          <q-toggle color="teal" v-model="uploadPost" />
        </q-item-section>
      </q-item>

      <q-separator spaced />
      <q-item-label header>Filters</q-item-label>

      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>Hide offensive comments</q-item-label>
          <q-item-label caption>Hide comments</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle color="blue" v-model="hideOffencive" />
        </q-item-section>
      </q-item>
      <q-separator spaced />
      <q-item-label header>Black list</q-item-label>
      <div class="row justify-between">
        <div class="col" id="input-search" ref="search">
          <q-input v-model="nickname" @input="searchByNick" />
          <block-search
            v-if="showSearch"
            class="search-result"
            :results="nicknameSearchResults"
            @handleChoose="handleChoose"
          />
        </div>
        <q-spinner-bars class="col q-ml-md" color="teal" size="3em" v-show="loading" />
        <div>
          <q-btn @click="blockUser" class="col" id="block-button" :disabled="!enableBlock">Block</q-btn>
        </div>
      </div>
      <p v-if="userToBlockNick">
        {{userToBlockNick}}
        <q-btn
          round
          color="teal"
          size="xs"
          icon="close"
          id="close-user"
          @click="userToBlockNick = ''"
        />
      </p>
      <p class="error-message" v-if="errorMessage">
        {{errorMessage}}
        <q-btn
          round
          color="red"
          size="xs"
          icon="close"
          id="close-error"
          @click="errorMessage = ''"
        />
      </p>
      <blocked-list class="blocked-list" @unblock="unblockUser" :list="blockedProfilesList"></blocked-list>
    </q-list>
  </div>
</template>

<script>
import BlockSearch from '@/components/BlockSearch.vue'
import BlockedList from '@/components/BlockedList.vue'
import { debounce } from 'lodash'
import { searchByNick, profileAction, getProfile } from '@/services/profile.js'
import { mapGetters } from 'vuex'
export default {
  name: 'EditPrivacy',
  components: {
    BlockSearch,
    BlockedList
  },
  computed: {
    ...mapGetters({
      myid: 'profile/myProfileId'
    })
  },
  data () {
    return {
      comment: true,
      like: true,
      reply: true,
      uploadPost: true,
      hideOffencive: false,
      nickname: '',
      showSearch: true,
      nicknameSearchResults: [],
      userToBlockNick: '',
      userToBlockId: '',
      errorMessage: '',
      enableBlock: false,
      blockedIdList: [],
      blockedProfilesList: [],
      loading: false
    }
  },
  created () {
    this.displayBlockedIds()
  },
  methods: {
    searchByNick: debounce(function (value) {
      if (value) {
        this.nicknameSearchResults = []
        this.showSearch = true
        searchByNick({ nickname: value })
          .then(res => {
            this.nicknameSearchResults = []
            res.data.message.forEach(element => {
              this.nicknameSearchResults.push({ id: element.userId, nickname: element.nickname, avatar: element.avatarUrl })
            })
          })
          .catch((err) => {
            if (err.response.status === 404) {
              this.nicknameSearchResults = []
              this.nicknameSearchResults.push({ error: 'No matches found' })
            }
          })
      } else {
        this.showSearch = false
        this.nicknameSearchResults = []
      }
    }, 300),
    handleChoose (id, nickname) {
      this.errorMessage = ''
      this.userToBlockNick = nickname
      this.userToBlockId = id
      this.showSearch = false
      this.nickname = ''
      this.enableBlock = true
      if (this.userToBlockId === this.myid) {
        this.errorMessage = 'You cannot block your own account.'
        this.userToBlockNick = ''
        this.userToBlockId = ''
        this.enableBlock = false
      }
    },
    blockUser () {
      this.loading = true
      const action = 'block'
      const id = this.userToBlockId
      profileAction({ action, id })
        .then(response => {
          this.displayBlockedIds()
          this.userToBlockNick = ''
          this.userToBlockId = ''
        })
        .catch(error => {
          this.enableBlock = false
          if (error.response.data.error) {
            this.errorMessage = error.response.data.error
          } else {
            this.errorMessage = 'Sorry, something went wrong...'
          }
          this.loading = false
        })
    },
    unblockUser (id) {
      this.loading = true
      const action = 'unblock'
      profileAction({ action, id })
        .then(response => {
          this.displayBlockedIds()
        })
        .catch(error => {
          if (error.response.data.error) {
            this.errorMessage = error.response.data.error
          } else {
            this.errorMessage = 'Sorry, something went wrong...'
          }
          this.loading = false
        })
    },
    displayBlockedIds () {
      const id = this.myid
      getProfile({ id })
        .then(res => {
          if (res.data.profile.blockedProfiles.length === 0) {
            this.blockedProfilesList = []
            this.loading = false
          } else {
            this.blockedIdList = res.data.profile.blockedProfiles
            this.getBlockedProfiles()
          }
        })
        .catch(() => {
          this.errorMessage = 'Sorry, something went wrong...'
          this.loading = false
        })
    },
    getBlockedProfiles () {
      this.blockedProfilesList = []
      this.blockedIdList.forEach(element => {
        getProfile({ id: element })
          .then(res => {
            const profile = res.data.profile
            this.blockedProfilesList.push({ id: profile.userId, nickname: profile.nickname, avatar: profile.avatarUrl })
            this.loading = false
          })
          .catch(() => {
            this.errorMessage = 'Sorry, something went wrong...'
            this.loading = false
          })
      })
    }
  }
}
</script>
<style scoped>
#input-search {
  max-width: 200px;
}
#block-button {
  max-width: 100px;
}
.error-message {
  color: red;
}
.search-result {
  z-index: 1;
}
.blocked-list {
  margin-top: 80px;
}
</style>
