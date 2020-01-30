import { isAuthorized } from '@/services/Authorized.js'

export const authModalMixin = {
  data () {
    return {
      scrollInfo: {},
      showLoginPage: false,
      isAuthenticated: false
    }
  },
  async mounted () {
    try {
      const auth = await isAuthorized()
      this.isAuthenticated = auth
    } catch (e) {
      this.isAuthenticated = false
    }
  },
  methods: {
    onScroll (info) {
      if (!this.isAuthenticated && info.position > 5000) {
        this.showLoginPage = true
      }
    }
  }
}
