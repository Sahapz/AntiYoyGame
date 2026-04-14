getData();





let currentPlayer = null;
let selectedHexCol = null;
let selectedHexRow = null;

setInterval(function () {
    if (currentPlayer === localStorage.getItem('player_name')) {
        return;
    }

    getData();
}, 1500);

function notify(message) {
    document.querySelector('#notification').textContent = message;
    document.querySelector('#notificationDiv').classList.remove('hidden');

    setTimeout(function () {
        document.querySelector('#notificationDiv').classList.add('hidden');
    }, 5000);
}


async function getData() {
    const response = await fetch('https://tinkr.tech/sdb/ander/antiyoy');
    const data = await response.json();

    const parent = document.querySelector('.gamePage');
    parent.innerHTML = ""
    document.querySelector('#gameStatus').textContent = data.phase
    document.querySelector('#gameTurn').textContent = data.turn
    document.querySelector('#gameCurrentPlayer').textContent = data.current_player
    currentPlayer = data.current_player;
    document.querySelector('#gameLastWinner').textContent = data.last_winner

    document.querySelector('#yourName').textContent = localStorage.getItem('player_name')
    for (const player of data.players) {
        if (player.name === localStorage.getItem('player_name')) {
            document.querySelector('#yourMoney').textContent = player.money;
            document.querySelector('#yourIncome').textContent = player.income;
        }
    }

    if (currentPlayer === localStorage.getItem('player_name')) {
        document.querySelector('#gameCurrentPlayer').classList.remove('text-mauve-400');
        document.querySelector('#gameCurrentPlayer').classList.add('text-green-400');
    } else {
        document.querySelector('#gameCurrentPlayer').classList.remove('text-green-400');
        document.querySelector('#gameCurrentPlayer').classList.add('text-mauve-400');
    }


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
            document.querySelector('#yourMoney').textContent = data.players[0].money;


            if (hex.building_image) {
                const unitImg = document.createElement('img');
                unitImg.src = 'https://tinkr.tech' + hex.building_image;
                unitImg.style.position = 'absolute';
                unitImg.style.left = hex.x + 'px';
                unitImg.style.top = hex.y + 'px';
                parent.appendChild(unitImg);
                unitImg.style.pointerEvents = 'none';
            }

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

async function getHexData(col, row) {
    const response = await fetch('https://tinkr.tech/sdb/ander/antiyoy');
    const data = await response.json();

    for (const hex of data.map) {
        if (hex.col == col && hex.row == row) {
            return hex;
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
            username: document.querySelector('#playerNameInput').value
        })
    });

    const result = await response.json();

    console.log(result);

    localStorage.setItem('player_name', document.querySelector('#playerNameInput').value);


    localStorage.setItem('player_key', result.player_key);
});




const buyUnitButton = document.querySelector('#buyUnit');

buyUnitButton.addEventListener('click', async function () {
    const playerKey = localStorage.getItem('player_key');
    if (!playerKey) {
        console.log(' .');
        return;
    }

    if (selectedHexCol === null || selectedHexRow === null) {
        notify('Vali ennem tühi ruut, mis on sinu oma!');
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
            "type": buyUnitButton.getAttribute('data-type'),
            "hex": { "col": selectedHexCol, "row": selectedHexRow }
        })
    });

    const result = await response.json();

    if (result !== 'ok') {
        if (result.error === 'cannot_afford') {
            notify('Sul pole piisavalt raha! Sul on puudu ' + (result.cost - parseInt(document.querySelector('#yourMoney').textContent)) + '$!');
        }
    }
    console.log(result);
    getData();
    selectedHexCol = null;
    selectedHexRow = null;


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
    getData();
})




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
    await getData();
});


const gamePage = document.querySelector('.gamePage');


gamePage.addEventListener('click', async function (event) {

    const playerKey = localStorage.getItem('player_key');

    if (currentPlayer !== localStorage.getItem('player_name')) {
        return;
    }

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


    const hexData = await getHexData(clickedCoords.col, clickedCoords.row);
    console.log('Hex clicked:', clickedCoords.col, clickedCoords.row, 'Owner:', hexData.owner);

    if (hexData.building === 'farm' || hexData.building === 'fortress' || hexData.building === 'tower') {
        notify('See on ehitis, seda ei saa liigutada!');
        return;
    }

    if (selectedHexCol === null || selectedHexRow === null) {
        if (hexData.owner === localStorage.getItem('player_name')) {
            selectedHexCol = clickedCoords.col;
            selectedHexRow = clickedCoords.row;
            console.log('Successfully selected hex type:', clickedHex.getAttribute('data-type'));
            document.querySelector('#selectedHex').textContent = selectedHexCol + '-' + selectedHexRow;
            target.style.filter = 'brightness(1.3)';
        }
    } else {
        if (!hexData.unit && !hexData.building) {
            console.log('Trying to move from', selectedHexCol, selectedHexRow, 'to', clickedCoords.col, clickedCoords.row);
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
                if (result.error === 'unit_already_moved') {
                    notify('See mehikene juba liikus!');
                } else if (result.error === 'no_unit') {
                    notify('Sellel ruudul ei ole üksust!');
                } else if (result === 'unreachable') {
                    notify('Sa ei saa nii kaugele minna!');
                }
            }

            console.log('lINE 261:' + JSON.stringify(result));
        } else {
            notify('Sellel ruudul on midagi ees!');
        }



        getData();



    }


});
