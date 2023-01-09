import { defineConfig, loadEnv } from "vite";
import viteChecker from "vite-plugin-checker";
import { createHtmlPlugin } from "vite-plugin-html";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, __dirname, "") };

  const checker = viteChecker({
    typescript: true,
    // eslint: {
    //   lintCommand: "eslint",
    // },
  });

  const htmlPlugin = createHtmlPlugin({
    inject: {
      data: {
        appName:
          env.NODE_ENV === "production" ? "Telegram Web" : "Telegram Web Beta",
        appleIcon:
          env.NODE_ENV === "production"
            ? "apple-touch-icon"
            : "apple-touch-icon-dev",
        mainIcon:
          env.NODE_ENV === "production" ? "icon-192x192" : "icon-dev-192x192",
        manifest:
          env.NODE_ENV === "production"
            ? "site.webmanifest"
            : "site_dev.webmanifest",
        baseUrl: "https://web.telegram.org/z/",
      },
    },
  });

  return {
    plugins: [checker, htmlPlugin],
    assetsInclude: [
      /\.(woff(2)?|ttf|eot|svg|png|jpg|tgs)(\?v=\d+\.\d+\.\d+)?$/,
      /\.wasm$/,
      /\.(txt|tl)$/i,
    ],
    worker: { format: "es" },
    server: {
      open: true,
      host: true,
      hmr: {
        overlay: true,
      },
    },
  };
});
