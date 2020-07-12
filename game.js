class Enemy{
    constructor(x,y,roomx,roomy,piece, pieceNumber){
        this.x = x;
        this.y = y;
        this.roomx = roomx;
        this.roomy = roomy;
        this.piece = piece;
        this.pieceNumber = pieceNumber;
        this.alive = true;
    }
}

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var STICKY_THRESHOLD = 0.004;
var ground = {x:0, y:425, width: canvas.width, height: 50, mode:-1, restitution:0.1};
var level = [ground,{x : 200, y:350, width: 90, height: 50, mode:-1, restitution:0.2},
    {x:350,y:350,width:50,height:100, mode:-1, restitution:0.2}, {x:550, y:350,width:100,height:100, mode:-1, restitution:0.2},
    {x:350,y:250,width:50,height:100,mode:0, restitution:0.2}];
var player = {x:3, y:5, piece:"pawn", currentPiece: 8, blockedColor: "black", alive:true};
var flag = {x:4, y:1};
var wassets = ["wpawn.png","wknight.png","wbishop.png","wrook.png","wqueen.png"];
var bassets = ["bpawn.png","bknight.png","bbishop.png","brook.png","bqueen.png"];
var pieceArr = ["pawn","knight","bishop","rook","queen"];
var boardLength = 8;
// var blackSquares = [[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[6,5],[6,6],[7,6],[8,6]];
// var whiteSquares = [[2,7],[3,7],[4,7],[5,7],[6,7],[2,8],[3,8],[4,8],[5,8],[6,8],[5,9],[3,9],[4,10]];
var currentRoom = [1,4];
var flagRoom = [2,0];
var enemy = new Enemy(3,3,1,4,"knight",7);
enemies = [];
var enemyMove;
// var flagRoom = [1,4]
var room0 = [];
var room1 = [[1,4],[3,1],[3,5],[4,2],[4,5],[5,2],[5,5]];
var room2 = [[1,1],[1,4],[3,2],[4,2],[5,2],[2,3],[5,3],[2,4],[5,5],[5,6],[6,6]];
var room3 = [[6,1],[2,2],[4,2],[3,3],[4,3],[5,3],[3,4],[4,4],[1,5],[5,5],[5,6]];
var room4 = [[1,6],[3,1],[2,2],[5,2],[5,3],[2,4],[5,5]];
var room5 = [[1,3],[6,1],[3,2],[5,2],[2,3],[6,3],[4,4],[3,5],[6,6]];
var knightRoom = [[3,3],[5,3],[2,4],[6,6],[6,4],[2,6]];
var noRoom = filledRoom();
var door1 = [[0,3],[0,4]];
var door2 = [[3,0],[4,0]];
var door3 = [[7,3],[7,4]];
var door4 = [[3,7],[4,7]];
var generated = false;
var roomLayout = [[room5,room2,room1],[room4,room5,room3],[room3,room2,room1],[noRoom,knightRoom,noRoom],[noRoom,room0,noRoom]];
var doorLayout = [[[door3,door4],[door1,door3,door4],[door1,door4]],
                    [[door2,door3,door4],[door1,door2,door3,door4],[door1,door2,door4]],
                    [[door2,door3],[door1,door2,door3,door4],[door1,door2]],
                    [[],[door2,door4],[]],
                    [[],[door2],[]]];

