# Tile Quake - Testing Information

[Website deployed on GitHub Pages](https://devtoguk.github.io/milestone-2-TILE-QUAKE/)

[Back to main README.md file](/README.md)

## Testing
- [JSHint - Code Analysis Tool](https://jshint.com/) - used to help detect errors and potential problems in JavaScript code.
- [W3C - Markup Validation Service](https://validator.w3.org/) - used to check the markup validity of the HTML documents.
- [W3C - CSS Validation Service](https://jigsaw.w3.org/css-validator/) - used to check the validity of the Cascading Style Sheets (CSS). 
  Had several Parse Errors but these seem to be caused by my use of CSS variables. Found the following link which explained more why I
  got the errors. [Stackoverflow](https://stackoverflow.com/questions/57661659/w3c-css-validation-parse-error-on-variables)
- [Chrome Developer Tools](https://developers.google.com/web/tools/chrome-devtools) - used to help check the responsiveness of the site and also use of Audits to test for performance, accessibility, best practices & SEO
- [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) - used for further performance check.


## User story testing (UX section of README.md)
1. How do I play the game?

    1. To find out how to play the game the user clicks the [Insert Coin] button on the welcome screen and the
    'How to Play' instructions are displayed on the game setup screen.

2. I need to set the game options for skill and select a puzzle image.

    1. After clicking the [Insert Coin] button on the welcome screen the user can set the game options.
        1. Use the difficulty slider to set how difficult the puzzle will be to solve.
        2. Use the arrows <> next to the puzzle image to select the required image.

3. I want to play the game.

    1. To play the game the user clicks the [Insert Coin] button on the welcome screen
    2. Sets the game options for difficulty and puzzle image.
    3. Clicks the [Play Game] button.

4. I need to be able to see in-game information about how I’m doing.

    1. In-game information is displayed at the top or left of the screen depending on your device.
    2. There you can see the difficulty level, puzzle preview, count-down timer and moves made.

5. How do I complete the puzzle.

    1. To complete the game the user needs to move the tiles until they are all in their original positions.
    2. Tile moves are done by either clicking or swiping a tile that can move into the blank space. 

6. If I get stuck I would like to reset the game.

    1. If the user gets stuck in an existing game they can reset the puzzle by clicking the green [Reset] button.
    2. The puzzle image, count-down timer and moves will all reset and then the game will begin again.

7. I want to end my current game and change the game setup.

    1. To end the current game the user can simply click the red [Quit] button.
    2. Then to change the setup the user would click the [Insert Coin] button on the welcome screen.

8. I want to use an image on my device as the puzzle image.

    1. To play the game using an image from their device the user would click the [Insert Coin] button to get to the
    game options screen.
    2. Use the image select arrows <> to select the last image (image 16 of 16).
    3. Click on the image and then select a JPG image from your device to use as the puzzle image.
    4. The image will be resized, horizontally centered and squared for use as the puzzle image.

9. I want to view the high-score table.

    1. To view the high score table click the [Hi Scores] button on the welcome screen.
    2. To exit the high score table the user would wait for the timeout or click the [Back] button.

10. How do I get on the high score table.

    1. To get on the high-score table you need to get a score higher than the lowest displayed in the high score table.
    2. A users score is based on time taken to complete, number of moves and difficulty level.


## Testing elements and functionality of all game screens (manually tested)

## Automated tests (using Jasmine)
Jasmine was used to create Test Driven Development for the high score table.
This seemed to go well, although I think the testing script will now be out-of-date.

## Additional Testing
1. Asked friends and family to play the game on their phone, tablets and desktops where possible and let me know
any issues. Got good feedback, with no real issues.
2. I have tested the site on a desktop using the following modern browsers: Chrome, Firefox and Edge. As well as 
testing on Android phone/tablet and Apple iPhone.
3. The game has not been written to work on Internet Explorer, the user will receive an error suggesting they use a
more modern browser. In the real World if a client wanted a site to work on IE then that is fine, but a lot of
the newer methods of coding Javascript, etc does not work on IE. IE has had it's day and I wanted to code the game
using some of these newer methods.

## Errors/Issues Found

