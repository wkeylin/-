const path = require('path')
const { version } = require('./package.json')

const svgSpriteDirs = [
  path.resolve(__dirname, 'src/svg/'),
  require.resolve('antd').replace(/index\.js$/, '')
]

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
      "target": "http://10.10.1.40:6060",
      "changeOrigin": true,
      "pathRewrite": { "^/shop": "/shop" }
    },
    "/dishMenu": {
      "target": "http://10.10.1.40:6060",
      "changeOrigin": true,
      "pathRewrite": { "^/dishMenu": "/dishMenu" }
    },
    "/dishUnit": {
      "target": "http://10.10.1.40:6060",
      "changeOrigin": true,
      "pathRewrite": { "^/dishUnit": "/dishUnit" }
    },
    "/recipe": {
      "target": "http://10.10.1.40:6060",
      "changeOrigin": true,
      "pathRewrite": { "^/recipe": "/recipe" }
    },
    "/supply": {
      "target": "http://10.10.1.40:6060",
      "changeOrigin": true,
      "pathRewrite": { "^/supply": "/supply" }
    },
    "/suppUnit": {
      "target": "http://10.10.1.40:6060",
      "changeOrigin": true,
      "pathRewrite": { "^/suppunit" : "/suppunit" }
    },
    "/shop": {
      "target": "http://10.10.1.40:6060",
      "changeOrigin": true,
      "pathRewrite": { "^/shop" : "/shop" }
    },
    "/dishBomMenu": {
      "target": "https://www.easy-mock.com/mock/5b6d1d3074f31821884d5240",
      "changeOrigin": true,
      "pathRewrite": { "^/dishBomMenu" : "/dishBomMenu" }
    },
    "/dish": {
      "target": "http://10.10.1.40:6060",
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
