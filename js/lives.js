'use strict'

const LIFE = '❤️'

function stillLive() {
    if (gGame.lives > 0) {
        var elLives = document.querySelector('.lives')

        if (elLives.innerText.length > 0) {
            elLives.innerText = elLives.innerText.slice(0, -2)
        }

        playBombSound()
        alert('Oops, you exploded. You have left' + ' ' + gGame.lives + ' ' + 'life')
        gGame.lives--

    } else return gameOver()
}