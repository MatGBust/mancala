//delay for movement, 1000 = 1 second
var delayMove = 350;

//background colors for win states
const p1WinColor = 'rgb(255, 60, 40)';
const p2WinColor = 'rgb(39, 87, 246)';
const drawColor = 'rgb(147,74, 150)';

var ovrScore = {
    p1: 0,
    p2: 0
};

//used for simpler accessing elements
function l(id) { return document.getElementById(id) };

//board marbles for data
var board = {
    1: {
        marbleNum: 0,
    },
    2: {
        marbleNum: 0,
    },
    3: {
        marbleNum: 0,
    },
    4: {
        marbleNum: 0,
    },
    5: {
        marbleNum: 1,
    },
    6: {
        marbleNum: 0,
    },
    7: {
        marbleNum: 21,
    },
    8: {
        marbleNum: 1,
    },
    9: {
        marbleNum: 0,
    },
    10: {
        marbleNum: 3,
    },
    11: {
        marbleNum: 0,
    },
    12: {
        marbleNum: 0,
    },
    13: {
        marbleNum: 0,
    },
    14: {
        marbleNum: 22,
    },
}

var turnState = true; //true for p1, false for p2
var boardEnabled = true; //allow board to be clicked

function changeTurn() {
    //if p1 turn
    if (turnState) {
        for (let i = 1; i <= 6; i++) {
            document.getElementById(`${i}`).style.opacity = 1;
            //enables movement for right side, if board is enabled
            document.getElementById(`${i}`).onclick = boardEnabled ? function () { move(i) } : null;
        }
        for (let i = 8; i <= 13; i++) {
            document.getElementById(`${i}`).style.opacity = 0.5;
            document.getElementById(`${i}`).onclick = null;
        }
        document.getElementById(7).style.opacity = 1;
        document.getElementById(14).style.opacity = 0.5;
    } else {
        for (let i = 1; i <= 6; i++) {
            document.getElementById(`${i}`).style.opacity = 0.5;
            document.getElementById(`${i}`).onclick = null;
        }
        for (let i = 8; i <= 13; i++) {
            document.getElementById(`${i}`).style.opacity = 1;
            //enables movement for left side, if board is enabled
            document.getElementById(`${i}`).onclick = boardEnabled ? function () { move(i) } : null;
        }
        document.getElementById(7).style.opacity = 0.5;
        document.getElementById(14).style.opacity = 1;
    }

}

function move(id) {
    //current id's marble count
    var marbles = board[id].marbleNum;
    //emptying hole of id at start of turn
    board[id].marbleNum = 0;
    //update hole graphic
    updateGraphic(id);
    //index
    var i = 0;
    //disable board
    boardEnabled = false;
    //ball enable
    var ball = document.getElementById("ball");
    if (turnState) {
        ball.style.backgroundColor = `${p1WinColor}`;
    } else {
        ball.style.backgroundColor = `${p2WinColor}`;
    }
    ball.style.display = 'block';

    function takeTurn() {
        if (i < marbles) {
            //skip first hole
            id++;

            //if reached p1 pit and its not p1 turn, then skip
            if (id == 7 && !turnState) {
                id++;
            }
            //if reached p2 pit and its not p2 turn, then skip
            if (id == 14 && turnState) {
                id++;
            }
            //reset id if end of board
            if (id > 14) {
                id = 1;
            }
            //update marble for current id
            board[id].marbleNum += 1;

            //update gui 
            updateBoard();

            //update hole graphic
            if (id != 7 && id != 14) {
                updateGraphic(id);
            }

            //cursor move
            cursorMove(id);

            //increment index
            i++;
            //delay code
            setTimeout(takeTurn, delayMove);

        } else {
            //enable board again
            boardEnabled = true;

            //disable ball
            ball.style.display = 'none';


            //check capture
            checkCapture(id);

            //checking if last marble landed in own players pit for repeat turn rule
            if (turnState && id == 7) {
                turnState = true;
            } else if (!(turnState) && id == 14) {
                turnState = false;
            } else {
                turnState = !(turnState);
            }

            updateBoard();

            checkWin();
        }
    }

    setTimeout(takeTurn(), delayMove);



}

