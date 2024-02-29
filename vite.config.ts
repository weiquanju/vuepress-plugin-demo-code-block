import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

const transFileName = (format, entryName) => {
  const map: Record<string, "cjs" | "mjs"> = {
    commonjs: "cjs",
    cjs: "cjs",
    es: "mjs",
    esm: "mjs",
  };
  if (entryName === "index") {
    return `${entryName}.${map[format]}`;
  } else {
    return `${entryName}/index.${map[format]}`;
  }
};
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
    outDir: "dist",
    lib: {
      entry: {
        index: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
      },
      name: "v-el-table",
      formats: ["es", "cjs"],
      fileName: transFileName,
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: [
        /^@?vue/i,
        /^markdown-it/i,
        "escape-html",
        "chalk",
        "chokidar",
        "prismjs",
      ],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: "Vue",
          vuepress: "Vuepress",
          "escape-html": "EscapeHtml",
          "markdown-it-container": "MarkdownItContainer",
          "markdown-it": "MarkdownIt",
          chalk: "Chalk",
          prismjs: "Prismjs",
          chokidar: "Chokidar",
        },
        exports: "named",
      },
    },
  },
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
  },
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
