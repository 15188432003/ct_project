const TransformPages = require("uni-read-pages");
const { webpack } = new TransformPages();
const path = require("path");

const vueConfig = {
  // publicPath: "/", // 基本路径
  outputDir: "dist", // 输出文件目录
  // 端口
  devServer: {
    // development server port 8000
    disableHostCheck: true,
    port: 8081,
    https: false,
    // If you want to turn on the proxy, please remove the mockjs /src/main.jsL11
    proxy: {
      "/api": {
        // target: "https://design-your-own.rokitlife.com/api",
        target: "https://rokit-v.c2matica.com/api",
		// target: "https://design-your-own.rokitlife.com:56678/api",
		// target: "http://192.168.1.232:56688/api",
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/",
        },
      },
    },
  },
  // webpack配置
  chainWebpack: (config) => {
    config.optimization.minimizer("terser").tap((args) => {
      Object.assign(args[0].terserOptions.compress, {
        // 生产模式 console.log 去除
        warnings: false, // 默认 false
        drop_console: true,
        drop_debugger: true, // 默认也是true
        pure_funcs: ["console.log"],
      });
      // 去掉注释 如果需要看chunk-vendors公共部分插件，可以注释掉就可以看到注释了
      args[0].terserOptions.output = {
        comments: false,
      };
      return args;
    });
    // 拆包
    config.optimization.splitChunks({
      chunks: "async",
      maxInitialRequests: Infinity,
      minSize: 300000, // 依赖包超过300000bit将被单独打包
      automaticNameDelimiter: "-",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];
            return `chunk.${packageName.replace("@", "")}`;
          },
          priority: 10,
        },
      },
    });

    // if (isProd) {
    //   config.plugin("html").tap((args) => {
    //     args[0].cdn = assetsCDN;
    //     return args;
    //   });
    // }
  },
  productionSourceMap: false,

  // babel-loader no-ignore node_modules/*
  transpileDependencies: [],

  pluginOptions: {
    windicss: {},
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        ROUTES: webpack.DefinePlugin.runtimeValue(() => {
          const tfPages = new TransformPages({
            includes: ["path", "name", "aliasPath", "redirect", "style"],
          });
          return JSON.stringify(tfPages.routes);
        }, true),
      }),
    ],
  },
};

module.exports = vueConfig;
