var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var STICKY_THRESHOLD = 0.004;
var ground = {x:0, y:425, width: canvas.width, height: 50, mode:-1, restitution:0.1};
var level = [ground,{x : 200, y:350, width: 90, height: 50, mode:-1, restitution:0.2},
    {x:350,y:350,width:50,height:100, mode:-1, restitution:0.2}, {x:550, y:350,width:100,height:100, mode:-1, restitution:0.2},
    {x:350,y:250,width:50,height:100,mode:0, restitution:0.2}];
// var y = 400;
// var x = 30;
var player = {x:1, y:1, piece:"queen", currentPiece: 0, nextPiece: 1};
var wassets = ["wpawn.png","wknight.png","wbishop.png","wrook.png","wqueen.png"];
var bassets = ["bpawn.png","bknight.png","bbishop.png","brook.png","bqueen.png"];
var pieceArr = ["pawn","knight","bishop","rook","queen"];
var blackSquares = [[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[6,5],[6,6],[7,6],[8,6]];
var whiteSquares = [[2,7],[3,7],[4,7],[5,7],[6,7],[2,8],[3,8],[4,8],[5,8],[6,8],[5,9],[3,9],[4,10]];
var board = [];
var moveableSquares = [];
var wqueen = new Image();
wqueen.src = "assests/"+wassets[4];
var wrook = new Image();
wrook.src = "assests/"+wassets[3];
var wbishop = new Image();
wbishop.src  = "assests/"+wassets[2];
var wknight = new Image();
wknight.src  = "assests/"+wassets[1];
var bqueen = new Image();
bqueen.src = "assests/"+bassets[4];
var brook = new Image();
brook.src = "assests/"+bassets[3];
var bbishop = new Image();
bbishop.src  = "assests/"+bassets[2];
var bknight = new Image();
bknight.src  = "assests/"+bassets[1];
imgs = [wqueen, wrook, wbishop, wknight, bqueen, brook, bbishop, bknight];
var wking = new Image();
wking.src = "assests/wking.png";
var bking = new Image();
bking.src = "assests/bking.png";

var dx = 0;
var dy = 0;

function cyclePieces(){
    player.currentPiece = (player.currentPiece + 1)%8;
    player.nextPiece = (player.nextPiece + 1)%8;
    switch(player.currentPiece){
        case 0:
            player.piece = "queen";
            break;
        case 1:
            player.piece = "rook";
            break;
        case 2:
            player.piece = "bishop";
            break;
        case 3:
            player.piece = "knight";
            break;
        case 4:
            player.piece = "queen";
            break;
        case 5:
            player.piece = "rook";
            break;
        case 6:
            player.piece = "bishop";
            break;
        case 7:
            player.piece = "knight";
            break;
    }
}

function checkMove(piece, x , y){
    if(piece == "rook" || piece == "queen"){
        if((player.x === x || player.y === y) &&( board[x+10*y].color !== "black")){
            console.log(board[x+10*y]);
            // 
            return true;
        }
    }
    if(piece == "bishop" || piece == "queen"){
        if(Math.abs(player.x - x) == Math.abs(player.y - y) && ( board[x+10*y].color !== "black")){
            return true;
        }
    }
    return false;
}

function generateMoveableSquares(piece, color){
    moveableSquares.splice(0,moveableSquares.length);
    if(piece == "rook" || piece == "queen"){
        var i = 1;
        while(true){
            if(board[(player.x+10*player.y)+i] && board[(player.x+10*player.y)+i].color !== color){
                moveableSquares.push(board[player.x+10*player.y+i]);
            } else {
                break;
            }
            i++;
        }
        i = -1;
        while(true){
            if(board[(player.x+10*player.y)+i] && board[ (player.x+10*player.y)+i].color !== color){
                moveableSquares.push(board[player.x+10*player.y+i]);
            } else {
                break;
            }
            i--;
        }
        i = 1;
        while(true){
            if(board[player.x+10*(player.y+i)] && board[player.x+10*(player.y+i)].color !== color){
                moveableSquares.push(board[player.x+10*(player.y+i)]);
            } else {
                break;
            }
            i++;
        }
        i = -1;
        while(true){
            if(board[player.x+10*(player.y+i)] && board[player.x+10*(player.y+i)].color !== color){
                moveableSquares.push(board[player.x+10*(player.y+i)]);
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
            if(board[(player.x+10*(player.y+j))+i] && board[(player.x+10*(player.y+j))+i].color !== color){
                moveableSquares.push(board[(player.x+10*(player.y+j))+i]);
            } else {
                break;
            }
            i++;
            j++;
        }
        i = -1;
        j = 1;
        while(true){
            if(board[(player.x+10*(player.y+j))+i] && board[(player.x+10*(player.y+j))+i].color !== color){
                moveableSquares.push(board[(player.x+10*(player.y+j))+i]);
            } else {
                break;
            }
            i--;
            j++;
        }
        i = 1;
        j = -1;
        while(true){
            if(board[(player.x+10*(player.y+j))+i] && board[(player.x+10*(player.y+j))+i].color !== color){
                moveableSquares.push(board[(player.x+10*(player.y+j))+i]);
            } else {
                break;
            }
            i++;
            j--;
        }
        i = -1;
        j = -1;
        while(true){
            if(board[(player.x+10*(player.y+j))+i] && board[(player.x+10*(player.y+j))+i].color !== color){
                moveableSquares.push(board[(player.x+10*(player.y+j))+i]);
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
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== color){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = 2;
        j = -1;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== color){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = -2;
        j = 1;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== color){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = -2;
        j = -1;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== color){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = 1;
        j = 2;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== color){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = 1;
        j = -2;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== color){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = -1;
        j = 2;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== color){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = -1;
        j = -2;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== color){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        
    }
    if(piece == "king"){
        var i = 1;
        var j = 1;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== color){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = 1;
        j = -1;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== color){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = -1;
        j = 1;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== color){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = -1;
        j = -1;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== color){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        var i = 1;
        var j = 0;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== color){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = -1;
        j = 0;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== color){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = 0;
        j = 1;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== color){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = 0;
        j = -1;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== color){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }

    }
}

function inMoveableSquares(x,y){
    for(var i = 0; i < moveableSquares.length; i++){
        if(moveableSquares[i].x == x && moveableSquares[i].y == y){
            return true;
        }
    }
    return false;
}

canvas.addEventListener('click', function(event){
    generateMoveableSquares(player.piece, "black");
    var x = Math.floor(event.pageX/50);
    var y = Math.floor(event.pageY/50);
    // console.log(board);
    // console.log(board[x+10*y]);
    // console.log(x+10*y)
    // console.log(moveableSquares);
    if(inMoveableSquares(x,y)){
        player.x = x;
        player.y = y;
        cyclePieces();
    }

});
function draw(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawQueue();
    context.drawImage(imgs[player.currentPiece], player.x*50, player.y*50, 50, 50);
}
function drawQueue(){
    context.font = "30px Arial";
    context.fillText("Next Piece", 600, 50);
    
    context.drawImage(imgs[player.nextPiece], 600, 100, 50, 50)
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
function drawBoard(){
    for(var j = 0; j < 12; j++){
        for(var i = 0; i < 10; i++){
            var color = "white";
            var r = 200;
            var g = 200;
            var b = 200;
            if((i+j)%2 == 0){
                color = "gray";
                r = 100;
                g = 100;
                b = 100;
            }
            
            if( i == 0 || j == 0 || i == 9 || j == 11){
                color = "black";
                r = 0;
                g = 0;
                b = 0;
            }
            if(findSquares(i,j,blackSquares)){
                color = "black";
                r = 0;
                g = 0;
                b = 0;
            }
            if(findSquares(i,j,whiteSquares)){
                color = "white";
                r = 255;
                g = 255;
                b = 255;
            }
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