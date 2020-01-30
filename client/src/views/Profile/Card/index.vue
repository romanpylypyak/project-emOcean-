<template>
  <div class="profile-card">
    <div class="user-avatar">
      <avatar :img="profile.avatarUrl || ''" :size="'140px'" />
      <i v-if="popularAccount" class="fas fa-star" title="Popular account"></i>
    </div>
    <div class="card-content">
      <h2 class="name">{{ profile.nickname }}</h2>
      <follow-button
        v-if="currentUserId !== null && currentUserId !== profile.userId"
        :following="
          (this.myProfile.followingsId &&
            this.myProfile.followingsId.includes(profile.userId))
        "
        @update-count="updateFollowersCount"
        :id="profile.userId"
      >
      </follow-button>
      <p class="decription">{{ profile.status }}</p>
      <p class="bio" v-if="profile.bio">
        <span class="about-me">About Me:</span>
        {{profile.bio}}
      </p>
      <card-footer
        :followingsCount="profile.followingsCount"
        :followersCount="profile.followersCount"
        :socialAccounts="profile.socialAccounts"
      ></card-footer>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import CardFooter from './cardFooter'
import FollowButton from './followBtn'
import Avatar from '../../../components/Avatar'

export default {
  components: {
    CardFooter,
    FollowButton,
    Avatar
  },
  props: {
    profile: Object
  },
  data () {
    return {
      popularAccountLimit: 1
    }
  },
  computed: {
    ...mapGetters({ myProfile: 'profile/myProfile' }),
    currentUserId () {
      return localStorage.getItem('profileId')
    },
    popularAccount () {
      return this.profile.followersCount > this.popularAccountLimit
    }
  },
  async created () {
    await this.getMyProfile()
  },
  methods: {
    ...mapActions({
      getMyProfile: 'profile/getMyProfile'
    }),
    updateFollowersCount (value) {
      this.profile.followersCount = this.profile.followersCount + value
    }
  }
}
</script>

<style lang="scss" scoped>
  .profile-card {
    height: 100%;
    position: relative;
    .user-avatar {
      position: absolute;
      top: -105px;
      margin-right: -70px;
      right: 50%;
      width: 140px;
      height: 140px;
      border-radius: 50%;
      .fa-star {
        display: inline-block;
        position: absolute;
        color: gold;
        font-size: 20px;
        right: 5px;
        top: 15px;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }
    }
    .card-content {
      padding: 50px 15px 0;
      text-align: center;
      background-color: white;
      height: 100%;
      & > * {
        margin-bottom: 15px;
      }
      .name {
        font-family: "Roboto Slab", "Times New Roman", serif;
        font-weight: 700;
        font-size: 24px;
        line-height: 1.5;
      }
      .decription {
        color: #3C4857;
        font-weight: 300;
      }
      .bio {
        margin-bottom: 25px;
        .about-me {
          font-weight: 600;
          padding: 0 2px;
          font-size: 15px;
          border-bottom: 1px solid blue;
        }
      }
    }
  }
</style>
