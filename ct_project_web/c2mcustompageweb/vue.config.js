//const isProd = process.env.NODE_ENV === "production";
const path = require("path");
const webpack = require("webpack");
const autoprefixer = require("autoprefixer");
//const pxtorem = require("postcss-pxtorem");
const pxtovw = require("postcss-px-to-viewport");
// gzip
// const CompressionWebpackPlugin = require("compression-webpack-plugin");
// const productionGzipExtensions = ["js", "css"];

const buildDate = JSON.stringify(new Date().toLocaleString());

function resolve(dir) {
  return path.join(__dirname, dir);
}

// const assetsCDN = {
//   // webpack build externals
//   externals: {
//     vue: "Vue",
//     "vue-router": "VueRouter",
//     vuex: "Vuex",
//     // axios: "axios",
//   },
//   css: [],
//   // https://unpkg.com/browse/vue@2.6.10/
//   js: [
//     "//cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js",
//     "//cdn.jsdelivr.net/npm/vue-router@3.5.1/dist/vue-router.min.js",
//     "//cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.min.js",
//     "//cdn.jsdelivr.net/npm/axios@0.21.1/dist/axios.min.js",
//   ],
// };

const vueConfig = {
  publicPath: "./", // 基本路径
  outputDir: "dist", // 输出文件目录
  lintOnSave: false, // eslint-loader 是否在保存的时候检查

  configureWebpack: {
    // webpack plugins
    plugins: [
      /* [file]被替换为原始资产文件名。
          [path]替换为原始资产的路径。
          [dir]替换为原始资产的目录。
          [name]被替换为原始资产的文件名。
          [ext]替换为原始资产的扩展名。
          [query]被查询替换。
      */
      // new CompressionWebpackPlugin({
      //   // filename: "[path].gz[query]",
      //   // 压缩算法
      //   algorithm: "gzip",
      //   // 匹配文件
      //   // test: /\.js$|\.css$|\.html$/,
      //   test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),

      //   //压缩超过此大小的文件,以字节为单位
      //   threshold: 10240,
      //   minRatio: 0.8,
      //   //删除原始文件只保留压缩后的文件
      //   deleteOriginalAssets: true,
      // }),
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.DefinePlugin({
        APP_VERSION: `"${require("./package.json").version}"`,
        // GIT_HASH: JSON.stringify(getGitHash()),
        BUILD_DATE: buildDate,
      }),
    ],
    // if prod, add externals
    // externals: isProd ? assetsCDN.externals : {},
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
    // 别名配置
    config.resolve.alias.set("@$", resolve("src"));
    // 拆包
    config.optimization.splitChunks({
      automaticNameDelimiter: "-",
      cacheGroups: {
        vendors: {
          name: "chunk-vendors",
          minChunks: 4,
          test: /node_modules/,
          priority: -10,
          chunks: "initial",
        },
        common: {},
      },
    });

    // if (isProd) {
    //   config.plugin("html").tap((args) => {
    //     args[0].cdn = assetsCDN;
    //     return args;
    //   });
    // }
  },

  css: {
    loaderOptions: {
      less: {
        // modifyVars: {
        //   // less vars，customize ant design theme

        //   // 'primary-color': '#F5222D',
        //   // 'link-color': '#F5222D',
        //   'border-radius-base': '4px'
        // },
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true,
      },
      postcss: {
        plugins: [
          autoprefixer(),
          new pxtovw({
            unitToConvert: "px", //需要转换的单位，默认为"px"；
            viewportWidth: 1920, //设计稿的视口宽度
            unitPrecision: 5, //单位转换后保留的小数位数
            propList: ["*"], //要进行转换的属性列表,*表示匹配所有,!表示不转换
            viewportUnit: "vw", //转换后的视口单位
            fontViewportUnit: "vw", //转换后字体使用的视口单位
            selectorBlackList: [], //不进行转换的css选择器，继续使用原有单位
            minPixelValue: 1, //设置最小的转换数值
            mediaQuery: false, //设置媒体查询里的单位是否需要转换单位
            replace: true, //是否直接更换属性值，而不添加备用属性
            exclude: [/node_modules/], //忽略某些文件夹下的文件
          }),
        ],
      },
    },
  },
  // 端口

  //
  devServer: {
    // development server port 8000
    disableHostCheck: true,
    port: 8001,

    https: false,
    // If you want to turn on the proxy, please remove the mockjs /src/main.jsL11
    proxy: {
      "/api": {
        target: "https://rokit-v.c2matica.com/api",
        // target: "https://design-your-own.rokitlife.com/api",
        // target: process.env.VUE_APP_API_PROXY,
        // target: "https://design-your-own.rokitlife.com:56678/api",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/",
        },
      },
    },
  },
  productionSourceMap: false,

  // babel-loader no-ignore node_modules/*
  transpileDependencies: [],

  pluginOptions: {
    windicss: {},
  },
};

module.exports = vueConfig;
