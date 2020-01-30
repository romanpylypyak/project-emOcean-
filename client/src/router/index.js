import Vue from 'vue'
import VueRouter from 'vue-router'
import Error404 from '../views/Error404/Error404.vue'
import Feed from '../views/Feed/Feed'
import AddPost from '../views/Feed/AddPost'

Vue.use(VueRouter)

const routes = [
  {
    path: '/feed',
    name: 'Feed',
    component: Feed,
    alias: '/'
  },
  {
    path: '/addpost',
    name: 'Addpost',
    component: AddPost
  },
  {
    path: '/profile/:nickname',
    props: true,
    name: 'profile',
    component: () => import('../views/Profile/index.vue')
  },
  {
    path: '/profile/:nickname/follow',
    name: 'followPage',
    props: true,
    component: () => import('../views/FollowList/index.vue')
  },
  {
    path: "/comments",
    name: "comments",
    component: () => import("../views/Comments/PageComments.vue")
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings/index.vue'),
    children: [
      {
        path: 'editProfile',
        component: () => import('../views/Settings/Tabs/EditProfile/index.vue')
      },
      {
        path: 'editPreferences',
        component: () => import('../views/Settings/Tabs/EditPreferences/index.vue')
      },
      {
        path: 'changePassword',
        component: () => import('../views/Settings/Tabs/ChangePassword/index.vue')
      },
      {
        path: 'editPrivacy',
        component: () => import('../views/Settings/Tabs/EditPrivacy/index.vue')
      },
      {
        path: 'deleteAccount',
        component: () => import('../views/Settings/Tabs/DeleteAccount/index.vue')
      }
    ]
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Authentication/AuthRegister.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Authentication/AuthLogin.vue')
  },
  {
    path: '/forgotpassword',
    name: 'Forgot Password',
    component: () => import('../views/Authentication/AuthForgot.vue')
  },
  {
    path: '/emailAction',
    name: 'Reset Password',
    component: () => import('../views/Authentication/AuthEmailAction.vue')
  },
  {
    path: '*',
    name: 'Error',
    component: Error404
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
