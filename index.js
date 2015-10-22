
var path = require('path');
var arrify = require('arrify');
var gutil = require('gulp-util');
var Reporter = require('jasmine-terminal-reporter');
var through = require('through2');
var jasmine = require('jasmine-node');
var jasmineEnv = jasmine.getEnv();

function deleteRequireCache(id) {
    if (!id || id.indexOf('node_modules') !== -1) {
        return;
    }
    
    var files = require.cache[id];
    
    if (files !== undefined) {
        for (var file in files.children) {
            deleteRequireCache(files.children[file].id);
        }
        
        delete require.cache[id];
    }
}

var SilentReporter = function (cb) {
    var failureCount = 0;
    
    this.specDone = function (result) {
        if (result.status === 'failed') {
            failureCount++;
        }
    };
    
    this.jasmineDone = function () {
        if (failureCount > 0) {
            cb(new gutil.PluginError('gulp-jasmine-node', 'Tests failed', {
                showStack: false
            }));
            return;
        }
        
        cb();
    };
};

module.exports = function (options) {
    options = options || {};
    
    if (options.timeout) {
        jasmine.asyncSpecWait.timeout = options.timeout;
    }
    
    var color = options.showColor || true;
    var reporter = options.reporter;
    
    if (reporter) {
        arrify(reporter).forEach(function (el) {
            jasmineEnv.addReporter(el);
        });
    } else {
        jasmineEnv.addReporter(new jasmine.TerminalVerboseReporter({
            color: color,
        }));
    }
    
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }
        
        if (file.isStream()) {
            cb(new gutil.PluginError('gulp-jasmine', 'Streaming not supported'));
            return;
        }
        
        // get the cache object of the specs.js file,
        // delete it and its children recursively from cache
        var resolvedPath = path.resolve(file.path);
        var modId = require.resolve(resolvedPath);
        deleteRequireCache(modId);
        
        require(resolvedPath);
        
        cb(null, file);
    }, function (cb) {
        try {
            jasmineEnv.addReporter(new SilentReporter(cb));
            jasmineEnv.execute();
        } catch (err) {
            cb(new gutil.PluginError('gulp-jasmine-node', err, { showStack: true }));
        }
    });
};


