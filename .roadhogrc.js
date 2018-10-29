const path = require('path')
const { version } = require('./package.json')

const svgSpriteDirs = [
  path.resolve(__dirname, 'src/svg/'),
  require.resolve('antd').replace(/index\.js$/, '')
]

const host = 'http://10.10.1.40:6060';

export default {
  entry: 'src/index.js',
  svgSpriteLoaderDirs: svgSpriteDirs,
  theme: "./theme.config.js",
  publicPath: `/dist/${version}/`,
  outputPath: `./dist/${version}`,
  // 接口代理示例
  // proxy: {
  //   "/api/v1/weather": {
  //     "target": "https://api.seniverse.com/",
  //     "changeOrigin": true,
  //     "pathRewrite": { "^/api/v1/weather": "/v3/weather" }
  //   },
  //   // "/api/v2": {
  //   //   "target": "http://192.168.0.110",
  //   //   "changeOrigin": true,
  //   //   "pathRewrite": { "^/api/v2" : "/api/v2" }
  //   // }
  // },
  proxy: {
    "/shop": {
      "target": host,
      "changeOrigin": true,
      "pathRewrite": { "^/shop": "/shop" }
    },
    "/dishMenu": {
      "target": host,
      "changeOrigin": true,
      "pathRewrite": { "^/dishMenu": "/dishMenu" }
    },
    "/dishUnit": {
      "target": host,
      "changeOrigin": true,
      "pathRewrite": { "^/dishUnit": "/dishUnit" }
    },
    "/recipe": {
      "target": host,
      "changeOrigin": true,
      "pathRewrite": { "^/recipe": "/recipe" }
    },
    "/supply": {
      "target": host,
      "changeOrigin": true,
      "pathRewrite": { "^/supply": "/supply" }
    },
    "/suppUnit": {
      "target": host,
      "changeOrigin": true,
      "pathRewrite": { "^/suppunit" : "/suppunit" }
    },
    "/dishBomMenu": {
      "target": host,
      "changeOrigin": true,
      "pathRewrite": { "^/dishBomMenu" : "/dishBomMenu" }
    },
    "/dish": {
      "target": host,
      "changeOrigin": true,
      "pathRewrite": { "^/dish" : "/dish" }
    },
  },
  env: {
    development: {
      extraBabelPlugins: [
        "dva-hmr",
        "transform-runtime",
        [
          "import", {
            "libraryName": "antd",
            "style": true
          }
        ]
      ]
    },
    production: {
      extraBabelPlugins: [
        "transform-runtime",
        [
          "import", {
            "libraryName": "antd",
            "style": true
          }
        ]
      ]
    }
  },
  dllPlugin: {
    exclude: ["babel-runtime", "roadhog", "cross-env"],
    include: ["dva/router", "dva/saga", "dva/fetch"]
  }
}
