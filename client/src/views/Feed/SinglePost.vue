<template>
  <div class="single-post">
    <v-comments :isModelVisible="isModelVisible" :closePopup="closePopup" :id="post.postId" />
    <div class="video-container" @click="play">
      <figure class="image is-32x32">
        <span class="emoji video-emoji" @click="sreachByEmoji(post.emoji)" v-html="post.emoji"/>
        <router-link :to="{ path: `/profile/${post.nickname}` }">
          <div ref="avatar" class="avatar" @click="$router.replace(`profile/${post.nickname}`)">
            <avatar
            :img="post.avatarUrl"
            :size="'30px'"
            />
          </div>
        </router-link>
      </figure>
     <video ref="videoElm" width="480" v-observe-visibility="visibilityChanged" @click.once="incrementViewsCounter(post)">
        <q-resize-observer @resize="onResize" />
        <source :src="post.videoUrl" type="video/mp4" />
        <source :src="post.videoUrl" type="video/ogg" />
        <source :src="post.videoUrl" type="video/webm" />
    </video>
      <div class="bigger-video" @click="openModalVideo"><i ref="bigVideo" class="fas fa-compress fa-2x"></i></div>
    </div>
    <div class="content-wrapper">
      <div class="heart-and-comments">
        <div class="heart">
          <i class="far fa-heart fa-lg"
          :class="{'fas': isLiked}"
          @click="updateLikes(post)">
          </i>
          <p class="likes" @click="showLikesList(post)">
            {{ this.post.likesCount }}
          </p>
        </div>
        <div class="comments-icon" @click="closePopup(true)">
          <i class="far fa-comment-alt fa-md"></i>
          <p class="likes">{{ this.commentsCount(this.post.postId) }}</p>
        </div>
      </div>
      <div class="content">
        <p
          class="caption"
          ref="caption"
          :class="[post.caption.length > this.captionCharMaxLength ? 'caption' : 'caption2']"
        >
          <router-link :to="{ path: `/profile/${post.nickname}` }">
            <span>{{ post.nickname }}</span>
          </router-link>
          {{ post.caption }}
        </p>
      </div>
    </div>
    <likes-list v-bind:info="likesInfo" v-if="likesInfo.show" />
    <q-dialog v-model="dialog" transition-show="slide-up" transition-hide="slide-down">
      <div class="qCard-wrapper" ref="qCard">
      <q-card id="feed-modal-video">
        <q-card-section>
          <template>
          <div class="video-container" @click="play">
            <figure class="image is-32x32">
              <router-link :to="{ path: `/profile/${post.nickname}` }">
                <div ref="avatar" class="avatar" @click="$router.replace(`profile/${post.nickname}`)">
                  <avatar
                  :img="post.avatarUrl"
                  :size="'30px'"
                  />
                </div>
              </router-link>
            </figure>
            <video ref="modalVideo">
                <q-resize-observer @resize="onResize" />
                <source :src="post.videoUrl" type="video/mp4" />
                <source :src="post.videoUrl" type="video/ogg" />
                <source :src="post.videoUrl" type="video/webm" />
            </video>
          </div>
          <div class="content-wrapper">
            <div class="heart-and-comments">
              <div class="heart">
                <i class="far fa-heart fa-lg"
                :class="{'fas': isLiked}"
                @click="updateLikes(post)">
                </i>
                <p class="likes">{{ this.post.likesCount }}</p>
              </div>
              <div class="comments-icon" @click="closePopup(true)">
                <i class="far fa-comment-alt fa-md"></i>
                <p class="likes">{{ this.commentsCount(this.post.postId) }}</p>
              </div>
            </div>
            <div class="content">
              <p
                ref="caption"
                :class="[post.caption.length > this.captionCharMaxLength ? 'caption-in-modal' : 'caption-in-modal']"
              >
                <router-link :to="{ path: `/profile/${post.nickname}` }">
                  <span>{{ post.nickname }}</span>
                </router-link>
                {{ post.caption }}
              </p>
            </div>
          </div>
          </template>
        </q-card-section>
      </q-card>
      </div>
    </q-dialog>
  </div>
