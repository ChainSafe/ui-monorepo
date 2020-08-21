module.exports = {
  stories: ["../src/stories/*.stories.tsx"],
  addons: [
    "@storybook/addon-actions",
    "@storybook/addon-links",
    "@storybook/addon-contexts/register",
    "@storybook/preset-typescript",
    "@storybook/addon-knobs",
  ],
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve("ts-loader"),
        },
      ],
    })
    config.resolve.extensions.push(".ts", ".tsx")

    // use svgr for svg files
    config.module.rules.unshift({
      test: /\.svg$/,
      use: ["@svgr/webpack", "url-loader"],
    })

    return config
  },
}
