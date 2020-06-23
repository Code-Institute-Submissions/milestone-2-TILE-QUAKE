class TileData {
    constructor(top, bottom, left, right, id) {
        this.topSide = top;
        this.bottomSide = bottom;
        this.leftSide = left;
        this.rightSide = right;
        this.tileCode = id;
    }
}

// Object to handle all in game functions
const puzzleGame = {
  puzzleSize: 3,  //force value for now

  // tileGrid array of TileData objects to store the position of each tile col,row
  tileGrid: [],

  tiles: [],

  showGameArea: () => {
    const setupScreen = document.querySelector('.game-setup');
    const gameScreen = document.querySelector('.game-area');
    setupScreen.classList.remove('game-setup__move-right');
    gameScreen.classList.add('game-area__move-left');
    puzzleGame.createHTMLGrid();
    puzzleGame.tileGrid = Array.from(Array(puzzleGame.puzzleSize), () => new Array(puzzleGame.puzzleSize));
    puzzleGame.initPuzzle();
  },

  initPuzzle: () => {
    for (let x = 1; x < (puzzleGame.puzzleSize * puzzleGame.puzzleSize); x++) {
      puzzleGame.tiles.push(x);
    }
    puzzleGame.tiles.push(0);
    let nextTile = 0;
    let topCode, bottomCode, leftCode, rightCode;
    let nextSideCode = 101;
    let gridElement, gridElementID;

    for (let x = 0; x < puzzleGame.puzzleSize; x++) {
      for (let y = 0; y < puzzleGame.puzzleSize; y++) {
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

        let gridElementID = `#gridpos-${x}${y}`;
        let gridElement = document.querySelector(gridElementID);

        if (nextTile < (puzzleGame.puzzleSize * puzzleGame.puzzleSize)) {
            tileClass = "tile__p" + puzzleGame.tileGrid[x][y].tileCode;
            gridElement.classList.add(`${tileClass}`);
        }

        nextTile++;
      }
    }
  },

  createHTMLGrid: () => {
    const pageGrid = document.querySelector('.game-area__grid');
    let gridDiv;
    for (let x = 0; x < puzzleGame.puzzleSize; x++) {
      for (let y = 0; y < puzzleGame.puzzleSize; y++) {
        gridDiv = document.createElement("div");
        gridDiv.id = `gridpos-${x}${y}`;
        pageGrid.appendChild(gridDiv);
      }
    }
  }
}

// Object to handle all game setup options
const gameSetupOptions = {
  puzzleImageIndex: 1,

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

  selectPuzzleImage: (n) => {
    const puzzleImage = document.querySelector('.puzzle-image__value');
    gameSetupOptions.showPuzzleImage(gameSetupOptions.puzzleImageIndex += n);
    puzzleImage.innerHTML = gameSetupOptions.puzzleImageIndex;
  },

  showPuzzleImage: (n) => {
    const puzzleImages = document.getElementsByClassName("puzzle-image__container");
    if (n > puzzleImages.length) { gameSetupOptions.puzzleImageIndex = 1; }
    if (n < 1) { gameSetupOptions.puzzleImageIndex = puzzleImages.length; }
    for (let i = 0; i < puzzleImages.length; i++) {
        puzzleImages[i].style.display = "none";
    }
    puzzleImages[gameSetupOptions.puzzleImageIndex - 1].style.display = "block";
  },

  displayGameSetup: () => {
    const welcomeScreen = document.querySelector('.welcome');
    const setupScreen = document.querySelector('.game-setup');
    const gridSize3x3 = document.querySelector('.grid-size__3x3');
    const gridSize4x4 = document.querySelector('.grid-size__4x4');
    const gridSize5x5 = document.querySelector('.grid-size__5x5');
    welcomeScreen.classList.add('welcome__move-right');
    gridSize3x3.innerHTML = gameSetupOptions.displayGridSize(3);
    gridSize4x4.innerHTML = gameSetupOptions.displayGridSize(4);
    gridSize5x5.innerHTML = gameSetupOptions.displayGridSize(5);
    gameSetupOptions.showPuzzleImage(gameSetupOptions.puzzleImageIndex);
    setupScreen.classList.add('game-setup__move-right');
  }
}

// Object to handle the welcome logo screen and setup any eventListeners
const setup = {
  welcomeScreen: () => {
    const welcomeScreen = document.querySelector('.welcome');
    setTimeout(() => {
      welcomeScreen.classList.add('welcome__scale-up');
    }, 400);
  },
  
  eventListeners: () => {
    const newGameButton = document.querySelector('#new--game');
    const startGameButton = document.querySelector('#start--game');
    const difficultyInput = document.querySelector('#difficulty--input');
    const gridOptions = document.querySelectorAll('.js-grid-option');

    newGameButton.addEventListener('click', gameSetupOptions.displayGameSetup);
    startGameButton.addEventListener('click', puzzleGame.showGameArea);
    
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

setup.welcomeScreen();

setup.eventListeners();
