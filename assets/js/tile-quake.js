const setup = {
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

  displayGameSetup: () => {
    const welcomeScreen = document.querySelector('.welcome');
    welcomeScreen.classList.add('welcome__move-down');
    const setupScreen = document.querySelector('.game-setup');
    const gridSize3x3 = document.querySelector('.grid-size__3x3');
    const gridSize4x4 = document.querySelector('.grid-size__4x4');
    const gridSize5x5 = document.querySelector('.grid-size__5x5');
    gridSize3x3.innerHTML = setup.displayGridSize(3);
    gridSize4x4.innerHTML = setup.displayGridSize(4);
    gridSize5x5.innerHTML = setup.displayGridSize(5);
    setupScreen.classList.add('game-setup__move-down');
  },

  eventListeners: () => {
    const newGameButton = document.querySelector('#new--game');
    const difficultyInput = document.querySelector('#difficulty--input');
    
    newGameButton.addEventListener('click', setup.displayGameSetup);
    
    difficultyInput.addEventListener('change', (e) => {
      const difficultyLevel = document.querySelector('.difficulty__value');
      difficultyLevel.innerHTML = e.target.value;
    });
  }
};

setup.welcomeScreen();

setup.eventListeners();