# Gulp task for jasmine-node

This is a very basic implementation of a gulp task for [jasmine-node](https://github.com/mhevery/jasmine-node)

### Install

    npm install gulp-jasmine-node --save-dev
    
### Usage

```javascript
var jasmineNode = require('gulp-jasmine-node');

gulp.task('test', function () {
    return gulp.src(['spec/**/*spec.js']).pipe(jasmineNode({
        timeout: 10000
    }));
});
```

### Options

includeStackTrace - Ability to suppress stack trace
```javascript
var jasmineNode = require('gulp-jasmine-node');

gulp.task('test', function () {
    return gulp.src(['spec/**/*spec.js']).pipe(jasmineNode({
        timeout: 10000,
        includeStackTrace: false
    }));
});
```

For more information about writing unit test with *jasmine-node* see [https://github.com/mhevery/jasmine-node](https://github.com/mhevery/jasmine-node)