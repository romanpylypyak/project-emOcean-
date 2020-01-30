module.exports = {
  pluginOptions: {
    quasar: {
      rtlSupport: true,
      treeShake: true
    }
  },
  transpileDependencies: [/[\\/]node_modules[\\/]quasar[\\/]/],
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "quasar/dist/quasar.sass";
        `
      }
    }
  }
}
