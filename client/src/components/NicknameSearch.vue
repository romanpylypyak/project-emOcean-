<template>
  <div>
    <q-virtual-scroll class="virtual-scroll" :items="results">
      <template v-slot="{ item: user, index }">
        <q-item :key="index" dense clickable v-if="!errorMessage">
          <q-item-section avatar>
            <q-avatar>
              <avatar size="40px" :img="user.avatar || ''" />
            </q-avatar>
          </q-item-section>
          <router-link :to="{ name: 'profile', params: {nickname: user.nickname}}">
            <q-item-section class="col" @click="$emit('closeSearch')">{{ user.nickname }}</q-item-section>
          </router-link>
        </q-item>
        <q-item v-else>
          <q-item-section>
            <p>{{ errorMessage }}</p>
          </q-item-section>
        </q-item>
      </template>
    </q-virtual-scroll>
  </div>
</template>

<script>
import Avatar from '@/components/Avatar.vue'
export default {
  components: {
    Avatar
  },
  props: ['results'],
  computed: {
    errorMessage () {
      if (!this.results || this.results[0].error) {
        return 'No matches found'
      } else {
        return null
      }
    }
  }
}
</script>

<style scoped>
* {
  background-color: white;
}
.avatar-image {
  object-fit: cover;
}
.virtual-scroll {
  max-height: 300px;
  border: 1px solid #e0e1e1;
}
</style>
