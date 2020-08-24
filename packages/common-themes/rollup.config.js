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
    format: "esm", // needs to be esm format as Onboard.js contains code-splitting
    dir: "dist/",
    exports: "named",
    sourcemap: true,
    strict: false,
  },
  plugins: [
    postcss(),
    peerDepsExternal(),
    typescript(),
    json(),
    resolve({
      browser: true,
      preferBuiltins: true,
    }),
    commonjs(),
    nodePolyfills(),
  ],
  external: ["react", "react-dom"],
}