function cursorMove(id) {
    var ball = document.getElementById("ball");

    var ballPos = ball.getBoundingClientRect();
    var holePos = document.getElementById(`${id}`).getBoundingClientRect();
    //this is the cordinates of board box
    var offset = document.getElementById('board-box').getBoundingClientRect();

    //var ballX = ballPos.left + (ballPos.right-ballPos.left)/2;
    //var ballY = ballPos.top + (ballPos.bottom-ballPos.top)/2;

    //10 is because of border of border box
    var holeX = holePos.left + (holePos.right - holePos.left) / 2 - offset.left - 10;
    var holeY = holePos.top + (holePos.bottom - holePos.top) / 2 - offset.top - 10;

    //var xDiff = holeX - ballX;
    //var yDiff = holeY - ballY;



    //ball.style.transform = `translate(${xDiff}px,${yDiff}px)`;
    ball.style.left = `${holeX - (ballPos.right - ballPos.left) / 2}px`;
    ball.style.top = `${holeY - (ballPos.bottom - ballPos.top) / 2}px`;
    //ball.style.transform = 'translate(0px,0px)';

    //commented out portions for potential smoother transitions

}

function updateBoard() {
    changeTurn(); //updates onclick for current player
    for (i in board) {

        if (i != 7 && i != 14) {
            document.getElementById(`num${i}`).innerHTML = `<p>${board[i].marbleNum}</p>`; //updates text with marble count
        } else {
            document.getElementById(`${i}`).innerHTML = `<p>${board[i].marbleNum}</p>`; //updates text with marble count
        }
        if (board[i].marbleNum == 0) {
            document.getElementById(`${i}`).onclick = null; //not clickable if there are no marbles
        }
    }
}

function updateGraphic(id) {
    var holeImg = document.getElementById(`img${id}`);
    var amt = board[id].marbleNum;
    var randomRot = Math.floor(Math.random() * 4) * 90;
    var prefix = 'assets/marbles';

    switch (amt) {
        case 0:
            holeImg.src = prefix + 'marble0.png';
            holeImg.alt = '0 marbles';
            break;
        case 1:
            holeImg.style.transform = `rotate(${randomRot}deg)`;
            holeImg.src = prefix + 'marble1.png';
            holeImg.alt = '1 marble';
            break;
        case 2:
            holeImg.style.transform = `rotate(${randomRot}deg)`;
            holeImg.src = prefix + 'marble2.png';
            holeImg.alt = '2 marbles';
            break;
        case 3:
            holeImg.style.transform = `rotate(${randomRot}deg)`;
            holeImg.src = prefix + 'marble3.png';
            holeImg.alt = '3 marbles';
            break;
        case 4:
            holeImg.style.transform = `rotate(${randomRot}deg)`;
            holeImg.src = prefix + 'marble4.png';
            holeImg.alt = '4 marbles';
            break;
        case 5:
            holeImg.style.transform = `rotate(${randomRot}deg)`;
            holeImg.src = prefix + 'marble5.png';
            holeImg.alt = '5 marbles';
            break;
        case 6:
            holeImg.style.transform = `rotate(${randomRot}deg)`;
            holeImg.src = prefix + 'marble6.png';
            holeImg.alt = '6 marbles';
            break;
        case 7:
            holeImg.style.transform = `rotate(${randomRot}deg)`;
            holeImg.src = prefix + 'marble7.png';
            holeImg.alt = '7 marbles';
            break;
        case 8:
            holeImg.style.transform = `rotate(${randomRot}deg)`;
            holeImg.src = prefix + 'marble8.png';
            holeImg.alt = '8 marbles';
            break;
        case 9:
            holeImg.style.transform = `rotate(${randomRot}deg)`;
            holeImg.src = prefix + 'marble9.png';
            holeImg.alt = '9 marbles';
            break;
        case 10:
            holeImg.style.transform = `rotate(${randomRot}deg)`;
            holeImg.src = prefix + 'marble10.png';
            holeImg.alt = '10 marbles';
            break;
        case 11:
            holeImg.style.transform = `rotate(${randomRot}deg)`;
            holeImg.src = prefix + 'marble11.png';
            holeImg.alt = '11 marbles';
            break;
        case 12:
            holeImg.style.transform = `rotate(${randomRot}deg)`;
            holeImg.src = prefix + 'marble12.png';
            holeImg.alt = '12 marbles';
            break;
        case 13:
            holeImg.style.transform = `rotate(${randomRot}deg)`;
            holeImg.src = prefix + 'marble13.png';
            holeImg.alt = '13 marbles';
            break;
        case 14:
            holeImg.style.transform = `rotate(${randomRot}deg)`;
            holeImg.src = prefix + 'marble14.png';
            holeImg.alt = '14 marbles';
            break;
        case 15:
            holeImg.style.transform = `rotate(${randomRot}deg)`;
            holeImg.src = prefix + 'marble15.png';
            holeImg.alt = '15 marbles';
            break;
        default:
            holeImg.style.transform = 'rotate(0deg)';
            holeImg.src = 'assets/alot.png';
            holeImg.alt = 'A lot of marbles';
            break;
    }
}

