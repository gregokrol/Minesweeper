'use strict'
// Global
var gBoardBild
var gStartTime
var gTimeInterval
var gLivesCounter
var gCountMinesMarked = 0

// Modal
const gLevel = {
    SIZE: 4,
    MINES: 2
}

const gBoard = {
    minesAroundCount: 4,
    isShown: false,
    isMine: false,
    isMarked: true
}

const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

// Const
const board = []
const elLives = document.querySelector('.lives span')
const elTimer = document.querySelector('.timer span')
const elSmiley = document.querySelector('.smiley')
const elMarked = document.querySelector('.marked span')
const defaultLivesCounter = 3

// window.onload = function () {
//     onInit()
// }


function onInit() {
    resetGlobalVars()
    renderScoresTable()
    gBoardBild = buildBoard()
    renderBoard(gBoardBild, '.board-container')
}

function buildBoard() {
    const SIZE = gLevel.SIZE
    const board = []
    for (var i = 0; i < SIZE; i++) {
        board.push([])
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }

    return board
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            if (!cell.isMine) {
                cell.minesAroundCount = countMinesAroundCell(board, i, j)
            }
        }
    }
}

function countMinesAroundCell(board, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var cell = board[i][j]
            if (cell.isMine) count++
        }
    }
    return count
}

function renderBoard(board) {

}

function onCellClicked(elCell, i, j) {

}

function onCellMarked(elCell) {

}

function checkGameOver() {
    gGame.isOn = false
    stopWatch()
    toggleModal('Game over', false)
}

function expandShown(board, elCell, i, j) {

}

function resetGlobalVars() {
    gStartTime = null
    elSmiley.classList.remove('mine_smiley')
    gGame.markedCount = 0
    gGame.shownCount = 0
    elMarked.innerText = 0
    gCountMinesMarked = 0
    gLivesCounter = getMaxLives()
    elLives.innerText = gLivesCounter
    clearInterval(gTimeInterval)
    elTimer.innerText = '00:00'
}

function getMaxLives() {
    return gLevel.MINES < defaultLivesCounter ? gLevel.MINES : defaultLivesCounter
}

function cellClicked(i, j) {
    checkFirstClick(i, j)

    const cell = gBoard[i][j]
    if (cell.isShown || cell.isMarked) {
        return
    }

    // Model
    cell.isShown = true
    increaseShownCount()

    // DOM
    var elCell = document.querySelector(`.cell-${i}-${j}`)
    elCell.classList.add('exposed')

    if (cell.isMine) {
        gLivesCounter--
        elSmiley.classList.add('mine_smiley')
        elLives.innerText = gLivesCounter
        if (!gLivesCounter) {
            gameOver()
            return
        }
    } else {
        elSmiley.classList.remove('mine_smiley')
    }

    checkVictory()

    if (!cell.isMine && cell.minesAroundCount === 0) {
        openNeighbors(gBoard, i, j)
    }
}