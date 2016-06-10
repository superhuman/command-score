var expect = require('chai').expect;
var commandScore = require ('./index.js'); 

/*global describe,it*/
describe("commandScore", function () {

    it("should match exact strings exactly", function () {
        expect(commandScore("hello", "hello")).to.equal(1);
    });

    it("should prefer case-sensitive matches", function () {
        expect(commandScore("Hello", "Hello")).to.be.greaterThan(commandScore("Hello", "hello"));
    });

    it("should mark down prefixes", function () {
        expect(commandScore("hello", "hello")).to.be.greaterThan(commandScore("hello", "he"));
    });

    it("should score all prefixes the same", function () {
        expect(commandScore("help", "he")).to.equal(commandScore("hello", "he"));
    });

    it("should mark down word jumps", function () {
        expect(commandScore("hello world", "hello")).to.be.greaterThan(commandScore("hello world", "hewo"));
    });

    it("should score similar word jumps the same", function () {
        expect(commandScore("hello world", "hewo")).to.equal(commandScore("hey world", "hewo"));
    });

    it("should penalize long word jumps", function () {
        expect(commandScore("hello world", "hewo")).to.be.greaterThan(commandScore("hello kind world", "hewo"));
    });

    it("should match missing characters", function () {
        expect(commandScore("hello", "hl")).to.be.greaterThan(0);
    });

    it("should penalize more for more missing characters", function () {
        expect(commandScore("hello", "hllo")).to.be.greaterThan(commandScore("hello", "hlo"));
    });

    it("should match transpotisions", function () {
        expect(commandScore("hello", "hle")).to.be.greaterThan(0);
    });

    it('should not match with a trailing letter', function () {
        expect(commandScore("ss", "sss")).to.equal(0)
    });

});
