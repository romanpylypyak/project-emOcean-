<template>
  <div>
    <q-footer>
      <q-tabs>
        <q-route-tab v-for="(tab, key) in tabs" :key="key" :to="tab.to">
          <q-icon :name="tab.icon" size="1.5em" />
        </q-route-tab>
      </q-tabs>
    </q-footer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tabs: [
        {
          icon: 'videocam',
          to: '/Feed'
        },
        {
          icon: 'add_circle_outline',
          to: '/AddPost'
        },
        {
          icon: 'notifications',
          to: '/notifications'
        },
        {
          icon: 'tag_faces',
          to: `/profile/${localStorage.getItem('profileId')}`
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.q-footer {
  background: #00bcd4;
  .q-icon {
    color: #fff;
  }
}
@media screen and (min-width: 700px) {
  .q-footer {
    display: none;
  }
}
</style>
