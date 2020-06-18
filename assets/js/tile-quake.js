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
    newGameButton.addEventListener('click', () => {
      console.log(welcomeScreen);
      welcomeScreen.classList.add('welcome__move-down');
    });
  }

}

setup.welcomeScreen();
setup.eventListeners();

