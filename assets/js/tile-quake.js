class TileData {
    constructor(top, bottom, left, right, id) {
        this.topSide = top;
        this.bottomSide = bottom;
        this.leftSide = left;
        this.rightSide = right;
        this.tileCode = id;
    }
}

function gameTimer() {
  puzzleGame.updateGameInfo(['timer']);
  puzzleGame.timer--;
  if (puzzleGame.timer < 0) { clearInterval(puzzleGame.gameTime); }
}

const sounds = {
  tileRumble: ( document.querySelector('#sound--tile-rumble') ),
  button: ( document.querySelector('#sound--button') ),
  gotHiscore: ( document.querySelector('#sound--got-hiscore') ),
  insertCoin: ( document.querySelector('#sound--insert-coin') ),
  tileMove: ( document.querySelector('#sound--tile-click') )
}

// Object to handle all in game functions
const puzzleGame = {
  puzzleSize: 3,  //force value for now

  // tileGrid array of TileData objects to store the position of each tile col,row
  tileGrid: [],
  tiles: [],
  image: '',
  puzzleImageIndex: 1,
  difficultyLevel: 1,
  difficultyTime: [30, 60, 120, 240, 300, 420, 600, 720, 960, 1260],
  moves: 0,
  gameTime: 0,
  timer: 0,

  showGameArea: () => {
    const setupScreen = document.querySelector('.game-setup');
    const gameScreen = document.querySelector('.game-area');
    setupScreen.classList.remove('game-setup__move-right');
    gameScreen.classList.add('game-area__move-left');
    puzzleGame.resetPuzzle();
  },

  updateGameInfo: (gameInfo) => {
    gameInfo.forEach(info => {
      const infoDataElement = document.querySelector(`#info--data-${info}`);
      if (info === 'difficulty') { infoDataElement.textContent = puzzleGame.difficultyLevel; }
      if (info === 'moves') { infoDataElement.textContent = puzzleGame.moves; }
      if (info === 'timer') {
        timerMins = Math.floor(puzzleGame.timer / 60);
        timerSecs = puzzleGame.timer % 60;
        timerDisplay = `${timerMins < 10 ? '0' : ''}${timerMins}:${timerSecs < 10 ? '0' : ''}${timerSecs}`;
        infoDataElement.textContent = timerDisplay; }
    });
  },

  initPuzzle: () => {
    const puzzleSize = puzzleGame.puzzleSize;
    let nextTile = 0;
    let topCode, bottomCode, leftCode, rightCode;
    let nextSideCode = 101;

    for (let x = 1; x < (puzzleSize * puzzleSize); x++) {
      puzzleGame.tiles.push(x);
    }
    puzzleGame.tiles.push(0);

    // puzzleGame.tiles = puzzleGame.shuffle(puzzleGame.tiles);

    for (let x = 0; x < puzzleSize; x++) {
      for (let y = 0; y < puzzleSize; y++) {
        // calculate side codes for the current tile
        if (y > 0 ) {
            topCode = puzzleGame.tileGrid[x][y-1].bottomSide; // find prev BOTTOM code from gridpos [x][y-1][0]
        } else {
            topCode = nextSideCode;
            nextSideCode++;
        }
        bottomCode = nextSideCode;
        nextSideCode++;
        if (x > 0 ) {
            leftCode = puzzleGame.tileGrid[x-1][y].rightSide; //find the RIGHT-SIDE code from gridpos [x-1][y]
        } else {
            leftCode = nextSideCode;
            nextSideCode++;
        }
        rightCode = nextSideCode;
        nextSideCode++;

        puzzleGame.tileGrid[x][y] = new TileData(topCode, bottomCode, leftCode, rightCode, puzzleGame.tiles[nextTile]);

        let gridElement = document.querySelector(`#gridpos-${x}${y}`);

        if (nextTile < (puzzleSize * puzzleSize)) {
            tileClass = "tile__p" + puzzleGame.tileGrid[x][y].tileCode;
            gridElement.classList.add(tileClass, 'tile__border');
        }

        if (puzzleGame.tiles[nextTile] === 0) {
          gridElement.classList.add("cursor__not-allowed");
        }

        nextTile++;
      }
    }
  },

  blankTileDetails: () => {
    const puzzleSize = puzzleGame.puzzleSize;
    let tileDetails;
    for (let x = 0; x < puzzleSize; x++) {
      for (let y = 0; y < puzzleSize; y++) {
        if ( puzzleGame.tileGrid[x][y].tileCode === 0 ) {
          tileDetails = puzzleGame.tileGrid[x][y];
          tileDetails['gridPos'] = `gridpos-${x}${y}`;
        }
      }
    }
    return tileDetails;
  },

  // Fisher-Yates shuffle below from stackoverflow.com (deekshith)
  shuffle: (array) => {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {

      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  },

  sleep: (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  shuffleTileGrid: async () => {
    let isTileNextToBlank;
    let previousTile = "";
    const diffLevel = (puzzleGame.difficultyLevel * 2) + 1;
    const tileDelay = (diffLevel > 6) ? (2000 / diffLevel) : (1000 / diffLevel);
    // shuffle the grid depending on the difficulty level
    // find all the tiles next to the blank tile
    for (let n = 0; n < diffLevel; n++) {
      let tilesNextToBlank = [];
      let blankTileGridID = puzzleGame.blankTileDetails();
      for (x = 0; x < puzzleGame.puzzleSize; x++) {
        for (y = 0; y < puzzleGame.puzzleSize; y++) {
          if ( puzzleGame.tileGrid[x][y].tileCode != 0 ) {
            isTileNextToBlank = puzzleGame.nextToBlankTile(puzzleGame.tileGrid[x][y]);
            // if tile is next to the blank and it's not the tile which was shuffled before then consider it for next shuffle
            if ((isTileNextToBlank) && ((`gridpos-${x}${y}`) != previousTile)) {
              tilesNextToBlank.push((`gridpos-${x}${y}`));
            }
          }
        }
      }
      // randomly select next tile to shuffle
      do {
          puzzleGame.shuffle(tilesNextToBlank);
      }
      while (tilesNextToBlank[0] === previousTile);
      
      await puzzleGame.sleep(tileDelay);
      puzzleGame.moveTile(tilesNextToBlank[0], true);
      previousTile = blankTileGridID.gridPos;
    }
  },

  getGridXY: (tile) => {
    return { x: tile.substring(8,9), y: tile.substring(9) };
  },

  nextToBlankTile: (clickedTile) => {
    const blankTile = puzzleGame.blankTileDetails();
    const gridTo = puzzleGame.getGridXY(blankTile.gridPos);
    let allowedToMove = false;
    //check if any sides of the clicked tile are touching any sides of the blank tile
    if ( clickedTile.topSide === blankTile.bottomSide ||
         clickedTile.bottomSide === blankTile.topSide ||
         clickedTile.leftSide === blankTile.rightSide ||
         clickedTile.rightSide === blankTile.leftSide )
         { allowedToMove = true; }
    return allowedToMove;
  },

  isPuzzleComplete: () => {
    let tilesCorrect = 0;  // number of tiles in correct position
    let tileToCheck = 1;
    const puzzleSize = puzzleGame.puzzleSize;
    // check if the right puzzle piece is in the correct grid space
    for (let x = 0; x < puzzleSize; x++) {
      for (let y = 0; y < puzzleSize; y++) {
        if ( puzzleGame.tileGrid[x][y].tileCode === tileToCheck ) { tilesCorrect++; }
        tileToCheck++;
        if (tileToCheck === (puzzleSize * puzzleSize)) { tileToCheck = 0; }
      }
    }
    if (tilesCorrect === (puzzleSize * puzzleSize)) { return true; } else { return false; }
  },

  toggleLastTile: () => {
    const puzzleSize = puzzleGame.puzzleSize;
    const lastTileGirdID = `#gridpos-${puzzleSize-1}${puzzleSize-1}`;
    const lastTile = document.querySelector(lastTileGirdID);
    lastTile.classList.toggle('tile__p0');
    lastTile.classList.toggle(`tile__p${(puzzleSize * puzzleSize)}`);
  },

  tidyCompletedPuzzle: () => {
    const gridTiles = document.querySelectorAll('[id^=gridpos]');
    gridTiles.forEach(tile => {
      tile.classList.remove('tile__border');
      tile.removeAttribute('onclick');
      tile.classList.add('cursor__default');
    });
  },

  showScore: () => {
    const fireworkShow = document.querySelector('.puzzle-complete');
    // fireworkShow.classList.add('pyro');
    fireworkShow.classList.add('d-block');
    const baseScoreElement = document.querySelector('#score--base');
    const moveBonusElement = document.querySelector('#score--move');
    const timeBonusElement = document.querySelector('#score--time');
    const totalScoreElement = document.querySelector('#score--total');
    const baseScore = puzzleGame.difficultyLevel * 1000;
    const minimumMoves = ((puzzleGame.difficultyLevel * 2) + 1);
    let moveBonus = ((minimumMoves * 3) - puzzleGame.moves) <= 0 ? 0 : ((minimumMoves * 3) - puzzleGame.moves) * 500;
    let timeBonus = puzzleGame.timer <= 0 ? 0 : puzzleGame.timer * 250;
    // if (moveBonus <= 0) { moveBonus = 0; }
    // if (timeBonus <= 0) { timeBonus = 0; }
    const totalScore = baseScore + moveBonus + timeBonus;
    baseScoreElement.textContent = baseScore;
    moveBonusElement.textContent = moveBonus;
    timeBonusElement.textContent = timeBonus;
    totalScoreElement.textContent = baseScore + moveBonus + timeBonus;
    return totalScore;
  },

  canTileMove: (clickedTile) => {
    const gridFrom = puzzleGame.getGridXY(clickedTile);
    const canIMove = puzzleGame.nextToBlankTile(puzzleGame.tileGrid[gridFrom.x][gridFrom.y]);
    let score;
    let scoreboardIndex;
    let newEntry = {};
    if (canIMove) {
      puzzleGame.moveTile(clickedTile, false);
      if (puzzleGame.isPuzzleComplete()) {
        clearInterval(puzzleGame.gameTime);
        puzzleGame.toggleLastTile();
        puzzleGame.tidyCompletedPuzzle();
        score = puzzleGame.showScore();
        scoreboardIndex = scoreboard.isAHighScore(score);
        if ( scoreboardIndex != (scoreboard.data.length + 1)) {
          const hiScoreMsg = document.querySelector('.score--high');
          const fireworkShow = document.querySelector('.puzzle-complete');
          fireworkShow.classList.add('pyro');
          hiScoreMsg.classList.add('d-block');
          sounds.gotHiscore.muted = false;
          sounds.gotHiscore.play();
          setTimeout(scoreboard.addNewScore.bind(null, scoreboardIndex, score), 5000);
        } else {
          const scoreOkButton = document.querySelector('.score-ok__button');
          scoreOkButton.classList.add('d-block');
        }
      }
    }
  },
  
  moveTile: (clickedTile, startShuffle) => {
    const blankTile = puzzleGame.blankTileDetails();
    const gridTo = puzzleGame.getGridXY(blankTile.gridPos);
    const gridFrom = puzzleGame.getGridXY(clickedTile);
    const fromTile = document.querySelector(`#${clickedTile}`);
    const fromClass = fromTile.getAttribute('class');
    const toTile = document.querySelector(`#${blankTile.gridPos}`);
    const toClass = toTile.getAttribute('class');

    // swap the two tiles over - class and tile code
    toTile.setAttribute('class', fromClass);
    fromTile.setAttribute('class', toClass);
    puzzleGame.tileGrid[gridTo.x][gridTo.y].tileCode = puzzleGame.tileGrid[gridFrom.x][gridFrom.y].tileCode;
    puzzleGame.tileGrid[gridFrom.x][gridFrom.y].tileCode = 0;
    if (!startShuffle) {
      sounds.tileMove.play();
      puzzleGame.moves++;
      puzzleGame.updateGameInfo(['moves']);
    }
  },

  createHTMLGrid: () => {
    const pageGrid = document.querySelector('.game-area__grid');
    pageGrid.innerHTML = '';
    let gridDiv;
    for (let x = 0; x < puzzleGame.puzzleSize; x++) {
      for (let y = 0; y < puzzleGame.puzzleSize; y++) {
        gridDiv = document.createElement("div");
        gridDiv.id = `gridpos-${x}${y}`;
        gridDiv.setAttribute('onclick', 'puzzleGame.canTileMove(this.id)');
        pageGrid.appendChild(gridDiv);
      }
    }
  },

  resetPuzzle: () => {
    puzzleGame.tileGrid = Array.from(Array(puzzleGame.puzzleSize), () => new Array(puzzleGame.puzzleSize));
    puzzleGame.createHTMLGrid();
    puzzleGame.initPuzzle();
    const hiScoreMsg = document.querySelector('.score--high');
    hiScoreMsg.classList.remove('d-block');
    const scoreOkButton = document.querySelector('.score-ok__button');
    scoreOkButton.classList.remove('d-block');
    sounds.tileRumble.play();
    puzzleGame.startTileRumble();
    const rumbleON = setTimeout(puzzleGame.shuffleTileGrid, 500);
    const rumbleOFF = setTimeout(puzzleGame.stopTileRumble, 2500);
    // puzzleGame.shuffleTileGrid();
    puzzleGame.moves = 0;
    puzzleGame.timer = puzzleGame.difficultyTime[puzzleGame.difficultyLevel - 1];
    gameSetupOptions.updatePuzzleImage(puzzleGame.puzzleImageIndex);
    puzzleGame.updateGameInfo(['difficulty', 'moves', 'timer']);
    clearInterval(puzzleGame.gameTime);
    puzzleGame.gameTime = setInterval(gameTimer, 1000);
  },

  startTileRumble: () => {
    let nextRumble = "right";
    for (let x = 0; x < puzzleGame.puzzleSize; x++) {
      for (let y = 0; y < puzzleGame.puzzleSize; y++) {
        if ((x === 0 || x === 2 || x === 4) && y === 0) { nextRumble = "right"; }
        if ((x === 1 || x === 3) && y === 0) { nextRumble = "left"; }
        let gridTile = document.querySelector(`#gridpos-${x}${y}`);
        gridTile.classList.add(`rumble__${nextRumble}`);
        if (nextRumble === "right") { nextRumble = "left"; } else { nextRumble = "right"; }
      }
    }
  },

  stopTileRumble: () => {
    const gridTiles = document.querySelectorAll('[id^=gridpos]');
    gridTiles.forEach(tile => {
      tile.classList.remove('rumble__right','rumble__left');
    });
  },

  checkSafari: () => {
    return isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    // const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }

}

/* Object to handle the scoreboard */
const scoreboard = {
  data: [],
  scoreboardTimeout: 0,

  checkExists: () => {
    let newScoreboard = [];
    let nextChar;
    if (localStorage.getItem("tileQuakeScoreboard") === null) {
      for (let n = 10; n > 0; n--) {
        newScoreboard.push({ user: 'QTG', score: n * 1000, level: 1 });
        // newScoreboard.push({ user: ('GQ' + String.fromCharCode(75 - n)), score: n * 1000, level: 1 });
      }
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
      let tableScore = scoreEntry.score;
      console.log({index}, {tableScore});
      if ((gameScore > scoreEntry.score && scoreboardPosition > scoreboard.data.length) ||
          (gameScore === scoreEntry.score && scoreEntry.user === 'QTG')) {
        scoreboardPosition = index;
      }
    });
    console.log({gameScore}, {scoreboardPosition});
    return scoreboardPosition;
  },

  display: ()=> {
    const scoreboardScreen = document.querySelector('.game-scores');
    const hiScoreTable = document.querySelector('.game-scores__content');
    const exitScoresButton = document.querySelector('.button__exit-scores');
    let displayTimeout;
    
    scoreboard.readScores();
    const hiScoreHTML = scoreboard.data.map((scoreEntry, index) => {
      return `
        <div class='game-scores__user' style='color: hsl(${(index * 25)}, 100%, 50%);'>${scoreEntry.user}</div>
        <div class='game-scores__level' style='color: hsl(${(index * 25)}, 100%, 50%);'>${scoreEntry.level}</div>
        <div class='game-scores__score' style='color: hsl(${(index * 25)}, 100%, 50%);'>${scoreEntry.score}</div>
      `
    }).join('');
    hiScoreTable.innerHTML = hiScoreHTML;
    exitScoresButton.classList.add('d-block');
    scoreboardScreen.classList.add('game-scores__move-right');
    if (sounds.gotHiscore.duration - sounds.gotHiscore.currentTime < 8) {
      displayTimeout = 7000;
    } else {
      displayTimeout = ((sounds.gotHiscore.duration - 3 - sounds.gotHiscore.currentTime) * 1000);
    }
    scoreboardTimeout = setTimeout(scoreboard.hide, displayTimeout);
  },
  
  hide: () => {
    const scoreboardScreen = document.querySelector('.game-scores');
    const exitScoresButton = document.querySelector('.button__exit-scores');
    // sounds.gotHiscore.muted = true;
    scoreboardScreen.classList.remove('game-scores__move-right');
    exitScoresButton.classList.remove('d-block');
    clearTimeout(scoreboardTimeout);
  },

  saveScore: (tablePosition, score) => {
    const userInitials = document.querySelector('#initials--input').value.toUpperCase();
    const hiScoreTable = document.querySelector('.game-scores__content');
    const saveScoreDiv = document.querySelector('.game-scores__save');
    newEntry = {
      user: userInitials,
      score: score,
      level: parseInt(puzzleGame.difficultyLevel)
    }
    scoreboard.data.splice(tablePosition, 0, newEntry);
    scoreboard.data.pop();
    localStorage.setItem('tileQuakeScoreboard', JSON.stringify(scoreboard.data));
    saveScoreDiv.classList.remove('d-block');
    hiScoreTable.innerHTML = '';
    scoreboard.display();
  },

  addNewScore: (tablePosition, score) => {
    console.log(`Add new score of ${score} at position ${tablePosition}`);
    const scoreboardScreen = document.querySelector('.game-scores');
    const hiScoreTable = document.querySelector('.game-scores__content');
    const saveScoreDiv = document.querySelector('.game-scores__save');
    // const saveScoreButton = document.querySelector('#save--score');
    // saveScoreButton.addEventListener('click', () => { scoreboard.saveScore(tablePosition, score); }, {once : true});
    let hiScoreHTML = '';
    scoreboard.readScores();
    let initialInput = `<form id="score--form">
                        <input id="initials--input" class="game-scores__entry-input" type="text" maxlength="3" pattern="[A-Za-z]{3}">
                        </form>`;
    console.log(`Scoreboard length : ${scoreboard.data.length}`);
    for (let index = 0; index < scoreboard.data.length; index++) {
      let scoreEntry = scoreboard.data[index];
      if (index === tablePosition) {
        hiScoreHTML += `
        <div class='game-scores__user game-scores__entry-line'>${initialInput}</div>
        <div class='game-scores__level game-scores__entry-line'><span class=''>${puzzleGame.difficultyLevel}</span></div>
        <div class='game-scores__score game-scores__entry-line'><span class=''>${score}</span></div>
        `;
      }
      if (index < scoreboard.data.length - 1) {
        hiScoreHTML += `
          <div class='game-scores__user' style='color: hsl(${(index * 25)}, 100%, 50%);'>${scoreEntry.user}</div>
          <div class='game-scores__level' style='color: hsl(${(index * 25)}, 100%, 50%);'>${scoreEntry.level}</div>
          <div class='game-scores__score' style='color: hsl(${(index * 25)}, 100%, 50%);'>${scoreEntry.score}</div>
          `;
      }
    }
    hiScoreTable.innerHTML = hiScoreHTML;
    const userInitialsForm = document.querySelector('#score--form');
    userInitialsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      scoreboard.saveScore(tablePosition, score);
    });
    const welcomeScreen = document.querySelector('.welcome');
    const fireworkShow = document.querySelector('.puzzle-complete');
    fireworkShow.classList.remove('d-block', 'pyro');
    welcomeScreen.classList.remove('welcome__move-right');
    const gameScreen = document.querySelector('.game-area');
    gameScreen.classList.remove('game-area__move-left');
    puzzleGame.toggleLastTile();
    // welcomeTimeout = 1000;

    scoreboardScreen.classList.add('game-scores__move-right');
    saveScoreDiv.classList.add('d-block');
    document.getElementById("initials--input").focus();
    if (score < 1) { 
      scoreboardTimeout = setTimeout(scoreboard.hide, 6000);
    }
  },
}

