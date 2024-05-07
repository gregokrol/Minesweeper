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

function getNeighbours(board, cellI, cellJ) {
    var neighbours = []
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[0].length) continue
            board[i][j].i = i
            board[i][j].j = j
            neighbours.push(board[i][j])
        }
    }
    return neighbours
}

function changeBoardSize(newSize, newMines) {
    gLevel.SIZE = newSize
    gLevel.MINES = newMines
    initGame()
}

function randMines(board) {
    return [
        getRandomInt(0, board.length),
        getRandomInt(0, board.length)
    ]
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - 1 - min)) + min
}

function startTimer() {
    var start = Date.now()
    var elTimer = document.querySelector('.timer')

    gTimer = setInterval(() => {
        const diff = Date.now() - start
        var secs = parseInt(diff / 1000) % 60
        var min = Math.floor(diff / 60000)

        var displayTime = `${min.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        elTimer.innerText = `${displayTime}`

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

function toGoDarkMode(light) {
    if (light === 'light') {
        var element = document.body
        element.classList.toggle("dark-mode")
    }
}