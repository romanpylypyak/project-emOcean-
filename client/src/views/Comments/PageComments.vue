<template>
  <q-dialog v-model="test" @input="todo">
    <q-card ref="pageChat">
      <q-card-section>
        <div class="q-pa-md justify-end">
          <div class="column">
            <div>
              <div v-for="(comment, key) in comments[id]" :key="key" class="row no-wrap">
                <q-chat-message
                  v-if="!comment.editMode"
                  :bg-color="whoseComment(comment)"
                  :name="comment.from"
                  :edit="comment.editMode"
                  :userId="comment.userId"
                  :text="[comment.text]"
                  :avatar="
                    comment.avatarUrl ||
                      'https://gravatar.com/avatar/b3039c752ac3531fa9012afec6e43162?s=400&d=mp&r=x'
                  "
                  :stamp="comment.postTime"
                />
                <div v-if="!comment.editMode" class="column justify-center q-mt-sm">
                  <div
                    v-if="comment.userId === myProfile.userId"
                  >
                    <q-btn
                      @click="deleteComment(comment, key)"
                      flat
                      round
                      color="accent"
                      icon="delete"
                      size="xs"
                    />
                  </div>
                  <div
                    v-if="comment.userId === myProfile.userId"
                  >
                    <q-btn
                      @click="editComment(comment, key)"
                      flat
                      round
                      color="accent"
                      icon="edit"
                      size="xs"
                    />
                  </div>
                </div>
                <div v-if="comment.editMode" class="row q-mt-sm">
                  <q-input
                    @keyup.enter="updateComment(comment, key)"
                    type="text"
                    v-model="comment.text"
                  />
                  <q-btn
                    @click="updateComment(comment, key)"
                    flat
                    round
                    color="accent"
                    icon="done"
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <q-item elevated>
          <q-toolbar class="bg-cyan">
            <q-input
              v-model="newComment"
              ref="newComment"
              bg-color="white"
              outlined
              rounded
              placeholder="Comment"
              dense
              @keyup.enter="sendComment"
              class="full-width"
            >
              <template v-slot:after>
                <q-btn
                  @click="sendComment"
                  round
                  dense
                  flat
                  type="submit"
                  color="white"
                  icon="send"
                />
              </template>
            </q-input>
          </q-toolbar>
        </q-item>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  props: ['isModelVisible', 'closePopup', 'id'],
  data () {
    return {
      newComment: '',
      test: false,
      showComment: false
    }
  },
  computed: {
    ...mapState('comments', ['messages', 'userDetails']),
    ...mapGetters({ myProfile: 'profile/myProfile' }),
    ...mapGetters({ comments: 'comments/myComments' })
  },
  methods: {
    ...mapActions('comments', [
      'firebaseGetComments',
      'firebaseStopGettingComments',
      'firebaseSendComment',
      'firebaseDeleteComment',
      'firebaseEditComment'
    ]),
    todo (evt) {
      if (evt === false) {
        this.closePopup(evt)
      }
    },
    sendComment () {
      if (this.newComment !== '') {
        this.firebaseSendComment({
          comment: {
            text: this.newComment,
            from: this.myProfile.nickname,
            userId: this.myProfile.userId,
            avatarUrl: this.myProfile.avatarUrl,
            postId: this.id,
            editMode: false,
            postTime: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })
          }
        })
      }
      this.clearComment()
    },
    clearComment () {
      this.newComment = ''
      this.$refs.newComment.$el.focus()
    },
    deleteComment (comment, key) {
      if (this.myProfile.userId === comment.userId) {
        this.firebaseDeleteComment({
          postId: comment.postId,
          id: key
        })
      }
    },
    editComment (comment, key) {
      comment.editMode = true
      console.log(key)
      console.log(comment.text)
    },
    updateComment (comment, key) {
      comment.editMode = false
      this.firebaseEditComment({
        postId: comment.postId,
        id: key,
        text: comment.text
      })
    },
    whoseComment (comment) {
      if (comment.userId === this.myProfile.userId) {
        return 'primary'
      } else {
        return 'secondary'
      }
    },
    scrollToBottom () {
      setTimeout(() => {
        if (this.$refs.pageChat) {
          let pageChat = this.$refs.pageChat.$el
          pageChat.scrollTo(0, pageChat.scrollHeight)
        }
      }, 20)
    }
  },
  watch: {
    isModelVisible: function (val) {
      this.test = val
    }
  },
  mounted () {
    this.firebaseGetComments(this.id)
  },
  destroyed () {
    this.firebaseStopGettingComments()
  }
}
</script>

<style></style>
