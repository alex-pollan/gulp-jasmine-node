# Gulp task for jasmine-node

This is a very basic implementation of a gulp task for *jasmine-node* (thanks to [@sindresorhus](https://github.com/sindresorhus) and to all contributors of this module).

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

For information about writing unit test with jasmine-node see *https://github.com/sindresorhus/gulp-jasmine*

