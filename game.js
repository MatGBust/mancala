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
    if(turnState){
        for(let i = 1; i <= 6; i++){
            document.getElementById(`${i}`).onclick = function(){move(i)}; 
        }
        for(let i = 8; i <= 13; i++){
            document.getElementById(`${i}`).onclick = null; 
        }
    } else  {
        for(let i = 1; i <= 6; i++){
            document.getElementById(`${i}`).onclick = null; 
        }
        for(let i = 8; i <= 13; i++){
            document.getElementById(`${i}`).onclick = function(){move(i)}; 
        }
    }
    
}

function move(id){
    marbles = board[id].marbleNum;
    lastPos = (id + marbles)%14;
    board[id].marbleNum = 0;
    for(let i = 0; i < marbles; i++){
        id++;
        if (id == 7 && turnState){
            id++;
        }
        if (id == 14 && !(turnState)){
            id++;
        }
        if(id > 14){
            id = 1;
        }
        board[id].marbleNum += 1;
        updateBoard();
        //setTimeout(() => {  console.log("World!"); }, 500);
    }

    if(turnState && lastPos == 7){
        turnState = true;
    } else if(!(turnState) && lastPos == 0){
        turnState = false;
    } else{
        turnState = !(turnState);
        updateBoard();
    }
    
}

function updateBoard(){
    changeTurn();
    for(i in board){
        document.getElementById(`${i}`).innerHTML = `<p>${board[i].marbleNum}</p>`;
    }
}