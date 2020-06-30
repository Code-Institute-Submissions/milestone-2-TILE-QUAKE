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
        it("should return scoreboard position of 3", function() {
            expect(scoreboard.isAHighScore(4000)).toBe(3);
        });
    });

    describe("Have I made it onto the scoreboard with a score of 6000", function() {
        it("should return scoreboard position of 2", function() {
            expect(scoreboard.isAHighScore(6000)).toBe(2);
        });
    });

    describe("Have I made it onto the scoreboard with a score of 3000", function() {
        it("should return scoreboard position of 4 as cannot replace Bob", function() {
            expect(scoreboard.isAHighScore(3000)).toBe(4);
        });
    });

    describe("I should NOT get onto the scoreboard with a score of 1000", function() {
        it("should return scoreboard position of 6", function() {
            expect(scoreboard.isAHighScore(1000)).toBe(6);
        });
    });

  });
