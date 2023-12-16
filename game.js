//delay for movement
var delayMove = 250;

//background colors for win states
const p1WinColor = 'rgb(255, 60, 40)';
const p2WinColor = 'rgb(39, 87, 246)';
const drawColor = 'rgb(147,74, 150)';


//board marbles for data
var board = {
    1: {
        marbleNum: 4,
    },
    2: {
        marbleNum: 4,
    },
    3: {
        marbleNum: 4,
    },
    4: {
        marbleNum: 4,
    },
    5: {
        marbleNum: 4,
    },
    6: {
        marbleNum: 4,
    },
    7: {
        marbleNum: 0,
    },
    8: {
        marbleNum: 4,
    },
    9: {
        marbleNum: 4,
    },
    10: {
        marbleNum: 4,
    },
    11: {
        marbleNum: 4,
    },
    12: {
        marbleNum: 4,
    },
    13: {
        marbleNum: 4,
    },
    14: {
        marbleNum: 0,
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
    //index
    var i = 0;
    //disable board
    boardEnabled = false;

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

        //increment index
        i++;
        //delay code
        setTimeout(takeTurn, delayMove);

        } else {
            //enable board again
            boardEnabled = true;

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

function updateBoard() {
    changeTurn(); //updates onclick for current player
    for (i in board) {
        document.getElementById(`${i}`).innerHTML = `<p>${board[i].marbleNum}</p>`; //updates text with marble count
        if (board[i].marbleNum == 0) {
            document.getElementById(`${i}`).onclick = null; //not clickable if there are no marbles
        }
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
    } else {
        board[14].marbleNum += board[id].marbleNum + board[adjSpot].marbleNum;
        board[id].marbleNum = 0;
        board[adjSpot].marbleNum = 0;
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

    //checks if draw, else emptys column and gives marbles to other person
    if (board[14].marbleNum == 24 || board[7].marbleNum == 24) {
        //random turn
        turnState = Math.round(Math.random());

        winScreen.style.backgroundColor = drawColor;
        winMes.innerText = "Draw!";
        score1.innerText = `${board[7].marbleNum}`;
        score2.innerText = `${board[14].marbleNum}`;
        return;
    } else if (p1Win) {
        for (let i = 8; i <= 13; i++) {
            board[14].marbleNum += board[i].marbleNum;
            board[i].marbleNum = 0;
        }
    } else {
        for (let i = 1; i <= 6; i++) {
            board[7].marbleNum += board[i].marbleNum;
            board[i].marbleNum = 0;
        }
    }

    //sets win condition based on who has more marbles
    if (board[7].marbleNum > 24) {
        p1Win = true;
        p2Win = false;
    } else {
        p1Win = false;
        p2Win = true;
    }

    //sets win screen based on winning player
    if (p1Win) {
        turnState = false;
        winScreen.style.backgroundColor = p1WinColor;
        winMes.innerText = "P1 Wins!";
        score1.innerText = `${board[7].marbleNum}`;
        score2.innerText = `${board[14].marbleNum}`;
    } else {
        turnState = true;
        winScreen.style.backgroundColor = p2WinColor;
        winMes.innerText = "P2 Wins!";
        score1.innerText = `${board[7].marbleNum}`;
        score2.innerText = `${board[14].marbleNum}`;
    }
}

function newGame() {
    for (i in board) {
        if (i == 7 || i == 14) {
            board[i].marbleNum = 0;
        }
        board[i].marbleNum = 4;
    }

    updateBoard();

    var winScreen = document.getElementById("winScreen");
    var gameScreen = document.getElementById("game");

    //switches screen to win screen
    gameScreen.style.display = 'flex';
    winScreen.style.display = 'none';

}