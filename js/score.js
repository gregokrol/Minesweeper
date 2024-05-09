'use strict'

function getScore(level) {
    return localStorage.getItem(`score-${level}`)
}

function setNewScore(time) {
    console.log('setNewScore(time)', time, gLevel);
    localStorage.setItem(`score-${gLevel.level}`, time)
}
function checkBestScore() {
    var duration = time
    var bestScore = getScore(duration)

    if (!bestScore || duration < bestScore) {
        setNewScore(duration)
        renderScoreTable()
        return true
    }
    return false
}

function renderScoreTable() {
    const boardSizes = ['easy', 'medium', 'hard']

    var tableBody = document.querySelector('.scores tbody')
    tableBody.innerHTML = ''

    for (var i in boardSizes) {
        const level = boardSizes[i]
        const tr = document.createElement('tr')

        var tdLevel = document.createElement('td')
        var tdScore = document.createElement('td')

        var score = getScore(level)
        if (!score) {
            score = 'Not set yet'
        }

        tdLevel.innerText = level
        tdScore.innerText = score

        tr.appendChild(tdLevel)
        tr.appendChild(tdScore)

        tableBody.appendChild(tr)
    }
}