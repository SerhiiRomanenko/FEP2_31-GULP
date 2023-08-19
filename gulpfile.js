const {src, dest} = require("gulp");
const fileinclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const rename = require("gulp-rename")

function defaultTask(cb) {
    cb();
}

// HTML task
function HTMLTask() {
    return src("src/*.html")
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(dest('dest/'))
}

// SCSS task

function CSSTask() {
    return src("src/style/**/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: "compressed"}).on("error", sass.logError))
        .pipe(rename({suffix: ".min"}))
        .pipe(sourcemaps.write("."))
        .pipe(dest('dest/style/'))
}

// JS task

exports.HTMLTask = HTMLTask;
exports.CSSTask = CSSTask;
exports.default = defaultTask;