'use strict'

function getScore(gLevel) {
    return localStorage.getItem(`score-${gLevel}`)
}

function setNewScore(timer) {
    localStorage.setItem(`score-${gLevel.SIZE}`, timer)
}

function checkBestScore() {
    var duration = time
    var bestScore = getScore(gLevel.SIZE)
    if (!bestScore || duration < bestScore) {
        setNewScore(duration)
        renderScoreTable()
        console.log('true');
        return true
    }

    console.log('false');
    return false
}

// function toggleModal(newBestScore) {
//     var elModalWrapper = document.querySelector('.modal-wrapper')

//     var elH2ModalContent = document.querySelector('.modal .content')
            // elH2ModalContent.innerHTML += ''

//     if (newBestScore) {
//         var elBestScore = document.createElement('div')
//         elBestScore.classList.add('best-score')
//         elBestScore.innerText = `New best score: ${displayTime`${getScore(gLevel.SIZE)}`}`
//         elH2ModalContent.appendChild(elBestScore)
//     }

//     elModalWrapper.classList.toggle('show')
// }

function toggleModal(newBestScore, gLevel) {
    const elModalWrapper = document.querySelector('.modal-wrapper');

    const elH2ModalContent = document.querySelector('.modal .content');
    elH2ModalContent.innerHTML = ''; // Clear previous content

    if (newBestScore) {
        const elBestScore = document.createElement('div');
        elBestScore.classList.add('best-score');
        const bestScoreTime = getScore(gLevel.SIZE);
        elBestScore.innerText = `New best score: ${bestScoreTime}`;
        elH2ModalContent.appendChild(elBestScore);
    }

    elModalWrapper.classList.toggle('show');
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