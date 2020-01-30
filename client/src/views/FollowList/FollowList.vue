<template>
  <q-list class="follow-list">
    <input class="followSearch" type="text" v-model="followSearch" placeholder="Search.." />
    <div v-for="item in filteredFollowList" :key="item.id" class="q-my-sm" clickable>
      <follow-item :item="item"></follow-item>
    </div>
  </q-list>
</template>

<script>
import FollowItem from './FollowItem'
export default {
  components: {
    FollowItem
  },
  props: {
    followList: Array
  },
  data () {
    return {
      followSearch: ''
    }
  },
  computed: {
    filteredFollowList () {
      return this.followList.filter(post => {
        return post.nickname.toLowerCase().includes(this.followSearch.toLowerCase())
      })
    }
  }
}
</script>

<style lang="scss">
.followSearch {
  display: block;
  margin: 0 auto;
  padding: 3px 6px;
  border: 1px solid blueviolet;
}
</style>
