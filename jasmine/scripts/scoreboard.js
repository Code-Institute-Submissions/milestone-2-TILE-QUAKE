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
    data = JSON.parse(scoreList);
    console.log(data);
    return data.length;
  }

}
