'use strict'

var gLevel = {
    SIZE: 4,
    MINES: 2,
    level:'easy'
}

function onSetGameLevel(level) {

    gLevel.level = level

    if (level === 'easy') {
        gLevel.SIZE = 4
        gLevel.MINES = 2
    }
    else if (level === 'medium') {
        gLevel.SIZE = 8
        gLevel.MINES = 14
    }
    else if (level === 'hard') {
        gLevel.SIZE = 12
        gLevel.MINES = 32
    }

    var elLevel = document.querySelector('.mine')
    var mine = `${gLevel.MINES}`
    elLevel.innerText = `${mine}`
    
    resetGame()
}