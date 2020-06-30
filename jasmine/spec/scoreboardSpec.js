describe("Scoreboard", function() {
    describe("Check scoreboard exists", function() {
        it("should return true", function() {
            expect(scoreboard.checkExists()).toBe(true);
        });
    });

    describe("Read scoreboard", function() {
        it("should return 5 scores found", function() {
            expect(scoreboard.readScores()).toBe(5);
        });
    });

    describe("Have I made it onto the scoreboard with a score of 4000", function() {
        it("should return true", function() {
            expect(scoreboard.gotHighScore(4000)).toBe(true);
        });
    });

});
