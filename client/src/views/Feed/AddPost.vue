<template>
  <div class="add-post">
    <template>
      <div class="q-pa-md q-gutter-sm">
        <q-dialog v-model="dialog" transition-show="slide-up" transition-hide="slide-down">
          <q-card class="bg-white text-black h-70" id="modal-window">
            <q-bar>
              <q-space />
              <div id="hour-glass" ref="hourGlass" v-if="hourGlass">
                <q-tooltip :offset="[0, 8]">QSpinnerHourglass</q-tooltip>
                <q-spinner-hourglass color="primary" size="2em" />
              </div>
              <q-btn dense flat icon="close" v-close-popup></q-btn>
            </q-bar>
            <q-card-section>
              <div class="text-h6 text-center">Choose your video here</div>
            </q-card-section>
            <q-card-section>
              <label for="file" class="custom-file-upload">
                <p>Choose Video</p>
              </label>
              <input
                ref="input"
                type="file"
                name="file"
                id="file"
                class="inputfile"
                @change="uploadVideo"
              />
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
    </template>
    <div id="chip" ref="chip" v-if="showBanner">
      <template>
        <q-banner inline-actions dense class="text-white text-center bg-red">
          File format that you want to download is incorrect. Please select a
          video file.
        </q-banner>
      </template>
    </div>
    <div class="step-buttons">
      <a class="cancel-btn" @click="$router.push('/feed')">Cancel</a>
      <a class="share-btn" @click="showEmoji">
        <span v-if="post.emoji === ''">Add Emoji</span>
        <span class="emoji video-add-emoji" v-else v-html="post.emoji" />
      </a>
      <q-dialog
        v-model="showEmojiBool"
        transition-show="slide-up"
        transition-hide="slide-down"
        position="bottom"
      >
        <VEmojiPicker @select="selectEmoji" />
      </q-dialog>
      <a class="share-btn" @click="addToFeed">Share</a>
    </div>
    <div class="wrapper">
      <div class="adder-wrapper">
        <div class="selected-video">
          <video ref="video" width="480" controls>
            <q-resize-observer @resize="onResize" />
            <source :src="post.videoUrl" type="video/mp4" />
            <source :src="post.videoUrl" type="video/ogg" />
            <source :src="post.videoUrl" type="video/webm" />
          </video>
        </div>
        <div class="caption-container">
          <textarea ref="textarea" maxlength="128" placeholder="Write a caption..." type="text"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { uploadMedia } from '../../services/posts'
import VEmojiPicker from 'v-emoji-picker'

export default {
  name: 'AddPost',
  data () {
    return {
      dialog: true,
      hourGlass: false,
      showBanner: false,
      showEmojiBool: false,
      post: {
        videoUrl: '',
        tags: [],
        caption: '',
        emoji: '',
        likes: [],
        likesCount: 0
      }
    }
  },
  components: {
    VEmojiPicker
  },
  updated () {
    if (!this.dialog && this.post.videoUrl === '') {
      this.$router.push('/feed')
    }
  },
  methods: {
    ...mapActions('posts', ['addPostAction']),
    showEmoji () {
      this.showEmojiBool = !this.showEmojiBool
    },
    selectEmoji (emoji) {
      this.post.emoji = emoji.data
      this.showEmojiBool = !this.showEmojiBool
    },
    showNotif (position) {
      this.$q.notify({
        message: `<span style="font-size:1.3em;">Please, add an emoji to describe your post</span>`,
        color: 'primary',
        position,
        html: true,
        actions: [
          { label: 'Add emoji', color: 'yellow', handler: () => { this.showEmoji() } },
          { label: 'Cancel', color: 'accent', handler: () => { this.$router.push('/feed') } }
        ]
      })
    },
    async addToFeed () {
      if (this.post.emoji === '') {
        this.showNotif('center')
        return
      }

      let captionArr = this.$refs.textarea.value.split(' ')
      captionArr.forEach((el) => {
        if (el.match(/#\w+/)) {
          el = el.slice(1)
          this.post.tags.push(el)
        }
      })

      this.post.caption = this.$refs.textarea.value
      this.addPostAction(this.post)
      this.$router.push('/feed?tab=followings')
    },
    async uploadVideo (e) {
      const files = e.target.files
      if (!files.length) return
      if (files[0].type.match(/video..../gi)) {
        const formData = new FormData()
        formData.append('file', files[0])
        try {
          this.hourGlass = true
          const type = 'single-video'
          const videoUrl = await uploadMedia(formData, type)
          this.post.videoUrl = videoUrl.data.videoUrl
          this.$refs.video.src = this.post.videoUrl
          this.dialog = false
        } catch (err) {
          return err
        }
      } else {
        this.showBanner = true
        setTimeout(() => {
          this.showBanner = false
          this.$refs.input.value = ''
        }, 5000)
      }
    },
    onResize () {
      if (this.$refs.video.videoHeight > this.$refs.video.videoWidth) {
        this.$refs.video.height = '270'
      }
    }
  },
  computed: {
    ...mapGetters('posts', ['getPosts']),
    ...mapGetters('authentication', ['getToken'])
  }
}
</script>

<style lang="scss" scoped>
.caption-container {
  height: auto;
  display: flex;
  textarea {
    border: 0;
    font-size: 1rem;
    width: 100%;
    padding: 10px;
  }
  textarea:focus {
    outline: 0;
  }
}
#modal-window {
  width: 320px;
  position: absolute;
  top: 25%;
}
.inputfile {
  display: none;
}
#hour-glass {
  position: absolute;
  left: 43%;
  right: 57%;
}

#chip .q-banner {
  z-index: 9999;
  position: absolute;
  width: 100%;
  top: 0;
}

#modal-window .q-card__section {
  height: 70px;
}
#modal-window .q-bar {
  background: #87e0f5;
}
#modal-window label p {
  background: #87e0f5;
  padding: 10px;
  margin: auto;
  border-radius: 10px;
  width: 115px;
}
.wrapper {
  padding: 7px;
  margin-top: -40px;
}
.adder-wrapper {
  width: fit-content;
  margin: 50px auto 0;
  background: #87e0f5;
  border-radius: 11px;
  box-shadow: 1px 1px 18px;
  padding: 7px;
}
.selected-video {
  max-width: 480px;
  video {
    width: 100%;
    background: #000;
  }
}
.step-buttons {
  margin-top: 20px;
  display: flex;
  align-items: center;
  padding: 0 66px;
  justify-content: space-between;
  .cancel-btn,
  .share-btn {
    padding: 7px;
    font-size: 1rem;
    background: #87e0f5;
    border-radius: 10px;
    box-shadow: 1px 1px 10px;
    cursor: pointer;
  }
}
</style>