</template>

<script>
import PageComments from '../Comments/PageComments'
import LikesList from '@/components/LikesList.vue'
import Avatar from '@/components/Avatar.vue'
import { updateLikes, incrementViewsCounter } from '../../services/posts'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'OnePost',
  props: {
    post: {
      type: Object,
      default: null,
      required: true
    }
  },
  data () {
    return {
      captionCharMaxLength: 40,
      isModelVisible: false,
      dialog: false,
      likesInfo: {
        show: false
      },
      isLiked: false,
      showNotAuth: false
    }
  },
  computed: {
    ...mapGetters({ myProfile: 'profile/myProfile' }),
    ...mapGetters({ comments: 'comments/myComments' }),
    ...mapGetters({ commentsCount: 'comments/commentsCount' })
  },

  methods: {
    ...mapActions({
      dislikePost: 'posts/dislikePost',
      likePost: 'posts/likePost'
    }),
    isPostLiked (post) {
      const likesArr = this.post.likes
      for (let el of likesArr) {
        if (el.userId === localStorage.getItem('profileId')) {
          this.isLiked = true
          return
        }
      }
    },
    incrementViewsCounter (post) {
      const postId = post.postId
      incrementViewsCounter(postId)
        .then(res => { })
    },
    updateLikes (post) {
      const postId = post.postId
      this.updateLikesInStore(postId)
      updateLikes(postId)
        .then(response => { })
        .catch(error => {
          if (error.response.statusText === 'Unauthorized') {
            this.showNotif('center')
            return 'You are not authorized!!!'
          }
          this.updateLikesInStore(postId)
        })
    },
    updateLikesInStore (postId) {
      this.isLiked = !this.isLiked
      if (this.isLiked === true) {
        this.likePost(postId)
      } else {
        this.dislikePost(postId)
      }
    },
    showNotif (position) {
      this.$q.notify({
        message: `<span style="font-size:1.3em;">You are not authorized!</span><br>
        <em>Please, login or create new account</em>`,
        color: 'primary',
        position,
        html: true,
        actions: [
          {
            label: 'Sign in',
            color: 'yellow',
            handler: () => {
              this.$router.push('/login')
            }
          },
          {
            label: 'Sign up',
            color: 'accent',
            handler: () => {
              this.$router.push('/register')
            }
          },
          { label: 'Later', color: 'white', handler: () => { } }
        ]
      })
    },
    sreachByEmoji (emoji) {
      if (this.$route.query.emoji === emoji) {
        this.$router.push('')
        this.$router.push(`/?tab=search&emoji=${emoji}`)
      } else {
        this.$router.push(`/?tab=search&emoji=${emoji}`)
      }
    },
    showLikesList (post) {
      if (post.likesCount === 0) {
        this.$q.notify({
          message: `<span style="color:#333;">There are no likes</span>`,
          html: true,
          color: 'secondary',
          position: 'center',
          actions: [
            { label: `Like ❤`,
              color: 'red',
              handler: () => {
                this.updateLikes(post)
              }
            },
            { label: 'Close', color: 'dark', handler: () => { } }
          ]
        })
      } else {
        this.likesInfo.show = true
        this.likesInfo.postId = post.postId
      }
    },
    closePopup (visibility) {
      this.isModelVisible = visibility
    },
    openModalVideo (event) {
      this.$refs.videoElm.pause()
      this.dialog = true
    },
    onResize () {
      if (this.dialog && (this.$refs.modalVideo.videoHeight < this.$refs.modalVideo.videoWidth)) {
        this.$refs.modalVideo.classList.add("width-video")
        this.$refs.qCard.id = "qCard-width-video"
      }
      if (this.$refs.videoElm.videoHeight > this.$refs.videoElm.videoWidth) {
        this.$refs.videoElm.height = "270"
      }
    },
    visibilityChanged (isVisible, entry) {
      this.isVisible = isVisible
      if (!isVisible) {
        entry.target.pause()
      }
    },
    play (event) {
      let currentVideo = event.target
      if ((event.target !== this.$refs.videoElm) && (event.target !== this.$refs.modalVideo)) {
        return false
      } else {
        if (currentVideo.paused) {
          currentVideo.play()
        } else {
          currentVideo.pause()
        }
      }
    }
  },
  components: {
    'v-comments': PageComments,
    'likes-list': LikesList,
    Avatar
  },
  mounted () {
    this.isPostLiked()
  }
}
</script>

