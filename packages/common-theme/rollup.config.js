import typescript from "rollup-plugin-typescript2"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import nodePolyfills from "rollup-plugin-node-polyfills"
import peerDepsExternal from "rollup-plugin-peer-deps-external"
import postcss from "rollup-plugin-postcss"
import copy from 'rollup-plugin-copy'

export default {
  input: "src/index.ts",
  output: {
    format: "cjs",
    dir: "dist/",
    exports: "named",
    sourcemap: true,
    strict: true
  },
  plugins: [
    resolve(),
    copy({
      targets: [
        { src: ["src/Defaults/fonts/font-faces.css"], dest: "dist/" },
        { src: ["src/Defaults/fonts/*.woff", "src/Defaults/fonts/*.woff2", "src/Defaults/fonts/*.ttf"], dest: "dist/" }
      ]
    }),
    typescript(),
    postcss(),
    peerDepsExternal(),
    json(),
    commonjs(),
    nodePolyfills()
  ],
  external: ["react", "react-dom", "@material-ui/styles"]
}
