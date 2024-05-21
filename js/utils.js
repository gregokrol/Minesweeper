'use strict'

function createBoard(ROWS, COLS) {
    var board = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        board.push(row)
    }
    return board
}

function generateNumbers(size) {
    var nums = []
    for (var i = 0; i < size; i++) {
        nums.push(i + 1)
    }
    return nums
}

function shuffleArr(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1))
        var temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp
    }
}

function renderCell(location, value) {
    const cellSelector = '.' + getClassName(location)
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value
}

function disableBoardTemporarily(timeInMs) {
    var timeOut = setTimeout(() => {
        gGame.isOn = true
        clearTimeout(timeOut)
    }, timeInMs)
}

// Neighbours
function getNeighbours(board, cellI, cellJ) {
    var neighbours = []
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[0].length) continue
            var neighborCell = { ...board[i][j] }

            neighborCell.i = i
            neighborCell.j = j
            neighbours.push(neighborCell)
        }
    }
    return neighbours
}

function changeBoardSize(newSize, newMines) {
    gLevel.SIZE = newSize
    gLevel.MINES = newMines
    initGame()
}

// Rand Mine Location
function randMines(board) {
    return [
        getRandomInt(0, board.length),
        getRandomInt(0, board.length)
    ]
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - 1 - min)) + min
}

// Timer
var time
function startTimer() {
    var start = Date.now()
    var elTimer = document.querySelector('.timer')

    gTimer = setInterval(() => {
        const diff = Date.now() - start
        var sec = parseInt(diff / 1000) % 60
        var min = Math.floor(diff / 60000)

        var displayTime = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
        elTimer.innerText = `${displayTime}`
        time = displayTime
    }, 1000);

}

function stopTimer() {
    clearInterval(gTimer)
}

function resetTimer() {
    stopTimer()
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = '00:00'
}

// Dark Mode
function toggleMode() {
    const currentMode = localStorage.getItem('mode')
    const newMode = (currentMode === 'dark' ? 'light' : 'dark')

    localStorage.setItem('mode', newMode)

    applyMode(newMode)
}

function applyMode(mode) {
    const switchButton = document.getElementById('lightMode')
    if (mode === 'dark') {
        switchButton.textContent = 'Dark'
        document.body.classList.add('dark-mode')
    } else {
        switchButton.textContent = 'Light'
        document.body.classList.remove('dark-mode')
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const storedMode = localStorage.getItem('mode')
    if (storedMode) {
        applyMode(storedMode)
    }
})


function resetApplication() {

    gGame.isOn = false;
    gGame.isWin = false;
    gBoard = [];
    gScore = 0;

    clearGameBoard()
    clearScoreDisplay()

    gBoard = buildBoard()

    renderBoard(gBoard)
    renderScoreTable()

    initializeClickListeners()
}

function playWinSound() {
	var audio = new Audio('audio/win.wav')
	audio.play()
}

function playBombSound() {
	var audio = new Audio('audio/bomb.wav')
	audio.play()
}

function playLoseSound() {
	var audio = new Audio('audio/lose.wav')
	audio.play()
}
