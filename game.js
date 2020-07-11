var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var STICKY_THRESHOLD = 0.004;
var ground = {x:0, y:425, width: canvas.width, height: 50, mode:-1, restitution:0.1};
var level = [ground,{x : 200, y:350, width: 90, height: 50, mode:-1, restitution:0.2},
    {x:350,y:350,width:50,height:100, mode:-1, restitution:0.2}, {x:550, y:350,width:100,height:100, mode:-1, restitution:0.2},
    {x:350,y:250,width:50,height:100,mode:0, restitution:0.2}];
// var y = 400;
// var x = 30;
var player = {x:1, y:1, piece:"queen"};
var assests = ["wpawn.png","wknight.png","wbishop.png","wrook.png","wqueen.png"];
var pieceArr = ["pawn","knight","bishop","rook","queen"];
var board = [];
var moveableSquares = [];
var img = new Image();
img.src = "assests/"+assests[4];
var dx = 0;
var dy = 0;

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
    if(piece == "rook" || piece == "queen"){
        var i = 1;
        while(true){
            if(board[(x+10*y)+i].color !== "Black"){
                moveableSquares.push(board[x+10*y+i]);
            } else {
                break;
            }
            i++;
        }
        i = -1;
        while(true){
            if(board[(x+10*y)+i].color !== "Black"){
                moveableSquares.push(board[x+10*y+i]);
            } else {
                break;
            }
            i--;
        }
        i = 1;
        while(true){
            if(board[x+10*(y+i)].color !== "Black"){
                moveableSquares.push(board[x+10*y+i]);
            } else {
                break;
            }
            i++;
        }
        i = -1;
        while(true){
            if(board[x+10*(y+i)].color !== "Black"){
                moveableSquares.push(board[x+10*y+i]);
            } else {
                break;
            }
            i--;
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
    var x = Math.floor(event.pageX/50);
    var y = Math.floor(event.pageY/50);
    console.log(board);
    console.log(board[x+10*y]);
    console.log(x+10*y)
    if(checkMove(player.piece, x,y)){
        player.x = x;
        player.y = y;
    }

});
function draw(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    context.drawImage(img, player.x*50, player.y*50, 50, 50);
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