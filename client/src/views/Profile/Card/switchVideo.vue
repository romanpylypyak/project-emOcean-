<template>
  <div class="video-switch">
    <q-tabs v-model="tab" class="text-white inline-label shadow-2">
      <q-tab name="my-videos">
        <i class="far fa-play-circle"></i>
      </q-tab>
      <q-tab name="liked-videos">
        <i class="far fa-heart"></i>
      </q-tab>
    </q-tabs>
    <q-tab-panels
      v-model="tab"
      animated
      transition-prev="scale"
      transition-next="scale"
      class="text-white text-center"
    >
      <q-tab-panel name="my-videos" class="my-profile-videos">
        <div class="switch-video-wrapper" v-if="userPosts && userPosts.length > 0 && !isLoading">
          <div class="feed-post" v-for="post in userPosts" :key="post.postId">
            <one-post :post="post" />
          </div>
        </div>
        <div v-else>This user have no posts =(</div>
      </q-tab-panel>
      <q-tab-panel name="liked-videos" class="my-profile-videos">
        <div class="switch-video-wrapper" v-if="userLikedPosts && userLikedPosts.length && !isLoading">
          <div class="feed-post" v-for="post in userLikedPosts" :key="post.postId">
            <one-post :post="post" />
          </div>
        </div>
        <div v-else>This user have no liked posts =(</div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import SinglePost from '../../Feed/SinglePost'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      tab: 'my-videos'
    }
  },
  props: {
    userPosts: Array,
    userLikedPosts: Array
  },
  components: {
    'one-post': SinglePost
  },
  computed: {
    ...mapGetters({ isLoading: 'posts/loadingGetter' })
  },
  watch: {
    $route () {
      this.tab = 'my-videos'
    }
  }
}
</script>

<style lang="scss" scoped>
.video-switch {
  .q-tab-panels {
    background-color: inherit;
  }
  .q-tabs {
    background: linear-gradient(45deg, blue, #f05924);
    font-family: "Roboto Slab", "Times New Roman", serif;
  }
  .far {
    font-size: 19px;
    color: white;
  }
}

.switch-video-wrapper{
  display: grid;
  justify-content: center;
    .feed-post {
        margin-bottom: 25px;
        position: relative;
        width: fit-content;
      }
}
</style>
