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

    1. To find out how to play the game the user clicks the [INSERT COIN] button on the welcome screen and the
    'How to Play' instructions are displayed on the game setup screen.

2. I need to set the game options for skill and select a puzzle image.

    1. After clicking the [INSERT COIN] button on the welcome screen the user can set the game options.
        1. Use the difficulty slider to set how difficult the puzzle will be to solve.
        2. Use the arrows <> next to the puzzle image to select the required image.

3. I want to play the game.

    1. To play the game the user clicks the [INSERT COIN] button on the welcome screen
    2. Sets the game options for difficulty and puzzle image.
    3. Clicks the [PLAY GAME] button.

4. I need to be able to see in-game information about how I’m doing.

    1. In-game information is displayed at the top or left of the screen depending on your device.
    2. There you can see the difficulty level, puzzle preview, count-down timer and moves made.

5. How do I complete the puzzle.

    1. To complete the game the user needs to move the tiles until they are all in their original positions.
    2. Tile moves are done by either clicking or swiping a tile that can move into the blank space. 

6. If I get stuck I would like to reset the game.

    1. If the user gets stuck in an existing game they can reset the puzzle by clicking the green [RESET] button.
    2. The puzzle image, count-down timer and moves will all reset and then the game will begin again.

7. I want to end my current game and change the game setup.

    1. To end the current game the user can simply click the red [QUIT] button.
    2. Then to change the setup the user would click the [INSERT COIN] button on the welcome screen.

8. I want to use an image on my device as the puzzle image.

    1. To play the game using an image from their device the user would click the [INSERT COIN] button to get to the
    game options screen.
    2. Use the image select arrows <> to select the last image (image 16 of 16).
    3. Click on the image and then select a JPG image from your device to use as the puzzle image.
    4. The image will be resized, horizontally centered and squared for use as the puzzle image.

9. I want to view the hi-scores table.

    1. To view the hi-scores table click the [HI SCORES] button on the welcome screen.
    2. To exit the hi-scores table the user would wait for the timeout or click the [BACK] button.

10. How do I get on the hi-scores table.

    1. To get on the hi-scores table you need to get a score higher than the lowest displayed in the hi-scores table.
    2. A users score is based on time taken to complete, number of moves and difficulty level.

## Testing elements and functionality of all game screens (manually tested)

### General
- Make sure that the colours of text have good contrast with their backgrounds.
- Ensure that font sizes are readable on different devices.
- Check that any in-game sounds/music play at the right time.

### Welcome screen
1. Check that the alt/title text appears on the logo image.
2. Ensure that the logo and buttons display correctly on different device screen sizes.
3. Confirm that each button takes the user to the correct screen.

### Game Setup screen
1. Make sure the animation makes the screen appear as expected.
2. Make sure the setup options are responsive on different device screen sizes and that they re-arrange accordingly.
3. Confirm the slider bar selects the correct skill level by sliding or clicking.
4. Check that the image arrows change the selected puzzle image.
5. Check that clicking image 16/16 allows us to use a device image as the puzzle.
6. Confirm the [PLAY GAME] button starts the game.

### Game Play screen
1. Make sure the animation makes the screen appear as expected.
2. Check that the game info panel displays the correct preview image, level, timer and moves.
3. As moves are made confirm that the moves number increases.
4. Confirm that the count-down timer is working correctly.
5. Check that the puzzle is shuffled correctly
6. Make sure that the only puzzle pieces next to the blank space can move.
7. Confirm that a piece allowed to move will move with a click/tap or swipe, depending on the device.
8. Check that the [RESET] button correctly resets the puzzle and information panel.
9. Check that the [QUIT] button returns to the Welcome screen.
10. When puzzle complete confirm the score and whether or not the user can enter initials on the hi-scores table.
11. If a hi-score is achieved do the fireworks display and alternate music.

### Hi Score screen
1. Make sure the animation makes the screen appear/disappear as expected.
2. Check that the hi-scores table is displayed correctly.
3. If a user has achieved a hi-score check that the input is working correctly.
4. Ensure that the scoreboard timeouts are correct to automatically return to the Welcome screen.
5. Confirm that the [BACK] button works correctly.

## Automated tests (using Jasmine)
Jasmine was used to create Test Driven Development for the hi-scores table.
This seemed to go well, although I think the testing script will now be out-of-date, and will need updating.

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
(only includes main errors rather than small typos/alignment which caused only minor errors)

1. **Game Play - using Google DevTools to simulate devices**  
If you use Google DevTools to simulate a device (such as Apple iPhone 6/7/8) the welcome screen, hi-scores table
and Game Setup options display OK, however the in-game puzzle does not display.  
When tested on an actual iPhone device the puzzle displays OK. I believe this may be related to issue(2.) below.

2. **Game Play - in-game puzzle image not being displayed**  
I first noticed this issue on an actual iPhone.  After some research and testing I discovered that the Safari
browser on the iPhone did not look for the puzzle image in the same way as say Chrome on my windows desktop.
As I am using parts of a **background-image** to create the puzzle pieces normally the image would be addressed
relative to the location of the CSS file i.e.  ../images/puzzles/earth.jpg whereas the iPhone browser was trying
to load the background-image relative to the index.html file.  After testing on other browser, EDGE also does the same.
This was solved by adding some JS to detect the browser and alter the initial file-path.

3. **Audio playback**  
Audio playback on Windows desktop and Android devices works OK, but the playback of audio files on Apple devices seems
to be very hit and miss. I have yet to find a solution to this intermittent problem.

4. **Game Setup Options - using device image on Firefox browser**  
When using a device image on Firefox the image would rarely appear as the puzzle image even though the small puzzle 
preview image did display. Found a parameter error when calling the **toDataURL** method on the final canvas, Chrome and
Safari seemed to ignore the issue and just display the puzzle, whereas Firefox showed a blank puzzle.

5. **Hi-score table - entering your initials on an Android device**  
When you enter your initials on an Android device it does not limit the number of characters you can enter to only 3.
However it still only uses the first 3 you enter when saving your score.  I have not yet found a solution to this 
problem.

6. **Landscape Orientation - on smaller mobile devices**  
While the game does play in this mode on smaller mobile devices, there are elements of the game which simply don't
have enough space to display i.e. when the virtual keyboard pops up to enter your initials on the scoreboard.
