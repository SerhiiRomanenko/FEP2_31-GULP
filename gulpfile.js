const {src, dest, watch, series, parallel} = require("gulp");
const fileinclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const rename = require("gulp-rename");
const uglify = require('gulp-uglify');
const browserSync = require("browser-sync").create();
const babelMinify = require("gulp-babel-minify");
const concat = require('gulp-concat');

function defaultTask(cb) {
    cb();
}

function HTMLTask() {
    return src("src/*.html")
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(dest('dest/'))
}

function CSSTask() {
    return src("src/style/**/*.scss")
        .pipe(concat('main.scss'))
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: "compressed"}).on("error", sass.logError))
        .pipe(rename({suffix: ".min"}))
        .pipe(sourcemaps.write("."))
        .pipe(dest('dest/style/'))
}

function JSTask() {
    return src("src/*.js")
        .pipe(uglify())
        .pipe(babelMinify())
        .pipe(concat('main.js'))
        .pipe(rename({suffix: ".min"}))
        .pipe(dest('dest/'))
}

function watchTask() {
    watch('src/**/*.html', HTMLTask);
    watch('src/**/*.scss', CSSTask);
    watch('src/**/*.js', JSTask);
    watch('src/**/*.html', browserSyncReload);
    watch('src/**/*.scss', browserSyncReload);
    watch('src/**/*.js', browserSyncReload);
}

function browserSyncServer() {
    browserSync.init({
        server: {
            baseDir: "dest"
        }
    })
}

function browserSyncReload(cb) {
    browserSync.reload();
    cb();
}


exports.HTMLTask = HTMLTask;
exports.CSSTask = CSSTask;
exports.JSTask = JSTask;
exports.watchTask = watchTask;
exports.browserServer = browserSyncServer;
exports.default = series(
    HTMLTask,
    CSSTask,
    JSTask,
    parallel(browserSyncServer, watchTask)
);