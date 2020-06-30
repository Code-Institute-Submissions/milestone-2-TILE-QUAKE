const scoreboard = {
  checkExists: () => {
    let myScoreboard = [];
    if (localStorage.getItem("scoreboard") === null) {
      for (let n = 0; n < 5; n++) {
        myScoreboard.push({ user: 'AAA', score: 1000, level: 1 });
      }
      localStorage.setItem('scoreboard', JSON.stringify(myScoreboard));
    } else {
      return true;
    }
  },

  readScores: () => {
    return 5;
  }

}
