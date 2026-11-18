let deck = [];
for (let i = 0; i <= 6; i++) {
    for (let j = i; j <= 6; j++) {
        deck.push([i, j]);
    }
}

deck.sort(() => Math.random() - 0.5);

let player1Hand = deck.splice(0, 7);
let player2Hand = deck.splice(0, 7);
let board = [];

let turn = 1; 
let leftEnd = null;
let rightEnd = null;

const boardArea = document.getElementById("board-area");
const playerHandEl = document.getElementById("player-hand");
const gameStatus = document.getElementById("game-status");
const p1ScoreEl = document.getElementById("p1-score");
const p2ScoreEl = document.getElementById("p2-score");
const handTitle = document.getElementById("hand-title");
const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");

function renderGame() {
    if (board.length === 0) {
        boardArea.innerHTML = `<div class="board-placeholder">الطاولة فارغة، العب أول قطعة!</div>`;
    } else {
        boardArea.innerHTML = "";
        board.forEach(tile => {
            let div = document.createElement("div");
            div.className = "domino-tile";
            div.style.borderColor = "#555";
            div.textContent = `[${tile[0]} | ${tile[1]}]`;
            boardArea.appendChild(div);
        });
        boardArea.scrollLeft = boardArea.scrollWidth;
    }

    let currentHand = (turn === 1) ? player1Hand : player2Hand;
    playerHandEl.innerHTML = "";
    currentHand.forEach((tile, index) => {
        let div = document.createElement("div");
        div.className = "domino-tile";
        div.textContent = `[${tile[0]} | ${tile[1]}]`;
        div.onclick = () => playTile(index);
        playerHandEl.appendChild(div);
    });

    p1ScoreEl.textContent = `قطعك: ${player1Hand.length}`;
    p2ScoreEl.textContent = `قطع الخصم: ${player2Hand.length}`;
    gameStatus.textContent = (turn === 1) ? "دورك (اللاعب 1)" : "دور الخصم (اللاعب 2)";
    handTitle.textContent = (turn === 1) ? "قطعك (اختر للعب):" : "دور اللاعب 2 (قم بتسليم الهاتف):";

    if (player1Hand.length === 0) {
        gameStatus.textContent = "🎉 فاز اللاعب 1 (أنت)!";
        addChatMessage("النظام", "انتهت الجولة بفوز اللاعب الأول!");
    } else if (player2Hand.length === 0) {
        gameStatus.textContent = "🎉 فاز اللاعب 2!";
        addChatMessage("النظام", "انتهت الجولة بفوز اللاعب الثاني!");
    }
}

function playTile(index) {
    let currentHand = (turn === 1) ? player1Hand : player2Hand;
    let tile = currentHand[index];

    if (board.length === 0) {
        board.push(tile);
        leftEnd = tile[0];
        rightEnd = tile[1];
        currentHand.splice(index, 1);
        switchTurn();
    } else {
        if (tile[0] === leftEnd || tile[1] === leftEnd) {
            if (tile[1] === leftEnd) {
                board.unshift(tile);
                leftEnd = tile[0];
            } else {
                board.unshift([tile[1], tile[0]]);
                leftEnd = tile[1];
            }
            currentHand.splice(index, 1);
            switchTurn();
        } else if (tile[0] === rightEnd || tile[1] === rightEnd) {
            if (tile[0] === rightEnd) {
                board.push(tile);
                rightEnd = tile[1];
            } else {
                board.push([tile[1], tile[0]]);
                rightEnd = tile[0];
            }
            currentHand.splice(index, 1);
            switchTurn();
        } else {
            addChatMessage("النظام", "❌ القطعة لا تطابق الأطراف!");
        }
    }
    renderGame();
}

function switchTurn() {
    turn = (turn === 1) ? 2 : 1;
}

function drawTile() {
    if (deck.length > 0) {
        let drawn = deck.pop();
        if (turn === 1) player1Hand.push(drawn);
        else player2Hand.push(drawn);
        addChatMessage("النظام", `سحب اللاعب ${turn} قطعة.`);
        renderGame();
    } else {
        addChatMessage("النظام", "البنك فارغ!");
    }
}

function sendCustomMessage() {
    let text = chatInput.value.trim();
    if (text !== "") {
        let senderName = (turn === 1) ? "اللاعب 1 (أنت)" : "اللاعب 2";
        addChatMessage(senderName, text);
        chatInput.value = "";
    }
}

chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendCustomMessage();
});

function addChatMessage(sender, text) {
    let msgDiv = document.createElement("div");
    msgDiv.className = "msg";
    msgDiv.innerHTML = `<b>${sender}:</b> ${text}`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

renderGame();