module.exports = {
  babel: {
    presets: [],
    plugins: ["macros"],
    loaderOptions: (babelLoaderOptions, { env, paths }) => {
      return babelLoaderOptions
    },
  },
}
