module.exports = {
  root: true,
  env: {
    node: true,
    commonjs:false,
    es6:true,
  },
  globals:{
    $:true,
    jQuery:true,
    layer:true,
    dialog:true,
    _t:true,
    ser:true,
    Sly:true,
    _:true,
    PublicNet:true,
    BMapLib:true,
    BMap:true,
    moment:true,
    io:true,
    XDate:true,
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
