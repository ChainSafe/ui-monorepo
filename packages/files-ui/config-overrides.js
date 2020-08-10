const path = require('path')
const fs = require('fs')
const {
  override,
  fixBabelImports,
  addLessLoader,
  addWebpackPlugin,
  addWebpackModuleRule
} = require('customize-cra')
const AntDesignThemePlugin = require('antd-theme-webpack-plugin')
// const AntDesignThemePlugin = require("../../index");
const { getLessVars } = require('antd-theme-generator')

// const themeVariables = getLessVars(path.join(__dirname, './src/assets/styles/vars.less'))
// const defaultVars = getLessVars('./node_modules/antd/lib/style/themes/default.less')

const lightVars = {
  ...getLessVars('./node_modules/antd/lib/style/themes/default.less'),
  ...getLessVars('./src/assets/styles/light.less')
}
const darkVars = {
  ...getLessVars('./node_modules/antd/lib/style/themes/dark.less'),
  ...getLessVars('./src/assets/styles/dark.less')
}

// fs.writeFileSync('./src/assets/styles/dark.json', JSON.stringify(darkVars));
// fs.writeFileSync('./src/assets/styles/light.json', JSON.stringify(lightVars));

const options = {
  stylesDir: path.join(__dirname, './src/assets/styles'),
  antDir: path.join(__dirname, './node_modules/antd'),
  varFile: path.join(__dirname, './src/assets/styles/vars.less'),
  themeVariables: Array.from(
    new Set([
      ...Object.keys(darkVars),
      ...Object.keys(lightVars)
      // ...Object.keys(themeVariables),
    ])
  ),
  generateOnce: false // generate color.less on each compilation
}

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true
  }),
  addWebpackPlugin(new AntDesignThemePlugin(options)),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: {
        '@primary-color': '#262626', // primary color for all components
        '@link-color': '#262626', // link color
        '@success-color': '#52c41a', // success state color
        '@warning-color': '#faad14', // warning state color
        '@error-color': '#f5222d', // error state color
        '@font-size-base': '14px', // major text font size
        '@heading-color': 'rgba(0, 0, 0, 0.85)', // heading text color
        '@text-color': 'rgba(0, 0, 0, 0.65)', // major text color
        '@text-color-secondary': 'rgba(0, 0, 0, 0.45)', // secondary text color
        '@disabled-color': 'rgba(0, 0, 0, 0.25)', // disable state color
        '@border-radius-base': '4px', // major border radius
        '@border-color-base': '#d9d9d9', // major border color
        '@box-shadow-base': '0 2px 8px rgba(0, 0, 0, 0.15)',
        '@menu-dark-item-active-bg': '#161616',
        '@menu-bg': '#F5F5F5',
        '@menu-item-active-bg': '#D5D5D5',

        '@btn-default-color': '@primary-color',
        '@btn-default-border': '@primary-color',
        // pixels
        '@menu-item-padding': '0 20px 0 32px'
      }
    }
  }),
  addWebpackModuleRule({
    test: /\.svg$/,
    use: ['@svgr/webpack']
  })
)

// apply changes directly

// const { override, fixBabelImports, addLessLoader } = require('customize-cra');

// module.exports = override(
//   fixBabelImports('import', {
//     libraryName: 'antd',
//     libraryDirectory: 'es',
//     style: true,
//   }),
//   addLessLoader({
//     lessOptions: {
//       javascriptEnabled: true,
//       modifyVars: {
//         "@primary-color": "#262626", // primary color for all components
//         "@link-color": "#262626", // link color
//         "@success-color": "#52c41a", // success state color
//         "@warning-color": "#faad14", // warning state color
//         "@error-color": "#f5222d", // error state color
//         "@font-size-base": "14px", // major text font size
//         "@heading-color": "rgba(0, 0, 0, 0.85)", // heading text color
//         "@text-color": "rgba(0, 0, 0, 0.65)", // major text color
//         "@text-color-secondary": "rgba(0, 0, 0, 0.45)", // secondary text color
//         "@disabled-color": "rgba(0, 0, 0, 0.25)", // disable state color
//         "@border-radius-base": "4px", // major border radius
//         "@border-color-base": "#d9d9d9", // major border color
//         "@box-shadow-base": "0 2px 8px rgba(0, 0, 0, 0.15)",
//         "@menu-dark-item-active-bg": "#161616",
//         "@menu-bg": "#F5F5F5",
//         "@menu-item-active-bg": "#D5D5D5",

//         "@btn-default-color": "@primary-color",
//         "@btn-default-border": "@primary-color",
//         // pixels
//         "@menu-item-padding": "0 20px 0 32px"
//       }
//     }
//   }),
// );