// Object to handle all game setup options
const gameSetupOptions = {

  displayGridSize: (gridSize) => {
    let html = '';
    const totalSquares = gridSize * gridSize;
    for (let n = 0; n < totalSquares; n++) {
      html += `<div class="grid-size__square"></div>`;
    }
    return html;
  },

  displayDifficultLevel: (e) => {
    const difficultyLevel = document.querySelector('.difficulty__value');
    difficultyLevel.innerHTML = e.target.value;
    puzzleGame.difficultyLevel = e.target.value;
  },

  displaySelectedGrid: (e) => {
    const clickedGrid = e.target.parentElement;
    const gridSizeValue = document.querySelector('.grid-size__value');
    const gridOptions = document.querySelectorAll('.js-grid-option');

    if (!clickedGrid.dataset['grid']) return;
    
    gridOptions.forEach(option => { option.classList.remove('grid-size__chosen'); });
    clickedGrid.classList.add('grid-size__chosen');
    gridSizeValue.innerHTML = clickedGrid.dataset['grid'];
  },

  updatePuzzleImage: (imageIndex) => {
    const root = document.documentElement;
    const screenWidth = document.querySelector(".wrapper").offsetWidth;

    // Safari appears to look for CSS background images from the root rather than css folder
    let imagePathStart = '..';
    if (puzzleGame.checkSafari()) { imagePathStart = 'assets'; } 

    let imageSize = '';
    if (screenWidth < 768) { imageSize = '_300x300'; }
    const image = `url('${imagePathStart}/images/puzzles/img${imageIndex}${imageSize}.jpg')`;
    const miniPhoto = document.querySelector('.info__photo');
    miniPhoto.innerHTML = `<img class="info__photo-size" src="assets/images/puzzles/img${imageIndex}.jpg" 
    alt="Puzzle image" title="Puzzle image"/>`;
    root.style.setProperty('--chosenImage', image);
  },

  selectPuzzleImage: (n) => {
    const puzzleImage = document.querySelector('.puzzle-image__value');
    gameSetupOptions.showPuzzleImage(puzzleGame.puzzleImageIndex += n);
    puzzleImage.innerHTML = puzzleGame.puzzleImageIndex;
  },

  showPuzzleImage: (n) => {
    const puzzleImages = document.getElementsByClassName("puzzle-image__container");
    if (n > puzzleImages.length) { puzzleGame.puzzleImageIndex = 1; }
    if (n < 1) { puzzleGame.puzzleImageIndex = puzzleImages.length; }
    for (let i = 0; i < puzzleImages.length; i++) {
        puzzleImages[i].style.display = "none";
    }
    puzzleImages[puzzleGame.puzzleImageIndex - 1].style.display = "block";
  },

  displayGameSetup: () => {
    const welcomeScreen = document.querySelector('.welcome');
    const setupScreen = document.querySelector('.game-setup');
    sounds.insertCoin.play();
    for (let n = 3; n < 6; n++) {
      const gridSize = document.querySelector(`.grid-size__${n}x${n}`);
      gridSize.innerHTML = gameSetupOptions.displayGridSize(n);
    }
    welcomeScreen.classList.add('welcome__move-right');
    gameSetupOptions.showPuzzleImage(puzzleGame.puzzleImageIndex);
    setupScreen.classList.add('game-setup__move-right');
  },

  resize: () => {
    gameSetupOptions.updatePuzzleImage(puzzleGame.puzzleImageIndex);
  }

}

