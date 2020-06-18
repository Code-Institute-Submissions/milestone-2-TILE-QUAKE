const setup = {
  welcomeScreen: () => {
    const welcomeScreen = document.querySelector('.welcome');
    setTimeout(() => {
      welcomeScreen.classList.add('welcome__scale-up');
    }, 400);
  },

  eventListeners: () => {
    const newGameButton = document.querySelector('#new--game');
    const welcomeScreen = document.querySelector('.welcome');
    const setupScreen = document.querySelector('.game-setup');
    const difficultyInput = document.querySelector('#difficulty--input');
    
    newGameButton.addEventListener('click', () => {
      welcomeScreen.classList.add('welcome__move-down');
      setupScreen.classList.add('game-setup__move-down');
    });
    
    difficultyInput.addEventListener('change', (e) => {
      const difficultyLevel = document.querySelector('.difficulty__value');
      difficultyLevel.innerHTML = e.target.value;
    });
  }
};

setup.welcomeScreen();

setup.eventListeners();