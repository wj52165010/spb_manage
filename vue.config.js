
var path = require('path')
var webpack = require('webpack')
var fs = require('fs')

const manifest = require('./vendor-manifest.json')

//主题文件路径
const THEME_PATH='./src/theme'
const themeFileNameSet = fs.readdirSync(path.resolve(THEME_PATH));
const themeNames=themeFileNameSet.filter(n=>path.extname(n)=='.js').map(n=>path.basename(n, path.extname(n)));

module.exports = {
    baseUrl:'',
    lintOnSave: true,
    filenameHashing:false,
    themes:themeNames || [],
    pages:{
      index:path.resolve(__dirname,'./src/main.js'),
      login:path.resolve(__dirname,'./src/login.js')
    },
    configureWebpack: {
        resolve: {
            alias:{
                'lib':path.resolve(__dirname,'./src/libraries'),
                'assets':path.resolve(__dirname,'./src/assets'),

                'layer':path.resolve(__dirname, './src/libraries/layer-v3.1.1/layer/layer.js'),
                'tool':path.resolve(__dirname,'./src/wraplib/tool.js'),
                'dialog':path.resolve(__dirname,'./src/wraplib/dialog.js'),
                'ser':path.resolve(__dirname,'./src/wraplib/server.js'),
                'scroll':path.resolve(__dirname,'./src/wraplib/scroll.js'),
                'event':path.resolve(__dirname,'./src/wraplib/event.js'),
            }
        },
        plugins:[
            new webpack.ProvidePlugin({
                $:'jquery',
                jQuery:'jquery',
                _t:['tool','default'],
                dialog:['dialog','default'],
                ser:['ser','default']
            }),
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: manifest,
            })
        ],
        
    }
}