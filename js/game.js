'use strict'

// Const
const FLAG = ' 🚩'
const BOMB = '💣'
const EMPTY = ' '

// Global
var gBoard
var gTimer
var gTimerInterval

var gGame = {
    isOn: false,
    isWin: false,
    isFirstTurn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 2,
    mines: [],
    flaggedCells: []
}

function onInit() {
    gBoard = buildBoard()
    renderBoard(gBoard)
    initializeClickListeners()
    renderScoreTable()
    gGame.isOn = true

}

function buildBoard() {
    const size = gLevel.SIZE
    const board = []

    for (var i = 0; i < size; i++) {
        board[i] = []

        for (var j = 0; j < size; j++) {
            board[i][j] = {
                location: { i, j },
                isMine: false,
                isShown: false,
                isMarked: false,
                mineCount: 0
            }
        }
    }
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const className = `cell cell-${i}-${j}`

            strHTML += `<td class="${className}" data-i="${i}" data-j="${j}" onclick="onCellClicked(gBoard, ${i}, ${j})"></td>`
        }
        strHTML += '</tr>\n'
    }
    var elBoard = document.querySelector('.game-board')
    elBoard.innerHTML = strHTML
}

function renderCell(rowIdx, colIdx, value) {
    const elCell = document.querySelector(`.cell-${rowIdx}-${colIdx}`)

    if (value === 0) {
        value = ''
        elCell.classList.add('empty-cell')
    }

    elCell.innerText = value
}

function setMines(nonMines, rowIdx, colIdx) {

    for (var i = 0; i < gLevel.MINES; i++) {

        var randCell = gBoard[getRandomInt(0, gLevel.SIZE)][getRandomInt(0, gLevel.SIZE)]

        if (gGame.mines.includes(randCell.location) || nonMines.includes(randCell) || randCell === gBoard[rowIdx][colIdx]) {
           console.log(randCell.location,'randCell.location',randCell,'randCell',gBoard[rowIdx][colIdx],'gBoard[rowIdx][colIdx]');
            i--
            continue
        }

        randCell.isMine = true
        gGame.mines.push(randCell.location)
    }
}

function adjacentMinesAndnonMines(board, rowIdx, colIdx) {

    var mineCount = 0
    var nonMines = []

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {

        if (i < 0 || i >= board.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {

            if (j < 0 || j >= board[0].length) continue
            if (i === rowIdx && j === colIdx) continue

            if (board[i][j].isMine) mineCount++
            else nonMines.push(board[i][j])
        }
    }

    if (gGame.isFirstTurn) {
        startTimer()
        gGame.isFirstTurn = false
        setMines(nonMines, rowIdx, colIdx)

    }

    board[rowIdx][colIdx].mineCount = mineCount

    if (mineCount === 0) {
        nonMines.forEach(cell => {
            if (!cell.isMine) onCellClicked(board, cell.location.i, cell.location.j)
        })
        return ''
    }

    return mineCount
}

function onCellClicked(board, rowIdx, colIdx) {
    if (!gGame.isOn) return

    const clickedCell = board[rowIdx][colIdx]

    if (clickedCell.isShown) return
    if (clickedCell.isMarked) return
    if (clickedCell.isMine) return stillLive()//gameOver()
    clickedCell.isShown = true

    gGame.shownCount++

    adjacentMinesAndnonMines(board, rowIdx, colIdx)

    renderCell(rowIdx, colIdx, clickedCell.mineCount)


    checkWin()
}

function initializeClickListeners() {

    const elBoard = document.querySelector('.game-board')
    elBoard.addEventListener('contextmenu', flagCell, false)
}

function flagCell(ev) {

    ev.preventDefault()

    if (!gGame.isOn) return

    const elClickedCell = ev.target
    const cellRowIdx = elClickedCell.dataset.i
    const cellColIdx = elClickedCell.dataset.j

    var clickedCell = gBoard[cellRowIdx][cellColIdx]
    var value = FLAG

    if (clickedCell.isShown) return

    if (!clickedCell.isMarked) {
        clickedCell.isMarked = true
        gGame.flaggedCells.push(clickedCell)
        gGame.markedCount++
    }
    else {
        clickedCell.isMarked = false
        gGame.flaggedCells.pop()
        gGame.markedCount--
        value = ''
    }
    renderCell(cellRowIdx, cellColIdx, value)

    checkWin()

    return false
}

function checkWin() {
    const elModal = document.querySelector('.modal')
    // var winTime = 0
    if (gLevel.MINES !== gGame.markedCount) return

    for (var i = 0; i < gGame.flaggedCells.length; i++) {
        if (!gGame.flaggedCells[i].isMine) return
    }

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            const currCell = gBoard[i][j]
            if (currCell.isMine) continue
        }
        gGame.isWin = true
        const imageSrc = '../img/win.jpg'
        const elImage = document.querySelector('.reset-game')
        elImage.setAttribute('src', imageSrc)
    }
    elModal.innerHTML = 'GREAT, YOU WIN!'
    gGame.isOn = false
    stopTimer()
}

function gameOver() {
    const elModal = document.querySelector('.modal')

    for (var i = 0; i < gGame.mines.length; i++) {
        const cellRowIdx = gGame.mines[i].i
        const cellColIdx = gGame.mines[i].j

        renderCell(cellRowIdx, cellColIdx, BOMB)
        gGame.isWin = false
        const imageSrc = '../img/lose.jpg'
        const elImage = document.querySelector('.reset-game')
        elImage.setAttribute('src', imageSrc)
    }

    elModal.innerHTML = 'You Lose, Maybe next time...'
    gGame.isOn = false
    stopTimer()
}

function resetGame() {
    const elModal = document.querySelector('.modal')
    const elBoard = document.querySelector('.game-board')

    var elLives = document.querySelector('.lives')
    elLives.innerText = '❤️❤️❤️'

    gGame = {
        isOn: false,
        isWin: false,
        isFirstTurn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: 2,
        mines: [],
        flaggedCells: []
    }

    const elImage = document.querySelector('.reset-game')
    elImage.setAttribute('src', '../img/Smiley.jpg')

    elModal.innerHTML = ''

    elBoard.removeEventListener('contextmenu', flagCell)
    stopTimer()
    resetTimer()
    onInit()
}