<style lang="scss" scoped>
.video-emoji {
  position: absolute;
  top: -40px;
  left: -50px;
  z-index: 55;
  cursor: pointer;
  font-size: xx-large;
}
#qCard-width-video {
  width: -webkit-fill-available;
  max-width: 800px;
}
#feed-modal-video {
  .q-card__section {
    padding: 0;
  }
  .width-video {
    height: auto;
    width: 100%;
  }
  video {
    width: auto;
    height: -webkit-fill-available;
    background: #000;
    margin-bottom: -6px;
  }
  .video-container {
    padding: 0;
    background: #0000;
    border-radius: 0;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
  .content .caption-in-modal {
    position: absolute;
    bottom: 1%;
    width: 90%;
    margin: 0;
    font-size: 0.85rem;
    word-wrap: break-word;
    span {
      font-weight: bold;
    }
  }
}
.q-avatar{
   z-index: 10;
   cursor: pointer;
}
.bigger-video {
  position: absolute;
  color: #fff;
  top: 3%;
  left: 2%;
  cursor: pointer;
}
.heart-and-comments {
  flex-direction: column;
  position: absolute;
  right: 3%;
  top: 35%;
  bottom: 65%;
  cursor: pointer;
  .heart i {
    display: inline;
    color: #dbe4e2;
  }
  .likes {
    display: inline-block;
    text-align: center;
    font-size: 3.2vmin;
    width: 7vmin;
    margin: 5px 0;
    font-weight: 100;
    color: #dbe4e2;
  }
  .comments-icon {
    display: inline-block;
    font-size: large;
    height: 25px;
    cursor: pointer;
  }
  .comments-icon i::before,
  .heart i::before {
    font-size: 4vmin;
    color: #dbe4e2;
  }
  .comments-icon p {
    display: inline-block;
    vertical-align: bottom;
    font-size: 3.2vmin;
    width: 7vmin;
    margin: 5px 0;
    text-align: center;
    color: #dbe4e2;
  }
  .comments-counter {
    text-align: center;
  }
}
.single-post {
  position: relative;
  padding: 10px;
  .content-wrapper {
    margin: 7.5px 10px;
  }
  video {
    max-width: 100%;
    padding: 0px;
    background: #000;
    margin-bottom: -6px;
  }
}
.video-container {
  padding: 7px;
  max-width: 800px;
  position: relative;
  background: #87e0f5;
  border-radius: 11px;
  box-shadow: 1px 1px 18px;
  img {
    border-radius: 99px;
    top: 17%;
  }
  .image {
    right: 5%;
    position: absolute;
    top: 8%;
    margin: 0;
  }
  .image.is-32x32 img {
    height: 32px;
    width: 32px;
  }
}
.content .caption {
  position: absolute;
  bottom: 3%;
  width: 90%;
  font-size: 0.85rem;
  word-wrap: break-word;
  span {
    font-weight: bold;
  }
}
.content .caption2 {
  position: absolute;
  width: 88%;
  bottom: 4%;
  font-size: 0.85rem;
  word-wrap: break-word;
  span {
    font-weight: bold;
  }
}
.content p {
  text-align: left;
  color: #dbe4e2;
}
@media (max-width: 417px) {
  #feed-modal-video video {
    width: 100%;
    height: auto;
    max-width: 52vh;
    max-height: 92vh;
  }
  #feed-modal-video .width-video {
    width: auto;
    background: #000;
    margin-bottom: -6px;
    max-width: 100%;
  }
}
</style>
