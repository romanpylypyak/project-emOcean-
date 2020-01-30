<template>
  <q-item class="follow-item" v-if="item">
    <q-item-section avatar>
      <avatar
        class="follow-avatar"
        :img="item.avatarUrl"
        :size="'30'"
      />
    </q-item-section>

    <q-item-section>
      <q-item-label class="name">
        <router-link :to="{ name: 'profile', params: { nickname: item.nickname }}">
          <strong>{{ item.nickname }}</strong>
        </router-link>
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <FollowButton class="follow-btn" v-if="currentUserId !== item.userId" :id="item.userId"
        :following="
          (myProfile.followingsId &&
           myProfile.followingsId.includes(item.userId))">
      </FollowButton>
    </q-item-section>
  </q-item>
</template>

<script>
import FollowButton from '../Profile/Card/followBtn'
import Avatar from '../../components/Avatar'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    FollowButton,
    Avatar
  },
  props: {
    item: Object
  },
  computed: {
    ...mapGetters({ myProfile: 'profile/myProfile' }),
    currentUserId () {
      return localStorage.getItem('profileId')
    }
  },
  methods: {
    ...mapActions({
      getMyProfile: 'profile/getMyProfile'
    })
  }
}
</script>

<style>
</style>
