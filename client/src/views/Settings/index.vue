<template>
  <div>
    <settings-menu></settings-menu>
  </div>
</template>

<script>
import SettingsMenu from './SettingsMenu.vue'
import { isAuthorized } from '@/services/Authorized.js'

export default {
  name: 'SettingsPage',
  components: {
    SettingsMenu
  },
  beforeRouteEnter: (to, from, next) => {
    isAuthorized()
      .then(res => {
        if (!res) {
          return next('/login')
        }
        if (to.path === '/settings') {
          return next('/settings/editProfile')
        }
        next()
      })
      .catch(() => {
        return next('/login')
      })
  }
}
</script>
