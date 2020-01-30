<template>
  <div>
    <p v-if="list.length===0">You have no blacklisted users yet.</p>
    <ul v-else>
      <li v-for="(element, i) in list" :key="i">
        <div class="row justify-between">
          <q-avatar class="column items-start">
            <avatar size="50px" :img="element.avatar" />
          </q-avatar>
          <div class="column items-center">
            <p>{{element.nickname}}</p>
          </div>
          <div class="column items-end">
            <q-btn
              class="unblock-button"
              color="teal"
              label="Unblock"
              @click="$emit('unblock', element.id)"
            />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Avatar from '@/components/Avatar.vue'
export default {
  name: 'BlockedList',
  components: {
    Avatar
  },
  props: ['list'],
  data () {
    return {
      photoUrl: ''
    }
  },
  computed: {
    isNewAvatarSelected () {
      return this.photoUrl !== ''
    }
  }
}
</script>

<style scoped>
.avatar-image {
  object-fit: cover;
}
ul,
li {
  padding: 0;
  margin: 0;
}
.unblock-button {
  max-height: 30px;
}
</style>
