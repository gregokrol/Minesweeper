'use strict'

// Const
const FLAG = ' 🚩'
const BOMB = '💣'
const EMPTY = ' '
const elLives = document.querySelector('.lives')
const elTimer = document.querySelector('.timer')
// const elSmiley = document.querySelector('.smiley')
// const elMarked = document.querySelector('.marked')
const defaultLivesCounter = 3

// Global
var gBoard
var gStartTime
var gTimeInterval
var gLivesCounter
var gCountMinesMarked = 0

var gGame = {
    isOn: false,
    isFirstTurn: true,
    shownCount: 0,
    numsCount: 0,
    markedCount: 0,
    secsPassed: 0,
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
                mineNegCount: 0
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

// TODO: pain numbers in cells
function colorDigits(elCell, value) {
    switch (value) {
        case 1:
            elCell.style.td.cell.cell = '#00b2ca'
            break
        case 2:
            elCell.style.td.cell.cell = '#43aa8b'
            break
        case 3:
            elCell.style.color = '#ae2012'
            break
        case 4:
            elCell.style.color = '#90be6d'
            break
        case 5:
            elCell.style.color = '#f9c74f'
            break
        case 6:
            elCell.style.color = '#f9844a'
            break
        case 7:
            elCell.style.color = '#f3722c'
            break
        case 8:
            elCell.style.color = '#f94144'
            break
    }
}

function setMines(negCells, rowIdx, colIdx) {

    for (var i = 0; i < gLevel.MINES; i++) {

        var randCell = gBoard[getRandomInt(0, gLevel.SIZE)][getRandomInt(0, gLevel.SIZE)]

        if (gGame.mines.includes(randCell.location) || negCells.includes(randCell) || randCell === gBoard[rowIdx][colIdx]) {
            i--
            continue
        }

        randCell.isMine = true
        gGame.mines.push(randCell.location)
    }
}

function setMinesNegCount(board, rowIdx, colIdx) {

    var mineNegCount = 0
    var negCells = []

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {

        if (i < 0 || i >= board.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {

            if (j < 0 || j >= board[0].length) continue
            if (i === rowIdx && j === colIdx) continue

            if (board[i][j].isMine) mineNegCount++
            else negCells.push(board[i][j])
        }
    }

    if (gGame.isFirstTurn) {
        gGame.isFirstTurn = false
        setMines(negCells, rowIdx, colIdx)
    }

    board[rowIdx][colIdx].mineNegCount = mineNegCount

    if (mineNegCount === 0) {
        negCells.forEach(cell => {
            if (!cell.isMine) onCellClicked(board, cell.location.i, cell.location.j)
        })
        return ''
    }

    return mineNegCount
}

function onCellClicked(board, rowIdx, colIdx) {
    if (!gGame.isOn) return

    const clickedCell = board[rowIdx][colIdx]

    if (clickedCell.isShown) return
    if (clickedCell.isMarked) return
    if (clickedCell.isMine) return gameOver()

    clickedCell.isShown = true

    gGame.shownCount++

    setMinesNegCount(board, rowIdx, colIdx)

    renderCell(rowIdx, colIdx, clickedCell.mineNegCount)


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

    if (gLevel.MINES !== gGame.markedCount) return

    for (var i = 0; i < gGame.flaggedCells.length; i++) {
        if (!gGame.flaggedCells[i].isMine) return
    }

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            const currCell = gBoard[i][j]
            if (currCell.isMine) continue
            if (!currCell.isShown) return
        }
    }

    elModal.innerHTML = 'GREAT, YOU WIN!'
}

function gameOver() {
    const elModal = document.querySelector('.modal')

    for (var i = 0; i < gGame.mines.length; i++) {
        const cellRowIdx = gGame.mines[i].i
        const cellColIdx = gGame.mines[i].j

        renderCell(cellRowIdx, cellColIdx, BOMB)
    }
    elModal.innerHTML = 'Lose, Maybe next time...'
    gGame.isOn = false
}

function resetGame() {
    const elModal = document.querySelector('.modal')
    const elBoard = document.querySelector('.game-board')

    gGame = {
        isOn: false,
        isFirstTurn: true,
        shownCount: 0,
        numsCount: 0,
        markedCount: 0,
        secsPassed: 0,
        mines: [],
        flaggedCells: []
    }

    elModal.innerHTML = ''

    elBoard.removeEventListener('contextmenu', flagCell)
    onInit()
}

