<template>
  <div>
    <q-dialog v-model="info.show" :position="position">
      <q-card>
        <q-bar class="dialog-header text-white">
          <div class="text-h6">Likes</div>
          <q-space />

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-list>
          <q-item v-for="like in getLikes" :key="like.id" class="q-my-sm" clickable>
            <q-item-section avatar @click="$router.push({ path: `/profile/${like.profile_id}` })">
              <q-avatar
                color="primary"
                text-color="white"
                :icon="like.avatarUrl.length === 0 ? 'account_circle' : null"
                font-size="1em"
              >
                <img v-if="like.avatarUrl.length > 0" :src="like.avatarUrl" />
              </q-avatar>
            </q-item-section>

            <q-item-section @click="$router.push({ path: `/profile/${like.profile_id}` })">
              <q-item-label>{{ like.nickname }}</q-item-label>
              <q-item-label caption lines="1">{{ like.date | dateFromNow }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-btn
                :class="followedUser(like.userId)?'unfollow-btn' : 'follow-btn'"
                v-if="showFollowUnfollowBtn(like.userId)"
                @click="updateFollowStatus(like.userId)"
                unelevated
                rounded
                size="sm"
                :label="followedUser(like.userId)?'Unfollow' : 'Follow'"
              />
            </q-item-section>
          </q-item>
        </q-list>

        <q-card-actions>
          <q-btn
            label="CLOSE LIST"
            style="background:#4db6ac;"
            color="#fff"
            class="full-width"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'

export default {
  props: ["info"],
  data () {
    return {
      position: (document.body.offsetWidth < 700) ? 'bottom' : 'right'
    }
  },
  computed: {
    ...mapGetters(
      {
        myProfile: 'profile/myProfile',
        getLikes: 'getLikes'
      }
    ),
    profileId () {
      return localStorage.getItem('profileId')
    }
  },
  created () {
    this.getLikedList(this.info.postId)
  },
  methods: {
    ...mapActions(['getLikedList', 'updateList']),
    showFollowUnfollowBtn (userId) {
      return !(userId === this.profileId)
    },
    followedUser (userId) {
      const arr = this.myProfile.followingsId
      for (let key in arr) {
        if (arr[key] === userId) {
          return 1
        }
      }
      return 0
    },
    ...mapActions({ uploadProfileAction: 'profile/uploadProfileAction' }),
    changeFollowStatus () {
      let action = this.isFollowing ? 'unfollow' : 'follow'
      this.uploadProfileAction({ action: action, id: this.profileId })
      this.isFollowing = !this.isFollowing
    },
    updateFollowStatus (userId) {
      const arr = this.myProfile.followingsId
      let action = 'follow'
      for (let key in arr) {
        if (arr[key] === userId) {
          action = 'unfollow'
        }
      }
      this.uploadProfileAction({ action: action, id: userId })
      // this.info.show = false
    }
  },
  filters: {
    dateFromNow (date) {
      return moment(parseInt(date)).fromNow()
    }
  }
}
</script>
<style lang="scss" scoped>
.q-bar {
  background: #4db6ac;
}
.fa-heart {
  font-size: 1.2em;
  color: #e91e63;
}
.follow-btn {
  background: #4db6ac;
  color: #fff;
}
.unfollow-btn {
  color: #333;
  border-color: #13c4c4;
  border: 1px solid #13c4c4;
}
</style>
