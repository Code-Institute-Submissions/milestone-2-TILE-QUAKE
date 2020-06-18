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
    newGameButton.addEventListener('click', setup.displayGameSetup);
    
    const difficultyInput = document.querySelector('#difficulty--input');
    difficultyInput.addEventListener('change', (e) => {
      const difficultyLevel = document.querySelector('.difficulty__value');
      difficultyLevel.innerHTML = e.target.value;
    });
    
    const gridOptions = document.querySelectorAll('.js-grid-option');
    gridOptions.forEach(option => {
      // console.log(option);
      option.addEventListener('click', (e) => {
        console.log(e);
        console.log(e.target.parentElement.dataset);

        const clickedGridText = e.target.parentElement.dataset['grid'];

        console.log('Text: ', clickedGridText);
        const clickedGrid = e.target.parentElement;
        gridOptions.forEach(option => { option.classList.remove('grid-size__chosen'); });
        clickedGrid.classList.add('grid-size__chosen');
        const gridSizeValue = document.querySelector('.grid-size__value');
        gridSizeValue.innerHTML = clickedGridText;
      });
    });
  }
}

setup.welcomeScreen();

setup.eventListeners();