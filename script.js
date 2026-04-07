getData();


setInterval(function () {
    getData();
}, 2000);



async function getData() {
    const response = await fetch('https://tinkr.tech/sdb/ander/antiyoy');
    const data = await response.json();

    const parent = document.querySelector('.gamePage');
    parent.innerHTML = ""

    for (const hex of data.map) {
        if (hex.type !== 'impassable') {

            const newDiv = document.createElement('img');
            newDiv.classList.add('hex');
            newDiv.setAttribute('data-type', hex.type);
            newDiv.setAttribute("data-col", hex.col);
            newDiv.setAttribute("data-row", hex.row);
            newDiv.setAttribute("data-id", hex.col + '-' + hex.row);
            newDiv.setAttribute("title", hex.col + '-' + hex.row);
            newDiv.src = 'https://tinkr.tech' + hex.image;
            newDiv.style.position = 'absolute';
            newDiv.style.left = hex.x + 'px';
            newDiv.style.top = hex.y + 'px';
            newDiv.style.width = hex.width + 'px';
            newDiv.style.height = hex.height + 'px';
            parent.appendChild(newDiv);
            document.querySelector('#playerMoney').textContent = data.players[0].money;

            if (hex.unit_image) {
                const unitImg = document.createElement('img');
                unitImg.src = 'https://tinkr.tech' + hex.unit_image;
                unitImg.style.position = 'absolute';
                unitImg.style.left = hex.x + 'px';
                unitImg.style.top = hex.y + 'px';
                parent.appendChild(unitImg);
                unitImg.style.pointerEvents = 'none';
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


let selectedHexCol = null;
let selectedHexRow = null;

const buyUnitButton = document.querySelector('#buyUnit');

buyUnitButton.addEventListener('click', async function () {
    const playerKey = localStorage.getItem('player_key');
    if (!playerKey) {
        console.log('No player_key found. Click "Liitu" first.');
        return;
    }

    const response = await fetch('https://tinkr.tech/sdb/ander/antiyoy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'buy',
            player_key: playerKey,
            "type": "peasant",
            "hex": { "col": selectedHexCol, "row": selectedHexRow }
        })
    });

    const result = await response.json();

    console.log(result);


});

const endTurnButton = document.querySelector('#endTurn');

endTurnButton.addEventListener('click', async function () {
    const playerKey = localStorage.getItem('player_key');
    const response = await fetch('https://tinkr.tech/sdb/ander/antiyoy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: "end_turn",
            player_key: playerKey
        })
    });

    const result = await response.json();
    console.log(result);

})

document.querySelector('#getId').addEventListener('click', function () {
    console.log(localStorage.getItem('player_key'));



});


const startButton = document.querySelector('#startGame');

function readHexCoords(hexElement) {
    const col = Number(hexElement.getAttribute('data-col'));
    const row = Number(hexElement.getAttribute('data-row'));
    if (Number.isNaN(col) || Number.isNaN(row)) {
        return null;
    }
    return { col, row };
}

startButton.addEventListener('click', async function () {
    selectedHexCol = null;
    selectedHexRow = null;
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
    const clickedCoords = readHexCoords(clickedHex);
    if (!clickedCoords) {
        console.log('Invalid hex coordinates');
        return;
    }

    console.log('Hex clicked:', clickedCoords.col, clickedCoords.row);

    if (selectedHexCol === null || selectedHexRow === null) {
        selectedHexCol = clickedCoords.col;
        selectedHexRow = clickedCoords.row;
        console.log('Selected hex type:', clickedHex.getAttribute('data-type'));
        document.querySelector('#selectedHex').textContent = selectedHexCol + '-' + selectedHexRow;
    } else {
        const playerKey = localStorage.getItem('player_key');

        const response = await fetch('https://tinkr.tech/sdb/ander/antiyoy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'move',
                player_key: playerKey,
                from: { col: selectedHexCol, row: selectedHexRow },
                to: { col: clickedCoords.col, row: clickedCoords.row }
            })
        });

        const result = await response.json();

        if (result !== 'ok') {
            selectedHexCol = null;
            selectedHexRow = null;
            document.querySelector('#selectedHex').textContent = selectedHexCol + '-' + selectedHexRow;
        }
        console.log(result);





    }


});
