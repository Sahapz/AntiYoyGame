getData();


setInterval(function () {
    getData();
}, 6000);
async function getData() {
    const response = await fetch('https://tinkr.tech/sdb/ander/antiyoy');
    const data = await response.json();

    const parent = document.querySelector('.gamePage');
    parent.innerHTML = ""

    for (const hex of data.map) {
        if (hex.type !== 'impassable') {

            const newDiv = document.createElement('img');
            newDiv.classList.add('hex');
            newDiv.setAttribute("data-col", hex.col);
            newDiv.setAttribute("data-row", hex.row);
            newDiv.src = 'https://tinkr.tech' + hex.image;
            newDiv.style.position = 'absolute';
            newDiv.style.left = hex.x + 'px';
            newDiv.style.top = hex.y + 'px';
            newDiv.style.width = hex.width + 'px';
            newDiv.style.height = hex.height + 'px';
            parent.appendChild(newDiv);

            if (hex.unit_image) {
                const unitImg = document.createElement('img');
                unitImg.src = 'https://tinkr.tech' + hex.unit_image;
                unitImg.style.position = 'absolute';
                unitImg.style.left = hex.x + 'px';
                unitImg.style.top = hex.y + 'px';
                parent.appendChild(unitImg);
            }
        }
    }
}

const joinButton = document.querySelector('#joinGame');

joinButton.addEventListener('click', async function () {
    const response = await fetch('https://tinkr.tech/sdb/ander/antiyoy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'join',
            username: 'alice'
        })
    });

    const result = await response.json();

    console.log(result);

    localStorage.setItem('player_key', result.player_key);
});

document.querySelector('#getId').addEventListener('click', function () {
    console.log(localStorage.getItem('player_key'));



});
const startButton = document.querySelector('#startGame');

startButton.addEventListener('click', async function () {
    const response = await fetch('https://tinkr.tech/sdb/ander/antiyoy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'start',
        })
    });

    const result = await response.json();

    console.log(result);
});


const gamePage = document.querySelector('.gamePage');

gamePage.addEventListener('click', async function (event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
        return;
    }

    const clickedHex = target.closest('.hex');
    if (!clickedHex) {
        return;
    }
    console.log('Hex clicked:', clickedHex.getAttribute('data-col'), clickedHex.getAttribute('data-row'));

    const response = await fetch('https://tinkr.tech/sdb/ander/antiyoy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'move',
            player_key: localStorage.getItem('player_key'),
            from: { col: clickedHex.getAttribute('data-col'), row: clickedHex.getAttribute('data-row') },
            to: { col: 4, row: 5 }
        })
    });

    const result = await response.json();
    console.log(result);
});
