import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import peerDepsExternal from "rollup-plugin-peer-deps-external"
import typescript from "rollup-plugin-typescript2"
import svg from "rollup-plugin-svg"

export default {
  input: "./src/index.ts",
  output: {
    format: "esm", // needs to be esm format as Onboard.js contains code-splitting
    dir: "dist/",
    exports: "named",
    sourcemap: true,
    strict: false,
  },
  plugins: [peerDepsExternal(), resolve(), commonjs(), typescript(), svg()],
  external: ["react", "react-dom"],
}