// Object to handle the welcome logo screen and setup any eventListeners
const setup = {
  welcomeScreen: (inGame) => {
    const errorIE = document.querySelector('.ie-error');
    errorIE.classList.add('d-none');
    const welcomeScreen = document.querySelector('.welcome');
    const fireworkShow = document.querySelector('.puzzle-complete');
    let welcomeTimeout = 400;
    if (inGame === true) {
      clearInterval(puzzleGame.gameTime);
      fireworkShow.classList.remove('d-block', 'pyro');
      welcomeScreen.classList.remove('welcome__scale-up', 'welcome__move-right');
      const gameScreen = document.querySelector('.game-area');
      gameScreen.classList.remove('game-area__move-left');
      puzzleGame.toggleLastTile();
      welcomeTimeout = 1000;
    }
    setTimeout(() => {
      welcomeScreen.classList.add('welcome__scale-up');
    }, welcomeTimeout);
  },

  eventListeners: () => {
    const newGameButton = document.querySelector('#new--game');
    const hiScoresButton = document.querySelector('#hi--scores');
    const closeHiScores = document.querySelector('#close--table');
    const startGameButton = document.querySelector('#start--game');
    const difficultyInput = document.querySelector('#difficulty--input');
    const gridOptions = document.querySelectorAll('.js-grid-option');
    const scoreOKButton = document.querySelector('.score-ok__button');
    const gameQuitButton = document.querySelector('#quit--game');
    const gameResetButton = document.querySelector('#reset--game');

    window.onresize = gameSetupOptions.resize;
    
    newGameButton.addEventListener('click', gameSetupOptions.displayGameSetup);
    hiScoresButton.addEventListener('click', () => {
      sounds.button.play();
      scoreboard.display();
    });

    closeHiScores.addEventListener('click', () => {
      sounds.button.play();
      sounds.gotHiscore.pause();
      sounds.gotHiscore.currentTime = 0;
      scoreboard.hide();
    });

    startGameButton.addEventListener('click', () => {
      sounds.button.play();
      puzzleGame.showGameArea();
    });

    scoreOKButton.addEventListener('click', () => { setup.welcomeScreen(true); });
    gameQuitButton.addEventListener('click', () => { setup.welcomeScreen(true); });
    gameResetButton.addEventListener('click', puzzleGame.resetPuzzle);
    
    difficultyInput.addEventListener('change', (e) => {
      gameSetupOptions.displayDifficultLevel(e);
    });
    
    gridOptions.forEach(option => { 
      option.addEventListener('click', (e) => {
        gameSetupOptions.displaySelectedGrid(e);
      });
    });
  }
}

setup.welcomeScreen(false);

setup.eventListeners();