{var flagImg = new Image();
flagImg.src = "assets/flag.png";
// var flag = {x:4, y:9}
var board = [];
var moveableSquares = [];
var wqueen = new Image();
wqueen.src = "assets/"+wassets[4];
var wrook = new Image();
wrook.src = "assets/"+wassets[3];
var wbishop = new Image();
wbishop.src  = "assets/"+wassets[2];
var wknight = new Image();
wknight.src  = "assets/"+wassets[1];
var bqueen = new Image();
bqueen.src = "assets/"+bassets[4];
var brook = new Image();
brook.src = "assets/"+bassets[3];
var bbishop = new Image();
bbishop.src  = "assets/"+bassets[2];
var bknight = new Image();
bknight.src  = "assets/"+bassets[1];
var wking = new Image();
wking.src = "assets/wking.png";
var bking = new Image();
bking.src = "assets/bking.png";
var wpawn = new Image();
wpawn.src = "assets/wpawn.png";
var bpawn = new Image();
bpawn.src = "assets/bpawn.png";
imgs = [wqueen, wrook, wbishop, wknight, bqueen, brook, bbishop, bknight, wpawn];
win = false;
lose = false;
}
// var queue = [0,1,2,3];
var queue = [8,8,8,8];
function filledRoom() {
    var room = [];
    for(var i =1; i < 7; i++){
        for(var j = 1; j< 7;j++){
            room.push([i,j]);
        }
    }
    return room;
}
function cyclePieces(){
    queue.push(queue.shift());
    // player.currentPiece = (player.currentPiece + 1)%8;
    // player.nextPiece = (player.nextPiece + 1)%8;
    player.currentPiece = queue[0];
    switch(player.currentPiece){
        case 0:
            player.piece = "queen";
            player.blockedColor = "black";
            break;
        case 1:
            player.piece = "rook";
            player.blockedColor = "black";
            break;
        case 2:
            player.piece = "bishop";
            player.blockedColor = "black";
            break;
        case 3:
            player.piece = "knight";
            player.blockedColor = "black";
            break;
        case 4:
            player.piece = "queen";
            // player.blockedColor = "white";
            break;
        case 5:
            player.piece = "rook";
            // player.blockedColor = "white";
            break;
        case 6:
            player.piece = "bishop";
            // player.blockedColor = "white";
            break;
        case 7:
            player.piece = "knight";
            // player.blockedColor = "white";
            break;
        case 8:
            player.piece = "pawn";
    }
}

