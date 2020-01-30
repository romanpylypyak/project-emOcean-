<template>
  <div v-if="!blocked">
    <div v-if="profileGetter.nickname">
      <div class="profile-header" :style="{ backgroundImage: userBackground }"></div>
      <div class="row wrapp">
        <div class="col-12 col-md-3 profile-card">
          <profile-card :profile="profileGetter" />
        </div>
        <div class="col-12 col-md-9 profile-content">
          <div class="col-12">
            <switch-video :userPosts="userPosts" :userLikedPosts="userLikedPosts"></switch-video>
          </div>
        </div>
      </div>
      <to-top-anchor></to-top-anchor>
    </div>
    <div v-else>
      <error404></error404>
    </div>
  </div>
  <div v-else>
    <q-banner class="bg-primary text-white banner">
      <q-icon name="warning" class="text-white" style="font-size: 4rem;" />
      <p class="block-banner-message">Unfortunately, you have been blocked by this user</p>
    </q-banner>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ProfileCard from './Card/index'
import switchVideo from './Card/switchVideo'
import toTopAnchor from '../../components/ToTopAnchor'
import Error404 from '../Error404/Error404'

export default {
  components: {
    ProfileCard,
    switchVideo,
    toTopAnchor,
    Error404
  },
  data () {
    return {
      blocked: false
    }
  },
  computed: {
    ...mapGetters({
      profileGetter: 'profile/profileGetter',
      userPosts: 'posts/userPostsGetter',
      userLikedPosts: 'posts/userLikedPostsGetter',
      errorGetter: 'profile/errorGetter'
    }),
    userBackground () {
      return this.profileGetter.backgroundUrl
        ? 'url(' + this.profileGetter.backgroundUrl + ')'
        : 'url(https://i.ytimg.com/vi/DiS7ZMwTA0I/maxresdefault.jpg)'
    },
    nickname () {
      return this.$route.params.nickname
    }
  },
  async beforeRouteUpdate (to, from, next) {
    if (to.path.startsWith('/profile')) {
      await this.uploadProfile(to.params.nickname)
      this.getUserPosts(this.profileGetter.userId)
      this.getUserLikedPosts(this.profileGetter.userId)
    }
    next()
  },
  async created () {
    await this.uploadProfile(this.nickname)
    const blocks = this.errorGetter.filter(el => el.error === "You have been blocked by this user")
    if (blocks && blocks.length !== 0) {
      this.blocked = true
      this.deleteError()
    } else {
      this.blocked = false
    }
    this.getUserPosts(this.profileGetter.userId)
    this.getUserLikedPosts(this.profileGetter.userId)
  },
  methods: {
    ...mapActions({
      uploadProfile: 'profile/uploadProfile',
      getUserPosts: 'posts/getUserPostsAction',
      getUserLikedPosts: 'posts/getUserLikedPostsAction',
      deleteError: 'profile/deleteError'
    })
  },
  watch: {
    async nickname () {
      await this.uploadProfile(this.nickname)
      const blocks = this.errorGetter.filter(el => el.error === "You have been blocked by this user")
      if (blocks && blocks.length !== 0) {
        this.blocked = true
        this.deleteError()
      } else {
        this.blocked = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapp {
  min-height: calc(100vh - 260px);
  .profile-content {
    background: url("https://img5.goodfon.ru/wallpaper/nbig/1/ab/zima-sneg-snezhinki-fon-christmas-blue-winter-background-s-7.jpg");
  }
}
.profile-header {
  background-position: center;
  background-size: cover;
  height: 200px;
  position: relative;
  .view-counter {
    position: absolute;
    display: flex;
    align-items: center;
    font-size: 13px;
    font-weight: 500;
    top: 25px;
    border-radius: 20px 0 0 20px;
    right: 0;
    padding: 5px;
    background-color: white;
  }
}
</style>
