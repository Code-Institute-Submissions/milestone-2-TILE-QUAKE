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
  notGotHiscore: ( document.querySelector('#sound--not-got-hiscore') ),
  insertCoin: ( document.querySelector('#sound--insert-coin') ),
  tileMove: ( document.querySelector('#sound--tile-click') )
};

// Object to handle all in game functions
const puzzleGame = {
  puzzleSize: 3,  //force value for now

  // tileGrid array of TileData objects to store the position of each tile col,row
  tileGrid: [],
  tiles: [],
  image: '',
  puzzleImageIndex: 1,
  puzzleChoiceData: [],
  deviceImageChosen: false,
  devicePuzzleImage : '',
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
        const timerMins = Math.floor(puzzleGame.timer / 60);
        const timerSecs = puzzleGame.timer % 60;
        const timerDisplay = `${timerMins < 10 ? '0' : ''}${timerMins}:${timerSecs < 10 ? '0' : ''}${timerSecs}`;
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
            let tileClass = "tile__p" + puzzleGame.tileGrid[x][y].tileCode;
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
          tileDetails.gridPos = `gridpos-${x}${y}`;
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
      for (let x = 0; x < puzzleGame.puzzleSize; x++) {
        for (let y = 0; y < puzzleGame.puzzleSize; y++) {
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
      tile.removeAttribute('ontouchend');
      tile.classList.add('cursor__default');
    });
  },

  showScore: () => {
    const fireworkShow = document.querySelector('.puzzle-complete');
    fireworkShow.classList.add('d-block');
    const baseScoreElement = document.querySelector('#score--base');
    const moveBonusElement = document.querySelector('#score--move');
    const timeBonusElement = document.querySelector('#score--time');
    const totalScoreElement = document.querySelector('#score--total');
    const baseScore = puzzleGame.difficultyLevel * 1000;
    const minimumMoves = ((puzzleGame.difficultyLevel * 2) + 1);
    let moveBonus = ((minimumMoves * 3) - puzzleGame.moves) <= 0 ? 0 : ((minimumMoves * 3) - puzzleGame.moves) * 500;
    let timeBonus = puzzleGame.timer <= 0 ? 0 : puzzleGame.timer * 250;
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
          sounds.notGotHiscore.play();
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
        gridDiv.setAttribute('ontouchend', 'puzzleGame.canTileMove(this.id)');
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
    setTimeout(puzzleGame.shuffleTileGrid, 500);
    setTimeout(puzzleGame.stopTileRumble, 2500);
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
    let isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    // double !! used below to make sure we get a boolean returned
    return isSafari;
  },
  
  checkEdge: () => {
    // double !! used below to make sure we get a boolean returned
    let isEdge = !!navigator.userAgent.match(/Edge\//);
    return isEdge;
  }

};

