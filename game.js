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
var assets = ["wpawn.png","wknight.png","wbishop.png","wrook.png","wqueen.png"];
var pieceArr = ["pawn","knight","bishop","rook","queen"];
var blackSquares = [[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3]]
var board = [];
var moveableSquares = [];
var queen = new Image();
queen.src = "assests/"+assets[4];
var rook = new Image();
rook.src = "assests/"+assets[3];
var bishop = new Image();
bishop.src  = "assests/"+assets[2];
var knight = new Image();
knight.src  = "assests/"+assets[1];
imgs = [queen, rook, bishop, knight];
var dx = 0;
var dy = 0;

function cyclePieces(){
    player.currentPiece = (player.currentPiece + 1)%4;
    player.nextPiece = (player.nextPiece + 1)%4;
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

function generateMoveableSquares(piece){
    moveableSquares.splice(0,moveableSquares.length);
    if(piece == "rook" || piece == "queen"){
        var i = 1;
        while(true){
            if(board[(player.x+10*player.y)+i] && board[(player.x+10*player.y)+i].color !== "black"){
                moveableSquares.push(board[player.x+10*player.y+i]);
            } else {
                break;
            }
            i++;
        }
        i = -1;
        while(true){
            if(board[(player.x+10*player.y)+i] && board[ (player.x+10*player.y)+i].color !== "black"){
                moveableSquares.push(board[player.x+10*player.y+i]);
            } else {
                break;
            }
            i--;
        }
        i = 1;
        while(true){
            if(board[player.x+10*(player.y+i)] && board[player.x+10*(player.y+i)].color !== "black"){
                moveableSquares.push(board[player.x+10*(player.y+i)]);
            } else {
                break;
            }
            i++;
        }
        i = -1;
        while(true){
            if(board[player.x+10*(player.y+i)] && board[player.x+10*(player.y+i)].color !== "black"){
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
            if(board[(player.x+10*(player.y+j))+i] && board[(player.x+10*(player.y+j))+i].color !== "black"){
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
            if(board[(player.x+10*(player.y+j))+i] && board[(player.x+10*(player.y+j))+i].color !== "black"){
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
            if(board[(player.x+10*(player.y+j))+i] && board[(player.x+10*(player.y+j))+i].color !== "black"){
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
            if(board[(player.x+10*(player.y+j))+i] && board[(player.x+10*(player.y+j))+i].color !== "black"){
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
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== "black"){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = 2;
        j = -1;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== "black"){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = -2;
        j = 1;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== "black"){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = -2;
        j = -1;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== "black"){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = 1;
        j = 2;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== "black"){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = 1;
        j = -2;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== "black"){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = -1;
        j = 2;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== "black"){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = -1;
        j = -2;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== "black"){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        
    }
    if(piece == "king"){
        var i = 1;
        var j = 1;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== "black"){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = 1;
        j = -1;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== "black"){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = -1;
        j = 1;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== "black"){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = -1;
        j = -1;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== "black"){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        var i = 1;
        var j = 0;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== "black"){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = -1;
        j = 0;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== "black"){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = 0;
        j = 1;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== "black"){
            moveableSquares.push(board[(player.x+10*(player.y +i)+j)]);
        }
        i = 0;
        j = -1;
        if(board[(player.x+10*(player.y +i)+j)] && board[(player.x+10*(player.y +i)+j)].color !== "black"){
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
    generateMoveableSquares(player.piece);
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
function findSquares(x,y){
    for(var i =0; i < blackSquares.length; i++){
        // var [a,b] = blackSquares[i];
        if(blackSquares[i][0] === x && blackSquares[i][1] === y){
            return true;
        }
    }
    return false;
}
function drawBoard(){
    for(var j = 0; j < 12; j++){
        for(var i = 0; i < 10; i++){
            var color = "white";
            var r = 255;
            var g = 255;
            var b = 255;
            if((i+j)%2 == 0){
                color = "gray";
                r = 150;
                g = 150;
                b = 150;
            }
            
            if( i == 0 || j == 0 || i == 9 || j == 11){
                color = "black";
                r = 0;
                g = 0;
                b = 0;
            }
            if(findSquares(i,j)){
                color = "black";
                r = 0;
                g = 0;
                b = 0;
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