<template>
  <div v-touch-swipe.left="handleSwipe" v-touch-swipe.right="handleSwipe">
    <q-tabs
      v-model="tab"
      v-if="!isSearch"
      class="bg-primary text-white shadow-2"
      active-color="black"
      indicator-color="black"
      align="justify"
    >
      <q-tab
        v-if="authorized"
        name="preferences"
        label="recommended"
        @click="getPosts('preferences')"
      />
      <q-tab name="popular" label="popular" @click="getPosts('popular')" />
      <q-tab
        v-if="authorized"
        name="followings"
        label="Followings"
        @click="getPosts('followings')"
      />
    </q-tabs>
    <div id="feed">
      <div class="feed-wrapper">
        <div v-if="isSearch" class="q-mt-lg text-center text-h5">RESULTS</div>
        <div v-if="postsGetter && postsGetter.length > 0">
          <div class="feed-post" v-for="(post, key) in postsGetter" :key="key">
            <one-post :post="post" />
          </div>
          <q-btn
            v-if="paginationIndex && paginationIndex !== 'Last index'"
            :loading="isLoading"
            color="primary"
            class="show-more"
            @click="showMorePosts"
            label="More"
          />
        </div>
        <div
          v-if="(!postsGetter || postsGetter.length === 0) && !isLoading"
          class="text-center q-pa-md"
        >No more posts left</div>
        <q-spinner
          v-if="isLoading && paginationIndex === 'Last index'"
          color="primary"
          size="7em"
          class="fixed-center"
        />
        <div v-if="authorized" class="big-btn" @click="$router.push('/addpost')">
          <i class="fas fa-2x fa-plus"></i>
        </div>
        <q-spinner v-if="isLoading" color="primary" size="7em" class="fixed-center" />
        <div v-if="authorized" class="big-btn" @click="$router.push('/addpost')">
          <i class="fas fa-2x fa-plus"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SinglePost from './SinglePost'
import { mapGetters, mapActions } from 'vuex'
import { isAuthorized } from '@/services/Authorized.js'

export default {
  name: 'Feed',
  data () {
    return {
      isModelVisible: false,
      authorized: false,
      isSearch: false,
      tab: 'popular'
    }
  },
  beforeRouteUpdate (to, from, next) {
    if (to.query.tab === 'search') {
      this.isSearch = true
      if (to.query.tags) {
        this.getPostsAction({ type: 'search', tags: to.query.tags })
      } else if (to.query.emoji) {
        this.getPostsAction({ type: 'search', emoji: to.query.emoji })
      }
      next()
    }
    next()
  },
  beforeCreated () {
    this.getMyProfile()
  },
  async mounted () {
    try {
      if (this.$route.query.tab === 'search') {
        this.isSearch = true
        if (this.$route.query.tags) {
          this.getPostsAction({ type: 'search', tags: this.$route.query.tags })
        } else if (this.$route.query.emoji) {
          this.getPostsAction({ type: 'search', emoji: this.$route.query.emoji })
        }
      } else {
        this.authorized = await isAuthorized()
        if (this.$route.query.tab === 'preferences') {
          this.tab = 'preferences'
          this.getPostsAction({ type: 'preferences' })
        } else {
          if (this.$route.query.tab !== 'followings') {
            this.$router.replace({ query: { tab: 'followings' } })
          }
          this.showAddButton = true
          this.tab = 'followings'
          this.getPostsAction({ type: 'followings' })
        }
      }
    } catch (error) {
      if (this.$route.query.tab !== 'popular') {
        this.$router.replace({ query: { tab: 'popular' } })
      }
      this.getPostsAction({ type: 'popular' })
    }
  },
  beforeDestroy () {
    this.clearPosts()
  },
  methods: {
    ...mapActions({
      getMyProfile: 'profile/getMyProfile',
      getPostsAction: 'posts/getPostsAction',
      clearPosts: 'posts/clearPostsAction'
    }),
    getPosts: function (action) {
      switch (action) {
        case 'preferences':
          if (this.$route.query.tab !== 'preferences') {
            this.$router.replace({ query: { tab: 'preferences' } })
          }
          break
        case 'popular': {
          if (this.$route.query.tab !== 'popular') {
            this.$router.replace({ query: { tab: 'popular' } })
          }
          break
        }
        case 'followings': {
          if (this.$route.query.tab !== 'followings') {
            this.$router.replace({ query: { tab: 'followings' } })
          }
          break
        }
      }
      this.getPostsAction({ type: action })
    },
    showMorePosts: function () {
      if (this.$route.query.tab === 'search') {
        if (this.$route.query.tags) {
          this.getPostsAction({ type: this.$route.query.tab, index: this.paginationIndex, tags: this.$route.query.tags })
        }
        if (this.$route.query.emoji) {
          this.getPostsAction({ type: this.$route.query.tab, index: this.paginationIndex, emoji: this.$route.query.emoji })
        }
      } else {
        this.getPostsAction({ type: this.$route.query.tab, index: this.paginationIndex })
      }
    },
    handleSwipe: function (obj) {
      let dir = obj.direction
      if (this.tab === 'popular') {
        if (dir === 'right') {
          this.tab = 'preferences'
          this.getPosts('preferences')
        }
        if (dir === 'left') {
          this.tab = 'followings'
          this.getPosts('followings')
        }
      } else {
        if (dir === 'left' && this.tab === 'preferences') {
          this.tab = 'popular'
          this.getPosts('popular')
        }
        if (dir === 'right' && this.tab === 'followings') {
          this.tab = 'popular'
          this.getPosts('popular')
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      postsGetter: 'posts/postsGetter',
      myProfile: 'profile/myProfile',
      isLoading: 'posts/loadingGetter',
      paginationIndex: 'posts/paginationIndexGetter'
    })
  },
  components: {
    'one-post': SinglePost
  }
}
</script>

<style lang="scss" scoped>

.empty-message {
  width: 350px;
}
.big-btn {
  width: 75px;
  background: #87e0f5;
  border-radius: 50%;
  height: 75px;
  position: fixed;
  bottom: 8%;
  right: 3%;
  cursor: pointer;
  i {
    position: absolute;
    color: #fff;
    left: 25px;
    top: 23px;
  }
}
#feed {
  position: relative;
  width: 100%;
  max-width: 4200px;
  display: grid;
  justify-content: center;
}

@media (max-width: 699px) {
  .big-btn {
    display: none;
  }
}
.show-more {
  display: block;
  margin: 0 auto 20px;
}
</style>
