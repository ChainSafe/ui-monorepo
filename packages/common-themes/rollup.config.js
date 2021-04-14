import typescript from "rollup-plugin-typescript2"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import nodePolyfills from "rollup-plugin-node-polyfills"
import peerDepsExternal from "rollup-plugin-peer-deps-external"
import postcss from "rollup-plugin-postcss"

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
    typescript(),
    postcss(),
    peerDepsExternal(),
    json(),
    commonjs(),
    nodePolyfills()
  ],
  external: ["react", "react-dom", "@material-ui/styles"]
}