function checkCapture(id) {
    //check if last spot was empty and on current players side
    var player1Side = turnState && id < 7 && id >= 1;
    var player2Side = !turnState && id < 14 && id >= 8;
    //save id of spot adjacent
    var adjSpot = (14 - id) % 14;
    if (board[id].marbleNum != 1 || adjSpot == 0 || adjSpot == 7 || board[adjSpot].marbleNum == 0 || (!player1Side && !player2Side)) {
        return;
    }


    //if player 1 captured
    if (turnState) {
        board[7].marbleNum += board[id].marbleNum + board[adjSpot].marbleNum;
        board[id].marbleNum = 0;
        board[adjSpot].marbleNum = 0;
        updateGraphic(id);
        updateGraphic(adjSpot);
    } else {
        board[14].marbleNum += board[id].marbleNum + board[adjSpot].marbleNum;
        board[id].marbleNum = 0;
        board[adjSpot].marbleNum = 0;
        updateGraphic(id);
        updateGraphic(adjSpot);
    }
    updateBoard();
}

function checkWin() {
    //set default condiiton for loop to check if coloumns is empty
    var p1Win = true;
    var p2Win = true;

    //checks to see if there is an empty column, if a column is not empty then it sets win condition to false
    for (let i = 1; i <= 6; i++) {
        if (board[i].marbleNum != 0) {
            p1Win = false;
        }

        if (board[i + 7].marbleNum != 0) {
            p2Win = false;
        }
    }

    //if neither person won, then it returns to game function
    if (!(p1Win || p2Win)) {
        return;
    }

    //saves elements for easy access
    var winScreen = document.getElementById("winScreen");
    var gameScreen = document.getElementById("game");
    var score1 = document.getElementById("score1");
    var score2 = document.getElementById("score2");
    var winMes = document.getElementById("winMessage");

    //switches screen to win screen
    gameScreen.style.display = 'none';
    winScreen.style.display = 'flex';

    //empties holes to calculate score
    for (let i = 8; i <= 13; i++) {
        board[14].marbleNum += board[i].marbleNum;
        board[i].marbleNum = 0;
    }
    for (let i = 1; i <= 6; i++) {
        board[7].marbleNum += board[i].marbleNum;
        board[i].marbleNum = 0;
    }

    //sets win condition based on who has more marbles
    if (board[7].marbleNum > 24) {
        p1Win = true;
        p2Win = false;
    } else {
        p1Win = false;
        p2Win = true;
    }

    //checks if draw, then displays correct win message
    if (board[14].marbleNum == 24 && board[7].marbleNum == 24) {
        //random turn
        turnState = Math.round(Math.random());

        winScreen.style.backgroundColor = drawColor;
        winMes.innerText = "Draw!";
        score1.innerText = `${board[7].marbleNum}`;
        score2.innerText = `${board[14].marbleNum}`;
        return;
    } else if (p1Win) {
        turnState = false;
        winScreen.style.backgroundColor = p1WinColor;
        winMes.innerText = "P1 Wins!";
        score1.innerText = `${board[7].marbleNum}`;
        score2.innerText = `${board[14].marbleNum}`;
        ovrScore.p1 += 1;
    } else {
        turnState = true;
        winScreen.style.backgroundColor = p2WinColor;
        winMes.innerText = "P2 Wins!";
        score1.innerText = `${board[7].marbleNum}`;
        score2.innerText = `${board[14].marbleNum}`;
        ovrScore.p2 += 1;
    }

    saveGame();
}

function newGame() {
    //get saved wins
    if (localStorage.getItem("game") != null) {
        loadGame();
    } else {
        saveGame();
    }

    for (i in board) {
        if (i == 7 || i == 14) {
            board[i].marbleNum = 0;
        } else {
            board[i].marbleNum = 4;
            updateGraphic(i);
        }

    }

    updateBoard();

    var winScreen = document.getElementById("winScreen");
    var gameScreen = document.getElementById("game");
    var ball = document.getElementById("ball");

    //switches screen to win screen
    gameScreen.style.display = 'flex';
    winScreen.style.display = 'none';

    //set cursor transition
    ball.style.transition = `transform ${delayMove / 1000}s ease-in-out`;

    //ovr stats
    l("play1Score").innerText = ovrScore.p1;
    l("play2Score").innerText = ovrScore.p2;


}

function saveGame() { localStorage.setItem("game", JSON.stringify(ovrScore)); }
function loadGame() { ovrScore = JSON.parse(localStorage.getItem("game")); }
function clearGame() {
    ovrScore.p1 = 0; 
    ovrScore.p2 = 0; 
    localStorage.removeItem("game"); 
    l("play1Score").innerText = ovrScore.p1;
    l("play2Score").innerText = ovrScore.p2;
};