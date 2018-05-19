const gulp          = require('gulp');
const watch         = require('gulp-watch');
const plumber       = require('gulp-plumber');
const notify        = require('gulp-notify');
const sass          = require('gulp-sass');
const postcss       = require('gulp-postcss');
const autoprefixer  = require('autoprefixer');
const cssnano       = require('cssnano');
const flieInclude   = require('gulp-file-include');
const htmlBeautify  = require('gulp-html-beautify');
const imagemin      = require('gulp-imagemin');
const pngquant      = require('imagemin-pngquant');
const changed       = require('gulp-changed');
const babel         = require('gulp-babel');
const browserSync   = require('browser-sync').create();
const reload        = browserSync.reload;
const concat = require('gulp-concat');
gulp.task('concat',function(){
    return gulp.src('dist/public/css/base.css')
        .pipe(concat('base.min.css'))
        .pipe(gulp.dest('dist/public/css'))
        .pipe(gulp.dest('public/css'))
})
gulp.task('scss',function(){
    return gulp.src('src/scss/*.scss')
        .pipe(plumber({ errorHandler: notify.onError('scss in Error : <%= error.message %>') }))
        .pipe(sass({ useFileCache: true}))
        .pipe(postcss([
            autoprefixer({
                browsers: ['last 6 versions', '>1%'],
                cascade: true,
            }),
            cssnano()            
        ]))
        .pipe(gulp.dest('public/css'))
        .pipe(gulp.dest('dist/public/css'))
        .pipe(reload({ stream: true }));
});
gulp.task('watch:scss', ['scss'],function(){
    return watch(['src/scss/*.scss','src/scss/**/*.scss'],function(){
        gulp.start('scss');
    })
});
gulp.task('html',function(){
    return gulp.src(['views/*.html','views/**/*.html','!views/common/*.html'])
        .pipe(plumber({ errorHandler: notify.onError('html in Error : <%= error.message %>') }))
        .pipe(flieInclude({
            prefix: '@@',
            basepath: '@file'            
        }))
        .pipe(htmlBeautify({
            'indent_size': 4,
            'indent_char': ' '            
        }))
        .pipe(gulp.dest('dist/views'))
        .pipe(reload({ stream: true }));

});
gulp.task('watch:html', ['html'], function () {
    return watch(['views/*.html', 'views/**/*.html'], function () {
        gulp.start('html');
    })
});
gulp.task('images',function(){
    return gulp.src('src/images/*.*')
        .pipe(plumber({ errorHandler: notify.onError('images in Error : <%= error.message %>') }))
        .pipe(changed('public/images'))
        .pipe(changed('dist/public/images'))
       .pipe(imagemin({
           optimizationLevel: 5,                       //类型：Number  默认：3  取值范围：0-7（优化等级）
           progressive: true,                          //类型：Boolean 默认：false 无损压缩jpg图片
           interlaced: true,                           //类型：Boolean 默认：false 隔行扫描gif进行渲染
           multipass: true,                            //类型：Boolean 默认：false 多次优化svg直到完全优化
           svgoPlugins: [{ removeViewBox: false }],    // 不移除svg的viewbox属性  
           use: [pngquant({
               quality: '65-80'
           })]                                         //使用pngquant深度压缩png图片的imagemin插件            
       }))
        .pipe(gulp.dest('dist/public/images'))
        .pipe(gulp.dest('public/images'))
});
gulp.task('watch:images', ['images'], function () {
    return watch(['src/images/*.*'], function () {
        gulp.start('images');
    })
});
gulp.task('script', () => {
    return gulp.src('src/js/*.js')
        .pipe(plumber({ errorHandler: notify.onError('script in Error : <%= error.message %>') }))
        .pipe(babel({ presets: ['env'] }))
        .pipe(gulp.dest('dist/public/js'))
        .pipe(gulp.dest('public/js'))
});
gulp.task('watch:script', ['script'], function () {
    return watch(['src/js/*.js'], function () {
        gulp.start('script');
    })
});
gulp.task('browserSync', () => {
    browserSync.init({
        server: {
            baseDir: ['./dist/views', './'],
            index: 'brands/',
            // middleware: proxyMiddleware('/api', {
            //     target: 'http://www.aiqin.com/',
            //     pathRewrite: { '^/api': '/' }, // 重写路径
            //     changeOrigin: true
            // })
        },
        port: 8383,
        ui: {
            port: 8383
        },
    })
    gulp.watch(['src/scss/*.scss', 'src/scss/**/*.scss'], ['scss']).on('change', reload);
    gulp.watch(['src/js/*.js', 'src/js/**/*.js'], ['script']).on('change', reload);
    gulp.watch(['views/*.html', 'views/**/*.html'], ['html']).on('change', reload);
    gulp.watch(['src/images/*.*'], ['images']).on('change', reload);
});
gulp.task('server', ['browserSync', 'watch:scss',  'watch:html', 'watch:script', 'watch:images'])
gulp.task('default', ['server']);