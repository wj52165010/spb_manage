module.exports = {
  root: true,
  env: {
    node: true,
    commonjs:false,
  },
  globals:{
    $:true,
    jQuery:true,
    layer:true,
    dialog:true,
    _t:true,
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  rules: {
    'no-console':'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
