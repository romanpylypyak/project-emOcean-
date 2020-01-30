export const notificationMixin = {
  methods: {
    showNotif (message) {
      this.$q.notify({
        color: 'white',
        textColor: 'primary',
        message: message,
        actions: [{ icon: 'close', color: 'primary' }],
        timeout: 3000
      })
    }
  }
}