function generateMoveableSquares(piece, color){
    moveableSquares.splice(0,moveableSquares.length);
    if(piece == "rook" || piece == "queen"){
        var i = 1;
        while(true){
            if(board[(player.x+boardLength*player.y)+i] && board[(player.x+boardLength*player.y)+i].color === "enemy"){
                moveableSquares.push(board[player.x+boardLength*player.y+i]);
                break;
            }
            if(board[(player.x+boardLength*player.y)+i] && board[(player.x+boardLength*player.y)+i].color !== color){
                moveableSquares.push(board[player.x+boardLength*player.y+i]);
            } else {
                break;
            }
            i++;
        }
        i = -1;
        while(true){
            if (board[(player.x+boardLength*player.y)+i] && board[ (player.x+boardLength*player.y)+i].color === "enemy"){
                moveableSquares.push(board[player.x+boardLength*player.y+i]);
                break;
            }
            if(board[(player.x+boardLength*player.y)+i] && board[ (player.x+boardLength*player.y)+i].color !== color){
                moveableSquares.push(board[player.x+boardLength*player.y+i]);
            } else {
                break;
            }
            i--;
        }
        i = 1;
        while(true){
            if(board[player.x+boardLength*(player.y+i)] && board[player.x+boardLength*(player.y+i)].color === "enemy"){
                moveableSquares.push(board[player.x+boardLength*(player.y+i)]);
                break;
            }
            if(board[player.x+boardLength*(player.y+i)] && board[player.x+boardLength*(player.y+i)].color !== color){
                moveableSquares.push(board[player.x+boardLength*(player.y+i)]);
            } else {
                break;
            }
            i++;
        }
        i = -1;
        while(true){
            if(board[player.x+boardLength*(player.y+i)] && board[player.x+boardLength*(player.y+i)].color === "enemy"){
                moveableSquares.push(board[player.x+boardLength*(player.y+i)]);
                break;
            }
            if(board[player.x+boardLength*(player.y+i)] && board[player.x+boardLength*(player.y+i)].color !== color){
                moveableSquares.push(board[player.x+boardLength*(player.y+i)]);
            } else {
                break;
            }
            i--;
        }
    }
    if(piece == "bishop" || piece == "queen"){
        var i = 1;
        var j = 1;
        while(true){
            if(board[(player.x+boardLength*(player.y+j))+i] && board[(player.x+boardLength*(player.y+j))+i].color === "enemy"){
                moveableSquares.push(board[(player.x+boardLength*(player.y+j))+i]);
                break;
            }
            if(board[(player.x+boardLength*(player.y+j))+i] && board[(player.x+boardLength*(player.y+j))+i].color !== color){
                moveableSquares.push(board[(player.x+boardLength*(player.y+j))+i]);
            } else {
                break;
            }
            i++;
            j++;
        }
        i = -1;
        j = 1;
        while(true){
            if(board[(player.x+boardLength*(player.y+j))+i] && board[(player.x+boardLength*(player.y+j))+i].color === "enemy"){
                moveableSquares.push(board[(player.x+boardLength*(player.y+j))+i]);
                break;
            }
            if(board[(player.x+boardLength*(player.y+j))+i] && board[(player.x+boardLength*(player.y+j))+i].color !== color){
                moveableSquares.push(board[(player.x+boardLength*(player.y+j))+i]);
            } else {
                break;
            }
            i--;
            j++;
        }
        i = 1;
        j = -1;
        while(true){
            if(board[(player.x+boardLength*(player.y+j))+i] && board[(player.x+boardLength*(player.y+j))+i].color === "enemy"){
                moveableSquares.push(board[(player.x+boardLength*(player.y+j))+i]);
                break;
            }
            if(board[(player.x+boardLength*(player.y+j))+i] && board[(player.x+boardLength*(player.y+j))+i].color !== color){
                moveableSquares.push(board[(player.x+boardLength*(player.y+j))+i]);
            } else {
                break;
            }
            i++;
            j--;
        }
        i = -1;
        j = -1;
        while(true){
            if(board[(player.x+boardLength*(player.y+j))+i] && board[(player.x+boardLength*(player.y+j))+i].color === "enemy"){
                moveableSquares.push(board[(player.x+boardLength*(player.y+j))+i]);
                break;
            }
            if(board[(player.x+boardLength*(player.y+j))+i] && board[(player.x+boardLength*(player.y+j))+i].color !== color){
                moveableSquares.push(board[(player.x+boardLength*(player.y+j))+i]);
            } else {
                break;
            }
            i--;
            j--;
        }
    }
    if(piece == "knight"){
        var i = 2;
        var j = 1;
        if(board[(player.x+boardLength*(player.y +i)+j)] && board[(player.x+boardLength*(player.y +i)+j)].color !== color){
            moveableSquares.push(board[(player.x+boardLength*(player.y +i)+j)]);
        }
        i = 2;
        j = -1;
        if(board[(player.x+boardLength*(player.y +i)+j)] && board[(player.x+boardLength*(player.y +i)+j)].color !== color){
            moveableSquares.push(board[(player.x+boardLength*(player.y +i)+j)]);
        }
        i = -2;
        j = 1;
        if(board[(player.x+boardLength*(player.y +i)+j)] && board[(player.x+boardLength*(player.y +i)+j)].color !== color){
            moveableSquares.push(board[(player.x+boardLength*(player.y +i)+j)]);
        }
        i = -2;
        j = -1;
        if(board[(player.x+boardLength*(player.y +i)+j)] && board[(player.x+boardLength*(player.y +i)+j)].color !== color){
            moveableSquares.push(board[(player.x+boardLength*(player.y +i)+j)]);
        }
        i = 1;
        j = 2;
        if(board[(player.x+boardLength*(player.y +i)+j)] && board[(player.x+boardLength*(player.y +i)+j)].color !== color){
            moveableSquares.push(board[(player.x+boardLength*(player.y +i)+j)]);
        }
        i = 1;
        j = -2;
        if(board[(player.x+boardLength*(player.y +i)+j)] && board[(player.x+boardLength*(player.y +i)+j)].color !== color){
            moveableSquares.push(board[(player.x+boardLength*(player.y +i)+j)]);
        }
        i = -1;
        j = 2;
        if(board[(player.x+boardLength*(player.y +i)+j)] && board[(player.x+boardLength*(player.y +i)+j)].color !== color){
            moveableSquares.push(board[(player.x+boardLength*(player.y +i)+j)]);
        }
        i = -1;
        j = -2;
        if(board[(player.x+boardLength*(player.y +i)+j)] && board[(player.x+boardLength*(player.y +i)+j)].color !== color){
            moveableSquares.push(board[(player.x+boardLength*(player.y +i)+j)]);
        }
        
    }
    if(piece == "king"){
        var i = 1;
        var j = 1;
        if(board[(player.x+boardLength*(player.y +i)+j)] && board[(player.x+boardLength*(player.y +i)+j)].color !== color){
            moveableSquares.push(board[(player.x+boardLength*(player.y +i)+j)]);
        }
        i = 1;
        j = -1;
        if(board[(player.x+boardLength*(player.y +i)+j)] && board[(player.x+boardLength*(player.y +i)+j)].color !== color){
            moveableSquares.push(board[(player.x+boardLength*(player.y +i)+j)]);
        }
        i = -1;
        j = 1;
        if(board[(player.x+boardLength*(player.y +i)+j)] && board[(player.x+boardLength*(player.y +i)+j)].color !== color){
            moveableSquares.push(board[(player.x+boardLength*(player.y +i)+j)]);
        }
        i = -1;
        j = -1;
        if(board[(player.x+boardLength*(player.y +i)+j)] && board[(player.x+boardLength*(player.y +i)+j)].color !== color){
            moveableSquares.push(board[(player.x+boardLength*(player.y +i)+j)]);
        }
        var i = 1;
        var j = 0;
        if(board[(player.x+boardLength*(player.y +i)+j)] && board[(player.x+boardLength*(player.y +i)+j)].color !== color){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = -1;
        j = 0;
        if(board[(player.x+boardLength*(player.y +i)+j)] && board[(player.x+boardLength*(player.y +i)+j)].color !== color){
            moveableSquares.push(board[(player.x+boardLength*(player.y +i)+j)]);
        }
        i = 0;
        j = 1;
        if(board[(player.x+boardLength*(player.y +i)+j)] && board[(player.x+boardLength*(player.y +i)+j)].color !== color){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = 0;
        j = -1;
        if(board[(player.x+boardLength*(player.y +i)+j)] && board[(player.x+boardLength*(player.y +i)+j)].color !== color){
            moveableSquares.push(board[(player.x+boardLength*(player.y +i)+j)]);
        }

    }
    if(piece == "pawn"){
        var i = -1;
        if(board[(player.x+boardLength*(player.y +i))] && board[(player.x+boardLength*(player.y +i))].color !== color && board[(player.x+boardLength*(player.y +i))].color !== "enemy"){
            moveableSquares.push(board[(player.x+boardLength*(player.y +i))]);
        }
        if(board[(player.x+boardLength*(player.y +i))+1] && board[(player.x+boardLength*(player.y +i))+1].color === "enemy"){
            moveableSquares.push(board[(player.x+boardLength*(player.y +i))+1]);
        }
        if(board[(player.x+boardLength*(player.y +i))-1] && board[(player.x+boardLength*(player.y +i))-1].color === "enemy"){
            moveableSquares.push(board[(player.x+boardLength*(player.y +i))-1]);
        }
    }
}

function generateEnemySquares(player,piece,color){
    var enemySquares = [];
    if(piece == "rook" || piece == "queen"){
        var i = 1;
        while(true){
            if(board[(player.x+boardLength*player.y)+i] && board[(player.x+boardLength*player.y)+i].color === "player"){
                enemySquares.push(board[player.x+boardLength*player.y+i]);
                break;
            }
            if(board[(player.x+boardLength*player.y)+i] && board[(player.x+boardLength*player.y)+i].color !== color){
                enemySquares.push(board[player.x+boardLength*player.y+i]);
            } else {
                break;
            }
            i++;
        }
        i = -1;
        while(true){
            if(board[(player.x+boardLength*player.y)+i] && board[(player.x+boardLength*player.y)+i].color === "player"){
                enemySquares.push(board[player.x+boardLength*player.y+i]);
                break;
            }
            if(board[(player.x+boardLength*player.y)+i] && board[ (player.x+boardLength*player.y)+i].color !== color){
                enemySquares.push(board[player.x+boardLength*player.y+i]);
            } else {
                break;
            }
            i--;
        }
        i = 1;
        while(true){
            if(board[player.x+boardLength*(player.y+i)] && board[player.x+boardLength*(player.y+i)].color === "player"){
                enemySquares.push(board[player.x+boardLength*(player.y+i)]);
                break;
            }
            if(board[player.x+boardLength*(player.y+i)] && board[player.x+boardLength*(player.y+i)].color !== color){
                enemySquares.push(board[player.x+boardLength*(player.y+i)]);
            } else {
                break;
            }
            i++;
        }
        i = -1;
        while(true){
            if(board[player.x+boardLength*(player.y+i)] && board[player.x+boardLength*(player.y+i)].color === "player"){
                enemySquares.push(board[player.x+boardLength*(player.y+i)]);
                break;
            }
            if(board[player.x+boardLength*(player.y+i)] && board[player.x+boardLength*(player.y+i)].color !== color){
                enemySquares.push(board[player.x+boardLength*(player.y+i)]);
            } else {
                break;
            }
            i--;
        }
    }
    if(piece == "bishop" || piece == "queen"){
        var i = 1;
        var j = 1;
        while(true){
            if(board[(player.x+boardLength*(player.y+j))+i] && board[(player.x+boardLength*(player.y+j))+i].color === "player"){
                enemySquares.push(board[(player.x+boardLength*(player.y+j))+i]);
                break;
            }
            if(board[(player.x+boardLength*(player.y+j))+i] && board[(player.x+boardLength*(player.y+j))+i].color !== color){
                enemySquares.push(board[(player.x+boardLength*(player.y+j))+i]);
            } else {
                break;
            }
            i++;
            j++;
        }
        i = -1;
        j = 1;
        while(true){
            if(board[(player.x+boardLength*(player.y+j))+i] && board[(player.x+boardLength*(player.y+j))+i].color === "player"){
                enemySquares.push(board[(player.x+boardLength*(player.y+j))+i]);
                break;
            }
            if(board[(player.x+boardLength*(player.y+j))+i] && board[(player.x+boardLength*(player.y+j))+i].color !== color){
                enemySquares.push(board[(player.x+boardLength*(player.y+j))+i]);
            } else {
                break;
            }
            i--;
            j++;
        }
        i = 1;
        j = -1;
        while(true){
            if(board[(player.x+boardLength*(player.y+j))+i] && board[(player.x+boardLength*(player.y+j))+i].color === "player"){
                enemySquares.push(board[(player.x+boardLength*(player.y+j))+i]);
                break;
            }
            if(board[(player.x+boardLength*(player.y+j))+i] && board[(player.x+boardLength*(player.y+j))+i].color !== color){
                enemySquares.push(board[(player.x+boardLength*(player.y+j))+i]);
            } else {
                break;
            }
            i++;
            j--;
        }
        i = -1;
        j = -1;
        while(true){
            if(board[(player.x+boardLength*(player.y+j))+i] && board[(player.x+boardLength*(player.y+j))+i].color === "player"){
                enemySquares.push(board[(player.x+boardLength*(player.y+j))+i]);
                break;
            }
            if(board[(player.x+boardLength*(player.y+j))+i] && board[(player.x+boardLength*(player.y+j))+i].color !== color){
                enemySquares.push(board[(player.x+boardLength*(player.y+j))+i]);
            } else {
                break;
            }
            i--;
            j--;
        }
    }
    if(piece == "knight"){
        var i = 2;
        var j = 1;
        if(board[(player.x+boardLength*(player.y +i)+j)] && board[(player.x+boardLength*(player.y +i)+j)].color !== color){
            enemySquares.push(board[(player.x+boardLength*(player.y +i)+j)]);
        }
        i = 2;
        j = -1;
        if(board[(player.x+boardLength*(player.y +i)+j)] && board[(player.x+boardLength*(player.y +i)+j)].color !== color){
            enemySquares.push(board[(player.x+boardLength*(player.y +i)+j)]);
        }
        i = -2;
        j = 1;
        if(board[(player.x+boardLength*(player.y +i)+j)] && board[(player.x+boardLength*(player.y +i)+j)].color !== color){
            enemySquares.push(board[(player.x+boardLength*(player.y +i)+j)]);
        }
        i = -2;
        j = -1;
        if(board[(player.x+boardLength*(player.y +i)+j)] && board[(player.x+boardLength*(player.y +i)+j)].color !== color){
            enemySquares.push(board[(player.x+boardLength*(player.y +i)+j)]);
        }
        i = 1;
        j = 2;
        if(board[(player.x+boardLength*(player.y +i)+j)] && board[(player.x+boardLength*(player.y +i)+j)].color !== color){
            enemySquares.push(board[(player.x+boardLength*(player.y +i)+j)]);
        }
        i = 1;
        j = -2;
        if(board[(player.x+boardLength*(player.y +i)+j)] && board[(player.x+boardLength*(player.y +i)+j)].color !== color){
            enemySquares.push(board[(player.x+boardLength*(player.y +i)+j)]);
        }
        i = -1;
        j = 2;
        if(board[(player.x+boardLength*(player.y +i)+j)] && board[(player.x+boardLength*(player.y +i)+j)].color !== color){
            enemySquares.push(board[(player.x+boardLength*(player.y +i)+j)]);
        }
        i = -1;
        j = -2;
        if(board[(player.x+boardLength*(player.y +i)+j)] && board[(player.x+boardLength*(player.y +i)+j)].color !== color){
            enemySquares.push(board[(player.x+boardLength*(player.y +i)+j)]);
        }
        
    }
    if(piece == "king"){
        var i = 1;
        var j = 1;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== color){
            enemySquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = 1;
        j = -1;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== color){
            enemySquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = -1;
        j = 1;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== color){
            enemySquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = -1;
        j = -1;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== color){
            enemySquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        var i = 1;
        var j = 0;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== color){
            enemySquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = -1;
        j = 0;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== color){
            enemySquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = 0;
        j = 1;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== color){
            enemySquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = 0;
        j = -1;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== color){
            enemySquares.push(board[(player.x+10*(player.y +i)+j)]);
        }

    }
    return enemySquares;
}
function inMoveableSquares(x,y){
    for(var i = 0; i < moveableSquares.length; i++){
        if(moveableSquares[i].x == x && moveableSquares[i].y == y){
            return true;
        }
    }
    return false;
}
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
function moveEnemy(enemy){
    enemySquares = generateEnemySquares(enemy,enemy.piece,"black");
    var move = getRndInteger(0, enemySquares.length-1);
    enemyMove = enemySquares[move];
}
// moveEnemy(enemy);
canvas.addEventListener('click', function(event){
    if(player.alive){
        generateMoveableSquares(player.piece, player.blockedColor);
    
        var x = Math.floor(event.pageX/50);
        var y = Math.floor(event.pageY/50);
        // console.log(doorLayout[0][0]);
        // console.log(board);
        // console.log(board[x+10*y]);
        // console.log(x+10*y);
        // console.log(moveableSquares);
        // console.log(player);
        // console.log(board[39]);
        // console.log(currentRoom);
        // console.log(generateEnemySquares(enemy,enemy.piece,"black"));
        console.log(enemies);
        if(inMoveableSquares(x,y)){
            player.x = x;
            player.y = y;
            cyclePieces();
            var roomx = currentRoom[1];
            enemies[roomx][roomy];
            var roomy = currentRoom[0];
            if(player.x === flag.x && player.y === flag.y && roomx === flagRoom[1] && roomy === flagRoom[0]){
                win = true;
            }
            

            // var roomx = currentRoom[1];
            // var roomy = currentRoom[0];
            if(findDoors(x,y,doorLayout[roomx][roomy])){
                var door = whichDoor(x,y,doorLayout[roomx][roomy])
                moveRooms(door);
            }
            generateMoveableSquares(player.piece, player.blockedColor);
            if(moveableSquares.length === 0){
                lose = true;
            }
            if(player.x == enemies[roomx][roomy].x && player.y == enemies[roomx][roomy].y){
                enemies[roomx][roomy].alive = false;
            }
            if(enemies[roomx][roomy].alive){
                enemies[roomx][roomy].x = enemyMove.x;
                enemies[roomx][roomy].y = enemyMove.y;
                moveEnemy(enemies[roomx][roomy]);
                if(player.x == enemies[roomx][roomy].x && player.y == enemies[roomx][roomy].y){
                    player.alive = false;
                    lose = true;
                }
            }
            
        }
    }
});

function moveRooms(door){
    switch(door){
        case door1:
            currentRoom = [currentRoom[0]-1,currentRoom[1]];
            player.x = 7;
            break;
        case door2:
            currentRoom = [currentRoom[0],currentRoom[1]-1];
            player.y = 7;
            break;
        case door3:
            currentRoom = [currentRoom[0]+1,currentRoom[1]];
            player.x = 0;
            break;
        case door4:
            currentRoom = [currentRoom[0],currentRoom[1]+1];
            player.y = 0;
            break;
    }
}
function drawWin(){
    context.font = "72px Arial";
    context.fillStyle = "red";
    context.fillText("You Win", 400,400)
}
function drawLose(){
    context.font = "72px Arial";
    context.fillStyle = "red";
    context.fillText("Game Over", 400,400)
}
function generateRandomEnemy(room,roomx,roomy){
    var pieceNumber = getRndInteger(4,7);
        var piece;
        switch(pieceNumber){
            case 4:
                piece = "queen";
                break;
            case 5:
                piece = "rook";
                break;
            case 6:
                piece = "bishop";
                break;
            case 7:
                piece = "knight";
                break;
        } 
    while(true){
        var x = getRndInteger(2,5);
        var y = getRndInteger(2,5);
        if(!findSquares(x,y,room)){
            return new Enemy(x,y,roomx,roomy,piece,pieceNumber);
        }

    }
}
function generateEnemies(){
    // for()
    for(var i = 0; i < roomLayout.length; i++){
        var Yenemy = [];
        for(var j = 0; j < roomLayout[i].length;j++){
            if(roomLayout[i][j] == noRoom){
                Yenemy.push([]);
            } else {
                var enemy = generateRandomEnemy(roomLayout[i][j],j,i);
                Yenemy.push(enemy);
            }
        }
        enemies.push(Yenemy);
    }
}
function draw(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    var roomx = currentRoom[1];
    var roomy = currentRoom[0];
    var isFlag = false;
    if(!generated){
        drawBoard(roomLayout[roomx][roomy],doorLayout[roomx][roomy],isFlag, null);
        generateEnemies();
        moveEnemy(enemies[roomx][roomy]);
        
        generated = true;
    }
    drawBoard(roomLayout[roomx][roomy],doorLayout[roomx][roomy],isFlag, enemies[roomx][roomy]);
    drawQueue();
    
    if(roomx === flagRoom[1] && roomy === flagRoom[0]){
        isFlag = true;
        context.drawImage(flagImg, flag.x*50, flag.y*50, 50, 50);
    }
    if(player.alive){
        context.drawImage(imgs[player.currentPiece], player.x*50, player.y*50, 50, 50);
    }
    if(enemies[roomx][roomy].alive){
        context.drawImage(imgs[enemies[roomx][roomy].pieceNumber],enemies[roomx][roomy].x* 50, enemies[roomx][roomy].y*50,50,50);
    }
    if(win){
        drawWin();
    }
    if(lose){
        drawLose();
    }
}
function drawQueue(){
    context.font = "30px Arial";
    context.fillText("Next Piece", 450, 50);
    
    for(var i =1; i < queue.length; i++){
        context.drawImage(imgs[queue[i]], 450, 50 + 50*i, 50, 50);
    }

}
function findSquares(x,y,list){
    for(var i =0; i < list.length; i++){
        // var [a,b] = blackSquares[i];
        if(list[i][0] === x && list[i][1] === y){
            return true;
        }
    }
    return false;
}
function findDoors(x,y,doors){
    var isDoor;
    for(var i = 0; i < doors.length; i++){
        isDoor = findSquares(x,y,doors[i]);
        if(isDoor){
            return isDoor;
        }
    }
    return false;
}
function whichDoor(x,y,doors){
    var isDoor;
    var door = ["It messed up"];
    for(var i = 0; i < doors.length; i++){
        isDoor = findSquares(x,y,doors[i]);
        if(isDoor){
            return doors[i];
        }
    }
    return door;
}
function drawBoard(room,doors,flag,enemy){
    board.splice(0,board.length);
    for(var j = 0; j < 8; j++){
        for(var i = 0; i < 8; i++){
            var color = "gray";
            var r = 150;
            var g = 150;
            var b = 150;
            if((i+j)%2 == 0){
                color = "gray";
                r = 100;
                g = 100;
                b = 100;
            }
            
            if( i == 0 || j == 0 || i == 7 || j == 7){
                if(!findDoors(i,j,doors)){
                    color = "black";
                    r = 0;
                    g = 0;
                    b = 0;
                }   
            }
            if(findSquares(i,j,room)){
                color = "black";
                r = 0;
                g = 0;
                b = 0;
            }
            if(enemyMove && enemyMove.x === i && enemyMove.y === j && enemy.alive === true){
                color = "red";
                r = 255;
                g = 0;
                b = 0;
            }
            if(enemy && enemy.x === i && enemy.y === j && enemy.alive === true){
                color = "enemy";
            }
            if(player.x === i && player.y === j){
                color = "player";
            }
            // if(findSquares(i,j,whiteSquares)){
            //     color = "white";
            //     r = 255;
            //     g = 255;
            //     b = 255;
            // }
            drawSquare(i*50, j*50,r,g,b);
            board.push({x:i,y:j,r:r,g:g,b:b,color:color});
        }
    }
}
function drawSquare(x,y,r,g,b){
    context.beginPath();
    context.rect(x,y,50,50);
    context.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    context.fill();
    context.closePath();
}

setInterval(draw,12);