/* Object to handle the scoreboard */
const scoreboard = {
  data: [],
  scoreboardTimeout: 0,

  checkExists: () => {
    let newScoreboard = [];
    if (localStorage.getItem("tileQuakeScoreboard") === null) {
      for (let n = 10; n > 0; n--) {
        newScoreboard.push({ user: 'QTG', score: n * 1000, level: 1 });
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
      if ((gameScore > scoreEntry.score && scoreboardPosition > scoreboard.data.length) ||
          (gameScore === scoreEntry.score && scoreEntry.user === 'QTG')) {
        scoreboardPosition = index;
      }
    });
    return scoreboardPosition;
  },

  display: ()=> {
    const scoreboardScreen = document.querySelector('.game-scores');
    const hiScoreTable = document.querySelector('.game-scores__content');
    const exitScoreDiv = document.querySelector('.game-scores__exit');
    let displayTimeout;
    
    scoreboard.readScores();
    const hiScoreHTML = scoreboard.data.map((scoreEntry, index) => {
      return `
        <div class='game-scores__user' style='color: hsl(${(index * 25)}, 100%, 50%);'>${scoreEntry.user}</div>
        <div class='game-scores__level' style='color: hsl(${(index * 25)}, 100%, 50%);'>${scoreEntry.level}</div>
        <div class='game-scores__score' style='color: hsl(${(index * 25)}, 100%, 50%);'>${scoreEntry.score}</div>
      `;
    }).join('');
    hiScoreTable.innerHTML = hiScoreHTML;
    exitScoreDiv.classList.add('d-block');
    scoreboardScreen.classList.add('game-scores__move-right');
    if (sounds.gotHiscore.duration - sounds.gotHiscore.currentTime < 8) {
      displayTimeout = 7000;
    } else {
      displayTimeout = ((sounds.gotHiscore.duration - 3 - sounds.gotHiscore.currentTime) * 1000);
    }
    scoreboard.scoreboardTimeout = setTimeout(scoreboard.hide, displayTimeout);
  },
  
  hide: () => {
    const scoreboardScreen = document.querySelector('.game-scores');
    const exitScoreDiv = document.querySelector('.game-scores__exit');
    scoreboardScreen.classList.remove('game-scores__move-right');
    exitScoreDiv.classList.remove('d-block');
    clearTimeout(scoreboard.scoreboardTimeout);
  },

  saveScore: (tablePosition, score) => {
    const userInitials = document.querySelector('#initials--input').value.toUpperCase();
    const hiScoreTable = document.querySelector('.game-scores__content');
    const saveScoreDiv = document.querySelector('.game-scores__save');
    const newEntry = {
      user: userInitials,
      score: score,
      level: parseInt(puzzleGame.difficultyLevel)
    };
    sounds.button.play();
    scoreboard.data.splice(tablePosition, 0, newEntry);
    scoreboard.data.pop();
    localStorage.setItem('tileQuakeScoreboard', JSON.stringify(scoreboard.data));
    saveScoreDiv.classList.remove('d-block');
    saveScoreDiv.innerHTML = '';
    hiScoreTable.innerHTML = '';
    scoreboard.display();
  },

  addNewScore: (tablePosition, score) => {
    const scoreboardScreen = document.querySelector('.game-scores');
    const hiScoreTable = document.querySelector('.game-scores__content');
    const saveScoreDiv = document.querySelector('.game-scores__save');
    let hiScoreHTML = '';
    scoreboard.readScores();
    let initialsInput = `<form id="score--form">
                        <input id="initials--input" class="game-scores__entry-input" type="text" autocomplete="off" maxlength="3" pattern="[A-Za-z]{3}">
                        </form>`;
    for (let index = 0; index < scoreboard.data.length; index++) {
      let scoreEntry = scoreboard.data[index];
      if (index === tablePosition) {
        hiScoreHTML += `
        <div class='game-scores__user game-scores__entry-line'>${initialsInput}</div>
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
    let gameScoreSaveHTML = `
      <p class="game-scores__message">Well Done! Enter your initials above.</p>
      <button id="save--score" class="button__save-score" onclick="scoreboard.saveScore(${tablePosition}, ${score});">
      SAVE SCORE</button>
      `;
    saveScoreDiv.innerHTML = gameScoreSaveHTML;
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

    scoreboardScreen.classList.add('game-scores__move-right');
    saveScoreDiv.classList.add('d-block');
    setTimeout(scoreboard.inputFocus, 1000);
    if (score < 1) { 
      scoreboard.scoreboardTimeout = setTimeout(scoreboard.hide, 6000);
    }
  },

  inputFocus: () => {
    document.getElementById("initials--input").focus();
  }

};

// Object to handle all game setup options
const gameSetupOptions = {

  displayDifficultLevel: (e) => {
    const difficultyLevel = document.querySelector('.difficulty__value');
    difficultyLevel.innerHTML = e.target.value;
    puzzleGame.difficultyLevel = e.target.value;
  },

  updatePuzzleImage: (imageIndex) => {
    const root = document.documentElement;
    const screenWidth = document.querySelector(".wrapper").offsetWidth;
    const miniPhoto = document.querySelector('.info__photo');

    if (imageIndex < puzzleGame.puzzleChoiceData.length) {
    
      // Safari and Edge appear to look for CSS background images from the root rather than css folder
      let imagePathStart = '..';
      if (puzzleGame.checkSafari() || puzzleGame.checkEdge()) { imagePathStart = 'assets'; } 

      let imageSize = '';
      let fileName = puzzleGame.puzzleChoiceData[imageIndex-1].file_name.slice(0, -4);
      if (screenWidth < 768) { imageSize = '_300x300'; }
      const image = `url('${imagePathStart}/images/puzzles/${fileName}${imageSize}.jpg')`;
      miniPhoto.innerHTML = `<img class="info__photo-size" src="assets/images/puzzles/${fileName}.jpg" 
      alt="Puzzle image" title="Puzzle image"/>`;
      root.style.setProperty('--chosenImage', image);
    } else {
      const chosenDeviceImage = document.querySelector('.puzzle-image__device');
      miniPhoto.innerHTML = `<img class="info__photo-size" src="${chosenDeviceImage.src}" 
      alt="Puzzle image" title="Puzzle image"/>`;
      root.style.setProperty('--chosenImage', puzzleGame.devicePuzzleImage);
    }
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

  setupPuzzleSlideshow: async () => {
    const puzzleChoice = document.querySelector('.puzzle-image__slideshow');
    fetch('./assets/data/puzzles.json')
      .then((response) => {
        return response.json();
      })
      .then((puzzleImages) => {
        puzzleGame.puzzleChoiceData = puzzleImages;
        const puzzleChoicesHTML = puzzleImages.map((image, index) => {
          let imageClass = 'puzzle-image__image';
          let imageSource = `assets/images/puzzles/${image.file_name}`;
          let imageLabel = `<label class="puzzle-image__text">${image.title}</label>`;
          let imageOnClick = '';
          if (index === puzzleGame.puzzleChoiceData.length -1) { 
            imageClass += ' puzzle-image__device';
            if (puzzleGame.deviceImageChosen) {
              imageSource = puzzleGame.devicePuzzleImage;
            }
            imageLabel = `<label for="puzzle-upload" class="puzzle-image__add">${image.title}</label>
                          <input id="puzzle-upload" type="file" onchange="gameSetupOptions.processDeviceImage();">
                         `;
            imageOnClick = `onclick="gameSetupOptions.fileInputClick();"`;
          }
          return `<div class="puzzle-image__container puzzle-image__fade">
                    <div class="puzzle-image__number">${image.id + 1} / ${puzzleImages.length}</div>
                    <img class="${imageClass}" src="${imageSource}" width="324" ${imageOnClick}>
                    ${imageLabel}
                  </div>`;
        }).join('');

        let puzzleSlideshowControls = 
          `<a class="puzzle-image__prev" onclick="gameSetupOptions.selectPuzzleImage(-1)">&#10094;</a>
           <a class="puzzle-image__next" onclick="gameSetupOptions.selectPuzzleImage(1)">&#10095;</a>
          `;
        puzzleChoice.innerHTML = puzzleChoicesHTML + puzzleSlideshowControls;

        gameSetupOptions.showPuzzleImage(puzzleGame.puzzleImageIndex);
      })
      .catch((err) => {
        console.log('JSON ERROR!', err);
      });
  },

  displayGameSetup: () => {
    const welcomeScreen = document.querySelector('.welcome');
    const setupScreen = document.querySelector('.game-setup');
    sounds.insertCoin.play();

    if (puzzleGame.puzzleChoiceData.length === 0 ) {
      gameSetupOptions.setupPuzzleSlideshow();
    }
   
    welcomeScreen.classList.add('welcome__move-right');
    setupScreen.classList.add('game-setup__move-right');
  },

  resize: () => {
    if (puzzleGame.puzzleChoiceData.length > 0 ) {
      gameSetupOptions.updatePuzzleImage(puzzleGame.puzzleImageIndex);
    }
  },

  processDeviceImage: () => {
    const uploadCanvas = document.getElementById("upload--canvas");
    const finalCanvas = document.getElementById("final--canvas");
    let uploadCtx = uploadCanvas.getContext("2d");
    let finalCtx = finalCanvas.getContext("2d");
    const screenWidth = document.querySelector(".wrapper").offsetWidth;
    let puzzleImageSize = 600;
    if (screenWidth < 768) { puzzleImageSize = 300; }
    const item = document.querySelector('#puzzle-upload').files[0];  //get the image selected
    let reader = new FileReader();  //create a FileReader
    //image turned to base64-encoded Data URI.
    reader.readAsDataURL(item);
    reader.onload = function(event) {
      let img = new Image(); //create a image
      img.src = event.target.result; //result is base64-encoded Data URI
      img.onload = function(el) {
        let offsetX = 0;
        if (el.target.width < puzzleImageSize || el.target.height < puzzleImageSize) {
          alert('Image too small...');
          return;
        }

        finalCanvas.height = puzzleImageSize;
        finalCanvas.width = puzzleImageSize;

        if (el.target.width > el.target.height) {
          const scaleFactor = puzzleImageSize / el.target.height;
          uploadCanvas.height = puzzleImageSize;
          uploadCanvas.width = el.target.width * scaleFactor;
          offsetX = (uploadCanvas.width - puzzleImageSize) / 2;
        } else {
          const scaleFactor = puzzleImageSize / el.target.width;
          uploadCanvas.width = puzzleImageSize;
          uploadCanvas.height = el.target.height * scaleFactor;
        }

        uploadCtx.drawImage(el.target, 0, 0, uploadCanvas.width, uploadCanvas.height);
        finalCtx.drawImage(uploadCanvas, offsetX, 0, puzzleImageSize, puzzleImageSize, 0, 0, puzzleImageSize, puzzleImageSize);

        //get the base64-encoded Data URI from the final resize/crop image
        const srcEncoded = finalCtx.canvas.toDataURL('image/jpeg', 1.0);
        const root = document.documentElement;
        const url = srcEncoded.replace(/(\r\n|\n|\r)/gm, "");
        // const imgUpload = "url('" + url.replace(/(\r\n|\n|\r)/gm, "") + "')";
        const imgUpload = "url('" + url + "')";
        
        puzzleGame.deviceImageChosen = true;
        puzzleGame.devicePuzzleImage = imgUpload;

        root.style.setProperty('--chosenImage', imgUpload);
        const slideshowDeviceImage = document.querySelector('.puzzle-image__device');
        slideshowDeviceImage.src = url;

        const deviceImageLabel = document.querySelector('.puzzle-image__add');
        deviceImageLabel.textContent = 'Click to Change';

        // set the device image chosen to the active puzzle image
        puzzleGame.puzzleImageIndex = puzzleGame.puzzleChoiceData.length;
        gameSetupOptions.selectPuzzleImage(0);
      };
    };
  },

  fileInputClick: () => {
    const imageFileInput = document.querySelector('#puzzle-upload');
    imageFileInput.click();
  }
};

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
    // setTimeout(() => {
    //   welcomeScreen.classList.add('welcome__scale-up');
    // }, welcomeTimeout);
  },

  preventBehavior: (e) => {
    e.preventDefault();
  },

  eventListeners: () => {
    const newGameButton = document.querySelector('#new--game');
    const hiScoresButton = document.querySelector('#hi--scores');
    const closeHiScores = document.querySelector('#close--table');
    const startGameButton = document.querySelector('#start--game');
    const difficultyInput = document.querySelector('#difficulty--input');
    const scoreOKButton = document.querySelector('.score-ok__button');
    const gameQuitButton = document.querySelector('#quit--game');
    const gameResetButton = document.querySelector('#reset--game');
    const gameAreaGrid = document.querySelector('.game-area__grid');
    
    window.onresize = gameSetupOptions.resize;
    gameAreaGrid.addEventListener("touchmove", setup.preventBehavior, {passive: false});
    
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

    scoreOKButton.addEventListener('click', () => {
      sounds.button.play();
      setup.welcomeScreen(true);
    });

    gameQuitButton.addEventListener('click', () => {
      sounds.button.play();
      setup.welcomeScreen(true);
    });
    
    gameResetButton.addEventListener('click', () => {
      sounds.button.play();
      puzzleGame.resetPuzzle();
    });
    
    difficultyInput.addEventListener('change', (e) => {
      gameSetupOptions.displayDifficultLevel(e);
    });
    
  }
};

setup.welcomeScreen(false);
setup.eventListeners();