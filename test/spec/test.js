/*global expect*/
describe("A test", function() {
    it("success", function(){
        expect(true).toBe(true);
    });
    it("fails", function(){
        expect(true).toBe(false);
    });
});
