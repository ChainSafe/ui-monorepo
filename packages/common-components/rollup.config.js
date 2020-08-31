import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import peerDepsExternal from "rollup-plugin-peer-deps-external"
import typescript from "rollup-plugin-typescript2"
import svgr from "@svgr/rollup"
import url from "rollup-plugin-url"
import babel from "rollup-plugin-babel"

export default {
  input: "./src/index.ts",
  output: {
    format: "esm", // needs to be esm format as Onboard.js contains code-splitting
    dir: "dist/",
    exports: "named",
    sourcemap: true,
    strict: false,
  },
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript(),
    url(),
    svgr(),
    babel({
      exclude: "node_modules/**",
      presets: ["@babel/preset-react", "@babel/preset-env"],
      plugins: ["emotion"],
    }),
  ],
  external: ["react", "react-dom"],
}
