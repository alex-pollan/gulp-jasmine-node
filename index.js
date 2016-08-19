var path = require('path');
var arrify = require('arrify');
var gutil = require('gulp-util');
var through = require('through2');
var jasmine = require('jasmine-node');
var jasmineEnv = jasmine.getEnv();
var _ = require('lodash');

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

module.exports = function (options) {
    options = options || {};
    
    _.defaults(options, { 
        timeout: 10000,
        showColor: true,
        includeStackTrace: true
    });
    
    if (options.timeout) {
        jasmine.asyncSpecWait.timeout = options.timeout;
    }
    
    if (options.reporter) {
        arrify(options.reporter).forEach(function (el) {
            jasmineEnv.addReporter(el);
        });
    } else {
        jasmineEnv.addReporter(new jasmine.TerminalVerboseReporter({
            color: options.showColor,
            includeStackTrace: options.includeStackTrace
        }));
    }
    
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }
        
        if (file.isStream()) {
            cb(new gutil.PluginError('gulp-jasmine-node', 'Streaming not supported'));
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
            jasmineEnv.addReporter({
                reportRunnerResults: function () {
                    cb(); // all tests have finished
                }
            });
            jasmineEnv.execute();
        } catch (err) {
            cb(new gutil.PluginError('gulp-jasmine-node', err, { showStack: true }));
        }
    });
};


