const scoreboard = {
  data: [],

  checkExists: () => {
    let newScoreboard = [];
    if (localStorage.getItem("tileQuakeScoreboard") === null) {
      newScoreboard.push({ user: 'TOP', score: 9000, level: 1 });
      newScoreboard.push({ user: 'BBB', score: 7000, level: 1 });
      newScoreboard.push({ user: 'CCC', score: 5000, level: 1 });
      newScoreboard.push({ user: 'DDD', score: 3000, level: 1 });
      newScoreboard.push({ user: 'BOT', score: 1000, level: 1 });
      localStorage.setItem('tileQuakeScoreboard', JSON.stringify(newScoreboard));
    }
    return true;
  },

  readScores: () => {
    let scoreList = localStorage.getItem("tileQuakeScoreboard");
    scoreboard.data = JSON.parse(scoreList);
    return scoreboard.data.length;
  },

  isAHighScore: (gameScore) => {
    scoreboard.readScores();
    let scoreboardPosition = scoreboard.data.length + 1;
    scoreboard.data.forEach((scoreEntry, index) => {
      if (gameScore > scoreEntry.score && scoreboardPosition > scoreboard.data.length) {
        scoreboardPosition = index;
      }
    });
    return scoreboardPosition;
  }
}
