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
		marbleNum: 4,
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
		marbleNum: 4,
	},
}

var turnState = true; //true for p1, false for p2

function updateBoard(){
    for(i in board){
        console.log((i.marbleNum).toString())
        document.getElementById(`${i}`).innerHTML = `${i.marbleNum}`;
    }
}

function changeTurn(){
    if(turnState){
        for(let i = 1; i <= 6; i++){
            document.getElementById(`#${i}`).onclick = `move(${i})`; 
        }
        for(let i = 8; i <= 13; i++){
            document.getElementById(`#${i}`).onclick = ``; 
        }
    } else  {
        for(let i = 1; i <= 6; i++){
            document.getElementById(`#${i}`).onclick = ``; 
        }
        for(let i = 8; i <= 13; i++){
            document.getElementById(`#${i}`).onclick = `move(${i})`; 
        }
    }
}

function move(id){
    marbles = board.id.marbleNum;
    lastPos = (id + marbles)%14;
    board.id.marbleNum = 0;
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
        board.id.marbleNum += 1;
        updateBoard();
        setTimeout(() => {  console.log("World!"); }, 500);
    }
    if(turnState && lastPos == 7){
        turnState = true;
    } else if(!(turnState) && lastPos == 0){
        turnState = false;
    } else{
        turnState = !(turnState);
        changeTurn();
    }
    
}