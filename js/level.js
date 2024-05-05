'use strict'

var gLevel = {
    SIZE: 4,
    MINES: 2
}

function onSetGameLevel(level) {

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
    resetGame()
}