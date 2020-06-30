const scoreboard = {
  data: [],

  checkExists: () => {
    let newScoreboard = [];
    if (localStorage.getItem("tileQuakeScoreboard") === null) {
      newScoreboard.push({ user: 'TQA', score: 9000, level: 1 });
      newScoreboard.push({ user: 'TQA', score: 7000, level: 1 });
      newScoreboard.push({ user: 'TQA', score: 5000, level: 1 });
      newScoreboard.push({ user: 'BOB', score: 3000, level: 1 });
      newScoreboard.push({ user: 'RIC', score: 1000, level: 1 });
      localStorage.setItem('tileQuakeScoreboard', JSON.stringify(newScoreboard));
    }
    return true;
  },

  readScores: () => {
    scoreboard.checkExists();
    let scoreList = localStorage.getItem("tileQuakeScoreboard");
    scoreboard.data = JSON.parse(scoreList);
    return scoreboard.data.length;
  },

  isAHighScore: (gameScore) => {
    scoreboard.readScores();
    let scoreboardPosition = scoreboard.data.length + 1;
    scoreboard.data.forEach((scoreEntry, index) => {
      if ((gameScore > scoreEntry.score && scoreboardPosition > scoreboard.data.length) ||
          (gameScore === scoreEntry.score && scoreEntry.user === 'TQA')) {
        console.log(`MyScore = ${gameScore} | User: ${scoreEntry.user}  Score: ${scoreEntry.score}  Index: ${index}`);
        scoreboardPosition = index;
      }
    });
    return scoreboardPosition;
  }
}
