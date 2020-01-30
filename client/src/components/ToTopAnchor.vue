<template>
  <div v-if="showAnchor" class="toTopAnchor" @click="backToHeader">
    <i class="fas fa-arrow-up"></i>
  </div>
</template>

<script>

export default {
  data () {
    return {
      showAnchor: false,
      scrollLimit: 150
    }
  },
  mounted () {
    window.addEventListener('scroll', this.onScroll)
  },
  methods: {
    backToHeader () {
      let header = document.getElementById("main-header")
      header.scrollIntoView({ behavior: "smooth" })
    },
    onScroll () {
      let currentScrollPosition = window.pageYOffset
      this.showAnchor = currentScrollPosition > this.scrollLimit
    }
  }
}
</script>

<style scoped lang="scss">
.toTopAnchor {
  cursor: pointer;
  height: 50px;
  width: 50px;
  position: fixed;
  bottom: 40px;
  right: 25px;
  border-radius: 50px;
  border: 4px solid #4319c3;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease 0s;
  @media only screen and (max-width: 1023px) {
    display: none;
  }
  &:hover {
    border-color: #ce4d44;
  }
  &:hover .fas {
    color: #ce4d44;
  }
  .fa-arrow-up {
    color: #4319c3;
    font-size: 22px;
    transition: all 0.3s ease 0s;
  }
}
</style>
