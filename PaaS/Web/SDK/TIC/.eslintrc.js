module.exports = {
  "env": {
    "browser": true,
    "node": true,
    "es6": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 2016,
    "sourceType": "module"
  },

  "globals": {
    "wx": null,
    "App": null,
    "Page": null,
    "getApp": null,
    "Component": null,
    "define": null,
    "exports": null,
    "WebRTCAPI": false,
    "TRTC": false,
    "webim": false,
    "TEduBoard": false,
    "ActiveXObject": false,
  },


  "rules": {
    "no-empty": 'off',
    "no-unused-vars": 'off',
    "no-alert": 2,
    'no-console': 'off', // 允许在代码中保留 console 命令
    // "indent": [
    //     "error",
    //     "tab"
    // ],
    // "linebreak-style": [
    //     "error",
    //     "windows"
    // ],
    'linebreak-style': 'off',
    // "quotes": [
    //     "error",
    //     "double"
    // ],
    // "semi": [
    //     "error",
    //     "always"
    // ]
  }
};