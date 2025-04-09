module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:vue/vue3-essential"],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  rules: {
    // Vue规则
    "vue/multi-word-component-names": "off", // 允许单个单词的组件名

    // JS规则
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    indent: ["error", 2],
    quotes: ["error", "single"],
    semi: ["error", "always"],
    "comma-dangle": ["error", "never"],
    "no-var": "error",
    "prefer-const": "error",
  },
};
