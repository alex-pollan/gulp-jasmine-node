var expect = require("chai").expect;
var assert = require("chai").assert;
var spy = require("sinon").spy;
var gulp = require("gulp");
var through = require('through');

describe("The task", function() {
    var reporter;
    var jasmineNode;

    var passedCount = 0;
    var failedCount = 0;

    var TestReporter = function (cb) {
        var self = this;
        
        self.reportSpecResults = function (spec) {
            passedCount += spec.results_.passedCount;
            failedCount += spec.results_.failedCount;
        };
        
        self.reportRunnerResults = function (spec) {
            cb();
        };
    };
    
    before(function(){
        jasmineNode = require("../index");
    });
    
    describe("when passing a reporter", function(){
        it("uses reporter", function(done) {
            reporter = new TestReporter(function(){
                expect(passedCount).to.equal(1);
                expect(failedCount).to.equal(1);
                done();
            });
    
            gulp
            .src(['test/spec/*.js'])
            .pipe(jasmineNode({
                timeout: 10000,
                reporter: reporter
            }));
        });
    });

    //TODO:
    describe("when non passing a reporter", function(){
        it("calls back onComplete");
    });

    //pipe-in a null
    //pipe-in a non stream object
    //syntax error in the spec file and assert the exception
});

