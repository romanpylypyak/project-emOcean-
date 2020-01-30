<template>
  <div>
    <q-card class="my-card q-ma-md">
      <q-splitter
        v-model="splitterModel"
        :horizontal="horizontalAttrPosition"
        :vertical="!horizontalAttrPosition"
      >
        <template v-slot:before>
          <q-tabs
            v-model="tab"
            :horizontal="horizontalAttrPosition"
            :vertical="!horizontalAttrPosition"
            class="text-teal"
          ><q-route-tab
              v-for="(item, index) in routeItems"
              :key="index"
              :to="item.to"
              :name="item.title"
              exact
            >{{item.title}}</q-route-tab>
          </q-tabs>
        </template>

        <template v-slot:after>
          <q-tab-panels
            v-model="tab"
            animated
            transition-prev="jump-up"
            transition-next="jump-up">
            <q-tab-panel v-for="(item, index) in routeItems" :key="index" :name="item.title">
              <router-view></router-view>
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-splitter>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'settings-menu',
  data: function () {
    return {
      tab: 'mail',
      splitterModel: 25,
      routeItems: [
        { to: '/settings/editProfile', title: 'Edit profile', show: true },
        { to: '/settings/editPreferences', title: 'Preferences', show: true },
        { to: '/settings/editPrivacy', title: 'Privacy', show: true },
        { to: '/settings/changePassword', title: 'Change password', show: true },
        { to: '/settings/deleteAccount', title: 'Delete account', show: true }
      ]
    }
  },
  methods: {
  },
  computed: {
    horizontalAttrPosition () {
      return this.$q.screen.xs
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
