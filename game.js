
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

function changeTurn(){
    //if p1 turn
    if(turnState){
        for(let i = 1; i <= 6; i++){
            document.getElementById(`${i}`).style.opacity = 1;
            document.getElementById(`${i}`).onclick = function(){move(i)}; //enables movement for right side 
        }
        for(let i = 8; i <= 13; i++){
            document.getElementById(`${i}`).style.opacity = 0.5;
            document.getElementById(`${i}`).onclick = null; 
        }
        document.getElementById(7).style.opacity = 1; 
        document.getElementById(14).style.opacity = 0.5; 
    } else  {
        for(let i = 1; i <= 6; i++){
            document.getElementById(`${i}`).style.opacity = 0.5;
            document.getElementById(`${i}`).onclick = null; 
        }
        for(let i = 8; i <= 13; i++){
            document.getElementById(`${i}`).style.opacity = 1;
            document.getElementById(`${i}`).onclick = function(){move(i)}; //enables movement for left side 
        }
        document.getElementById(7).style.opacity = 0.5; 
        document.getElementById(14).style.opacity = 1; 
    }
    
}

function move(id){
    //current id's marble count
    var marbles = board[id].marbleNum; 
    //emptying hole of id at start of turn
    board[id].marbleNum = 0; 
    
    for(let i = 0; i < marbles; i++){
        //skip first hole
        id++; 

        //if reached p1 pit and its not p1 turn, then skip
        if (id == 7 && !turnState){
            id++;
        }
        //if reached p2 pit and its not p2 turn, then skip
        if (id == 14 && turnState){
            id++;
        }
        //reset id if end of board
        if(id > 14){
            id = 1;
        }
        //update marble for current id
        board[id].marbleNum += 1;

        //update gui 
        updateBoard();
        //setTimeout(() => {  console.log("World!"); }, 500);
    }

    checkCapture(id);

    //checking if last marble landed in own players pit for repeat turn rule
    if(turnState && id == 7){
        turnState = true;
    } else if(!(turnState) && id == 14){
        turnState = false;
    } else{
        turnState = !(turnState);
        updateBoard(); 
    }

    checkWin();
    
}

function updateBoard(){
    changeTurn(); //updates onclick for current player
    for(i in board){
        document.getElementById(`${i}`).innerHTML = `<p>${board[i].marbleNum}</p>`; //updates text with marble count
        if(board[i].marbleNum == 0){
            document.getElementById(`${i}`).onclick = null; //not clickable if there are no marbles
        }
    }
}

function checkCapture(id){
    //check if last spot was empty and on current players side
    var player1Side = turnState && id < 7 && id >= 1;
    var player2Side = !turnState && id < 14 && id >= 8;
    //save id of spot adjacent
    var adjSpot = (14-id)%14;
    if(board[id].marbleNum != 1 || adjSpot == 0 || adjSpot == 7 || board[adjSpot].marbleNum == 0 || (!player1Side && !player2Side)){
        return;
    }

    
    //if player 1 captured
    if(turnState){
        board[7].marbleNum += board[id].marbleNum + board[adjSpot].marbleNum;
        board[id].marbleNum = 0;
        board[adjSpot].marbleNum = 0;
    } else{
        board[14].marbleNum += board[id].marbleNum + board[adjSpot].marbleNum;
        board[id].marbleNum = 0;
        board[adjSpot].marbleNum = 0;
    }
    updateBoard();
}

function checkWin(){
    //set default condiiton for loop to check if coloumns is empty
    var p1Win = true;
    var p2Win = true;

    for(let i = 1; i <= 6; i++){
        if(board[i].marbleNum != 0){
            p1Win = false;
        }

        if(board[i+7].marbleNum != 0){
            p2Win = false;
        }
    }

    if(!(p1Win || p2Win)){
        return;
    }
    

    var winScreen = document.getElementById("winScreen");
    var gameScreen = document.getElementById("game");

    gameScreen.style.display = 'none';
    winScreen.style.display = 'flex';

    if(board[14].marbleNum == 24 || board[7].marbleNum == 24){
        console.log("tie");
        winScreen.style.backgroundColor = drawColor;
        return;
    } else if(p1Win){
        for(let i = 8; i <= 13; i++){
            board[14].marbleNum += board[i].marbleNum;
            board[i].marbleNum = 0;
        }
    } else{
        for(let i = 1; i <= 6; i++){
            board[7].marbleNum += board[i].marbleNum;
            board[i].marbleNum = 0;
        }
    }

    if(board[7].marbleNum > 24){
        p1Win = true;
        p2Win = false;
    } else{
        p1Win = false;
        p2Win = true;
    }

    if(p1Win){
        console.log("p1 wins");
        winScreen.style.backgroundColor = p1WinColor;
    } else{
        console.log("p2 wins");
        winScreen.style.backgroundColor = p2WinColor;
    }




}