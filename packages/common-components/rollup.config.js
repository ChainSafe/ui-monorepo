import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import peerDepsExternal from "rollup-plugin-peer-deps-external"
import typescript from "rollup-plugin-typescript2"
import svgr from "@svgr/rollup"
import url from "rollup-plugin-url"
import babel from "rollup-plugin-babel"
import postcss from "rollup-plugin-postcss"
import image from "@rollup/plugin-image"

export default {
  input: "./src/index.ts",
  output: {
    format: "cjs",
    dir: "dist/",
    exports: "named",
    sourcemap: true,
    strict: true
  },
  plugins: [
    image(),
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript(),
    postcss({
      plugins: []
    }),
    url(),
    svgr(),
    babel({
      exclude: "node_modules/**",
      presets: ["@babel/preset-react", "@babel/preset-env"],
      plugins: ["emotion"]
    })
  ],
  external: [
    "react",
    "react-dom",
    "@material-ui/styles",
    "formik",
    "react-toast-notifications",
    "@chainsafe/common-theme"
  ]
}
