const setup = {
  puzzleImageIndex: 1,
  welcomeScreen: () => {
    const welcomeScreen = document.querySelector('.welcome');
    setTimeout(() => {
      welcomeScreen.classList.add('welcome__scale-up');
    }, 400);
  },
  
  displayGridSize: (gridSize) => {
    let html = '';
    const totalSquares = gridSize * gridSize;
    for (let n = 0; n < totalSquares; n++) {
      html += `<div class="grid-size__square"></div>`;
    }
    return html;
  },

  selectPuzzleImage: (n) => {
    const puzzleImage = document.querySelector('.puzzle-image__value');
    setup.showPuzzleImage(setup.puzzleImageIndex += n);
    puzzleImage.innerHTML = setup.puzzleImageIndex;
  },

  showPuzzleImage: (n) => {
    const puzzleImages = document.getElementsByClassName("puzzle-image__container");
    if (n > puzzleImages.length) { setup.puzzleImageIndex = 1; }
    if (n < 1) { setup.puzzleImageIndex = puzzleImages.length; }
    for (let i = 0; i < puzzleImages.length; i++) {
        puzzleImages[i].style.display = "none";
    }
    puzzleImages[setup.puzzleImageIndex - 1].style.display = "block";
  },

  displayGameSetup: () => {
    const welcomeScreen = document.querySelector('.welcome');
    const setupScreen = document.querySelector('.game-setup');
    const gridSize3x3 = document.querySelector('.grid-size__3x3');
    const gridSize4x4 = document.querySelector('.grid-size__4x4');
    const gridSize5x5 = document.querySelector('.grid-size__5x5');
    welcomeScreen.classList.add('welcome__move-down');
    gridSize3x3.innerHTML = setup.displayGridSize(3);
    gridSize4x4.innerHTML = setup.displayGridSize(4);
    gridSize5x5.innerHTML = setup.displayGridSize(5);
    setup.showPuzzleImage(setup.puzzleImageIndex);
    setupScreen.classList.add('game-setup__move-down');
  },

  eventListeners: () => {
    const newGameButton = document.querySelector('#new--game');
    const difficultyInput = document.querySelector('#difficulty--input');
    const gridOptions = document.querySelectorAll('.js-grid-option');

    newGameButton.addEventListener('click', setup.displayGameSetup);
    
    difficultyInput.addEventListener('change', (e) => {
      const difficultyLevel = document.querySelector('.difficulty__value');
      difficultyLevel.innerHTML = e.target.value;
    });
    
    gridOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        const clickedGrid = e.target.parentElement;
        const gridSizeValue = document.querySelector('.grid-size__value');

        if (!clickedGrid.dataset['grid']) return;
        
        gridOptions.forEach(option => { option.classList.remove('grid-size__chosen'); });
        clickedGrid.classList.add('grid-size__chosen');
        gridSizeValue.innerHTML = clickedGrid.dataset['grid'];
      });
    });
  }
}

setup.welcomeScreen();

setup.eventListeners();