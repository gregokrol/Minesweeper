'use strict'

function getScore(level) {
    return localStorage.getItem(`score-${level}`)
}

function setNewScore(scoreSeconds) {
    localStorage.setItem(`score-${gLevel.SIZE}`, scoreSeconds)
}

function renderScoreTable() {
    const boardSizes = ['Easy', 'Medium', 'Hard']

    var tableBody = document.querySelector('.scores tbody')
    tableBody.innerHTML = ''

    for (var i in boardSizes) {
        const size = boardSizes[i]
        const tr = document.createElement('tr')

        var tdLevel = document.createElement('td')
        var tdScore = document.createElement('td')

        var score = getScore(size)
        if (!score) {
            score = 'Not set yet'
        } else {
            score = formatTime(score)
        }

        tdLevel.innerText = size
        tdScore.innerText = score

        tr.appendChild(tdLevel)
        tr.appendChild(tdScore)

        tableBody.appendChild(tr)
    }
}