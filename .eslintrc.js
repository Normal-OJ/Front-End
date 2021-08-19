module.exports = {
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/standard'
  ],
  plugins: [
    'vue'
  ],
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
