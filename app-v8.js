"use strict";

const COLUMN = 0, ROW = 1, WHITE = 0, RED = 1, ON = 1, OFF = 0;
var gameboard = document.querySelector("#gameboard"), // the div
   iSquare = document.querySelector("#iPieceSquare"),
   showPlayer = document.querySelector("#player"), // whose turn it is
   extraInfo = document.querySelector("#info-display"), // the extra info to show below the player's name
   modal = document.getElementById("modal"),
   modalInner = document.getElementById("modal-inner"),
   width = 8,
   checkmated = false,
   players = {
      colors: ["white", "red"],
      colorNum: { white: 0, red: 1 },
      pieces: [
         [king, queen, bishop, bishop, knight, knight, rook, rook,
            pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn ],
         [king, queen, bishop, bishop, knight, knight, rook, rook,
            pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn ]
      ],
      score: [ , ],
      kings: [ , ],
      kcastle: [ true, true],
      rcastle: { a1: true, h1: true, a8: true, h8: true},
      attacks: [{}, {}], // white and red
   },
   currentPlayer = WHITE, // 0 is white, 1 is black (red)
   myColor, opColor,
   board = [ // n for name, c for color, p for piece
      { n: "a8", c: 1, p: rook.r }, {n: "b8", c: 0, p: knight.r}, {n: "c8", c: 1, p: bishop.r}, {n: "d8", c: 0, p: queen.r}, {n: "e8", c: 1, p: king.r}, {n: "f8", c: 0, p: bishop.r}, {n: "g8", c: 1, p: knight.r}, {n: "h8", c: 0, p: rook.r},
      { n: "a7", c: 0, p: pawn.r }, {n: "b7", c: 1, p: pawn.r}, {n: "c7", c: 0, p: pawn.r}, {n: "d7", c: 1, p: pawn.r}, {n: "e7", c: 0, p: pawn.r}, {n: "f7", c: 1, p: pawn.r}, {n: "g7", c: 0, p: pawn.r}, {n: "h7", c: 1, p: pawn.r},
      { n: "a6", c: 1, p: "" }, {n: "b6", c: 0, p: ""}, {n: "c6", c: 1, p: ""}, {n: "d6", c: 0, p: ""}, {n: "e6", c: 1, p: ""}, {n: "f6", c: 0, p: ""}, {n: "g6", c: 1, p: ""}, {n: "h6", c: 0, p: ""},
      { n: "a5", c: 0, p: "" }, {n: "b5", c: 1, p: ""}, {n: "c5", c: 0, p: ""}, {n: "d5", c: 1, p: ""}, {n: "e5", c: 0, p: ""}, {n: "f5", c: 1, p: ""}, {n: "g5", c: 0, p: ""}, {n: "h5", c: 1, p: ""},
      { n: "a4", c: 1, p: "" }, {n: "b4", c: 0, p: ""}, {n: "c4", c: 1, p: ""}, {n: "d4", c: 0, p: ""}, {n: "e4", c: 1, p: ""}, {n: "f4", c: 0, p: ""}, {n: "g4", c: 1, p: ""}, {n: "h4", c: 0, p: ""},
      { n: "a3", c: 0, p: "" }, {n: "b3", c: 1, p: ""}, {n: "c3", c: 0, p: ""}, {n: "d3", c: 1, p: ""}, {n: "e3", c: 0, p: ""}, {n: "f3", c: 1, p: ""}, {n: "g3", c: 0, p: ""}, {n: "h3", c: 1, p: ""},
      { n: "a2", c: 1, p: pawn.w }, {n: "b2", c: 0, p: pawn.w}, {n: "c2", c: 1, p: pawn.w}, {n: "d2", c: 0, p: pawn.w}, {n: "e2", c: 1, p: pawn.w}, {n: "f2", c: 0, p: pawn.w}, {n: "g2", c: 1, p: pawn.w}, {n: "h2", c: 0, p: pawn.w},
      { n: "a1", c: 0, p: rook.w }, {n: "b1", c: 1, p: knight.w}, {n: "c1", c: 0, p: bishop.w}, {n: "d1", c: 1, p: queen.w}, {n: "e1", c: 0, p: king.w}, {n: "f1", c: 1, p: bishop.w}, {n: "g1", c: 0, p: knight.w}, {n: "h1", c: 1, p: rook.w}
   ],
   tango = {}, // originally selected piece
   surroundingGps,
   columns = {
      n: { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8 }, // n for number
      l: { 1: "a", 2: "b", 3: "c", 4: "d", 5: "e", 6: "f", 7: "g", 8: "h" } // l for letter
   },
   lastMove = { origin: "", piece: "", end: "", color: "", img: "", board: "", // board allows saving
      turn: WHITE, game: [] }, // game has the list of moves
   mySquareId, opSquareId, newSquareId,
   yUp, xRight,
   theConsole = ON,
   flipWill = false; // do you want to flip the board?
   showPlayer.textContent = players.colors[currentPlayer];

// pre setup
attackMapReset();

// initial setup
for (var i = 0, j = 0; i < 81; i++) { // for each coordinate ;; j is a second counter
   // create a square as div
   var square = document.createElement("div"); // Creates an instance of the element for the specified tag.
   
   // the class is going to be 'square'
   square.classList.add("square"); // Allows for manipulation of element's class content attribute as a set of whitespace-separated tokens through a DOMTokenList object.

   // These are the boarders
   if (i === 0 || i === 9 || i === 18 || i === 27 || i === 36 || i === 45 || i === 54 ||  i === 63 || i >= 72) {
      // a way of detecting the boarders
      var a = 0, b = 9, c = 18, d = 27, e = 36, f = 45, g = 54, h = 63, vowels = ["a", "b", "c", "d", "e", "f", "g", "h"];
      var cont; // contains
      var sursum = 1; // top is a bad name ;; border-left

      if (i === a) {
         cont = "8";
      } else if (i === b) {
         cont = "7";
      } else if (i === c) {
         cont = "6";
      } else if (i === d) {
         cont = "5";
      } else if (i === e) {
         cont = "4";
      } else if (i === f) {
         cont = "3";
      } else if (i === g) {
         cont = "2";
      } else if (i === h) {
         cont = "1";
      } else if (i === 72) {
         cont = "";
         sursum = 3; // border
      } else { 
         // for instance 73 - 73 is 0
         cont = vowels[i - 73]; 
         sursum = 2; // border-down
      }

      // the content of that square is going to be the name
      square.innerHTML = cont;

      // let's number each one, then name them
      if (cont === "") {
         cont = "out";
      }
      square.setAttribute("gps", cont); // load the name
      
      // the color stays the same
      square.classList.add("pink");

      // lets id these boarder squares
      if (sursum === 1) {
         square.classList.add("boarder-left");
      } else if (sursum === 2) {
         square.classList.add("boarder-down");
      } else {
         square.classList.add("boarder");
      }
   }

   else { // game squares
      // we dont want to do this on the other squares
      square.setAttribute("square-id", j); // Sets the value of element's first attribute whose qualified name is qualifiedName to value.

      // the content of that square is going to be the start image
      square.innerHTML = board[j]["p"]; // load the initial position
      
      if (square.firstChild) { // if there
         square.firstChild.setAttribute("draggable", true); // only pieces start with a child on the square (div)
      }

      // let's number each one, then name them
      square.setAttribute("gps", board[j]["n"]); // load the name
      
      // this is a square part of the game, not a boarder
      square.classList.add("intra");

      // the color depends on the coordinate
      if (board[j]["c"] === 1) {
         square.classList.add("red");
      }         
      else {
         square.classList.add("white");
      }
      j++;
   }
   
   // add it to the gameboard
   gameboard.append(square);
}

// selecting all the squares of the gameboard (intra)
var omnia = document.querySelectorAll("#gameboard .intra");
/* ============================================================
* END OF BOARD SET UP 
*/


function playerSwitch() { // at the end of the turn, after dropping the piece, switch turns
   flipIds();
   if (currentPlayer === WHITE) {
      currentPlayer++;
      myColor = tango.color = "red";
      opColor = "white";
   } else {
      currentPlayer = WHITE;
      myColor = tango.color = "white";
      opColor = "red";
   }
   showPlayer.textContent = players.colors[currentPlayer];
}

function sumo(ev) { // grab function
   // target is <img>, parentNode <div class="piece">...
   tango.origin = ev.target.parentNode.getAttribute("gps"); // o for zero
   tango.piece = ev.target; // p for piece
   tango.img = ev.target.firstChild; // img for piece image
   myColor = tango.color = tango.img.id; // instead of alt, id is either red or white
   if (tango.color === "white") {
      opColor = "red";
   } else {
      opColor = "white";
   }
}

function superteneo(ev) { // hold over function
   if (tango.color !== players.colors[currentPlayer]) { // only if color's turn
      return;
   }
   ev.preventDefault(); // avoid all the squares we might drop the piece to are logged
}

function occide() { // eat piece checker
   /**
    * we can define this vars since we already checked if there's a piece there
    * and that the last move color is not current player color
    */
   var 
      myPiece = tango.piece.id,
      opponentsPieceColor = tango.endpiece.firstChild.id,
      opponentsPiece = tango.endpiece.id;

   checkDirection(players.colors[currentPlayer]);
   
   // not the best way to compare strings
   // only if opponents piece && piece is not a "king"
   if (tango.color != opponentsPieceColor && opponentsPiece !== king.s) { 
      tango.end = tango.endintra1.getAttribute("gps");
      
      // mySquareId and opSquareId contain the board's ids as a number
      mySquareId = Number(ubi(tango.origin).getAttribute("square-id"));
      opSquareId = Number(ubi(tango.end).getAttribute("square-id"));

      // normal pawn capture, en passant has its own function ;; 1 --> special --> capture
      let x = window[myPiece].move(tango.end, tango.origin, 1, opSquareId, tango.piece, tango.color, mySquareId);
      if (x > 0) {
         if (theConsole === ON) { // when using attackMap we want to show no console
            console.log("Intended " + myPiece + " capture ilegal.");               
         }
         return(1);
      }      
      // We already checked that is a legal move
      successfulMove(myPiece, opSquareId, true, opponentsPiece);
   } 
}

function successfulMove(myPiece, quidSquareId, capture, opponentsPiece, finis, initium, special) {
   capture = capture || false;
   finis = finis || tango.end;
   initium = initium || tango.origin;
   opponentsPiece = opponentsPiece || "";
   var action = " to ", x = "", firstL = myPiece[0];
   if (myPiece === "knight") {
      firstL = "n" + tango.origin;
   }  else if (myPiece === "pawn") {
      firstL = "";
   } else if (myPiece === "rook") { // we could improve this to show full only if both rooks are on the same column
      firstL = firstL + tango.origin;
   }

   // if friendly piece 
   // THIS CODE SHOULD NOT BE INSIDE ANY PIECES MOVE FUNCTION BC IT BREAKS ATTACKMAP()
   if (ubi(finis).firstChild) { // avoid looking at undefined
      if (ubi(finis).firstChild.firstChild.id === myColor) { // avoid taking a friendly piece
         if (theConsole === ON) {
            console.log("That's a friendly piece!");
         }
         return(4);
      }
   }

   // we cannot ignore a check! ((captures and promotions get in the way of the check))
   if (isAttacked(window[myPiece], finis, initium, myColor) !== 0) {
      if (theConsole === ON) {
         console.log("You need to deal with the check!");
      }
      return(1);
   }

   // ONLY HERE take away here king castle rights or rook castle rights
   if (myPiece === "king" && players.kcastle[players.colorNum[myColor]]) {
      players.kcastle[players.colorNum[myColor]] = false; // we can no longer castle
      if (finis === "g1") {
         players.rcastle.h1 = false; // we can no longer castle
      } else if (finis === "c1") {
         players.rcastle.a1 = false; // we can no longer castle
      } else if (finis === "g8") {
         players.rcastle.h8 = false; // we can no longer castle
      } else if (finis === "c8") {
         players.rcastle.a8 = false; // we can no longer castle
      } 
   } else if (myPiece === "rook") {
      let z = ["a1", "h1", "a8", "h8"];
      if (initium === z[0] || initium === z[1] || initium === z[2] || initium === z[3]) {
         players.rcastle[initium] = false; // we can no longer castle
      } 
   }  

   let promotion = false;

   // castle
   if (special === 1) {  // here we only append the rook; the king is appended down
      if (finis === "g1") {
         ubi("f1").append(ubi("h1").firstChild); // append to f1 the h1 rook
      } else if (finis === "c1") {
         ubi("d1").append(ubi("a1").firstChild);
      } else if (finis === "g8") {
         ubi("f8").append(ubi("h8").firstChild);
      } else if (finis === "c8") {
         ubi("d8").append(ubi("a8").firstChild);
      } 
   } else if (myPiece === "pawn" && ((finis[ROW] === "8" && currentPlayer === WHITE) 
      || (finis[ROW] === "1" && currentPlayer === RED))) { // promoting ;; special === 2
         // promoting(...) was here
         promotion = true;
   }
   // whilst a castle cannot be a capture promoting can be
   if (capture) {
      // the actual capture
      tango.endintra1.append(tango.piece);
      tango.endpiece.remove();

      // some definitions
      action = " takes " + opponentsPiece + " ";
      x = "x";
      if (myPiece === "pawn") {
         firstL = tango.origin[COLUMN];
      }
   } else {
      // the actual move
      tango.endintra0.append(tango.piece); // the en passant move is inside pawn move function
   }
   
   // logging move ;; for instance 'pawn e4 takes pawn d5'
   let y = myPiece + " " + tango.origin + action + tango.end;
   if (y === "king e1 to c1" || y === "king e8 to c8") {
      y = "O-O-O";
   } else if (y === "king e1 to g1" || y === "king e8 to g8") {
      y = "O-O";
   }
   let yy = firstL + x + tango.end;

   // IF PROMOTION..
   if (!promotion) { // else we do it in a separate function
      updateBoard(myPiece, quidSquareId, false, "", y, yy);
   } else { // since we pass y and yy we need to pass those vars here
      promoting(myColor, finis, myPiece, quidSquareId, y, yy);
   }
}

function promoting(thisColor, thisGps, myPiece, quidSquareId, y, yy) { // params are for safety reasons ;; not needed
   thisColor = thisColor || tango.color; // myColor
   thisGps = thisGps || tango.end; // finis
   modal.style.zIndex = 33;
   modal.style.opacity = 1;

   function generic() {
      modal.style.zIndex = -1;
      modal.style.opacity = 0;
   }

   function appendin(newPiece) {
      tango.piece.remove();
      iSquare.firstChild.setAttribute("draggable", true); 
      ubi(thisGps).append(iSquare.firstChild); // append to "h8" a "queen" (the red queen div)
      iSquare.innerHTML = ""; // clean the mess after using it
      updateBoard(myPiece, quidSquareId, true, newPiece, y, yy);
   }

   let knightVolo = document.getElementById("knight-volo"),
   bishopVolo = document.getElementById("bishop-volo"),
   rookVolo = document.getElementById("rook-volo"),
   queenVolo = document.getElementById("queen-volo");

   knightVolo.addEventListener("click",
      function() {
         generic();
         iSquare.innerHTML = knight[thisColor[0]];
         appendin("knight");
      }
   );

   bishopVolo.addEventListener("click",
      function() {
         generic();
         iSquare.innerHTML = bishop[thisColor[0]];
         appendin("bishop");   
      }
   );

   rookVolo.addEventListener("click",
      function() {
         generic();
         iSquare.innerHTML = rook[thisColor[0]];
         appendin("rook");
      }
   );

   queenVolo.addEventListener("click",
      function() {
         generic();
         iSquare.innerHTML = queen[thisColor[0]];
         appendin("queen");
      }
   );
}

function updateBoard(myPiece, quidSquareId, promotion, newPiece, y, yy) {
   promotion = promotion || false;
   
   // updating board
   board[mySquareId].p = "";
   board[quidSquareId].p = window[myPiece][myColor[0]];

   // updating data to lastmove
   lastMove.piece = myPiece;
   lastMove.color = players.colors[currentPlayer];
   lastMove.end = tango.end;
   lastMove.origin = tango.origin;
   lastMove.img = tango.img;
   lastMove.board = board; // this is a copy by value not by reference
   
   playerSwitch(); // change player turn
   checkmate(); // now looking as the enemy lets see if we are checkmated

   // logging move ;; for instance 'pawn e4 takes pawn d5'
   if (promotion) { // if we are promoting
      y = y + " -> " + newPiece; // 'pawn e7 takes rook f8 -> queen'
      yy = yy + "=" + newPiece[0]; // 'e7xf8=q'
   }

   if (checkmated) {
      y = y + "#";
      yy = yy + "#";
   } else { 
      var opKingGps = players.kings[players.colorNum[myColor]], // we have already switched colors
      opColorNum = players.colorNum[opColor]; // opColor is also switched
      if (players.attacks[opColorNum][opKingGps]) {
         y = y + "+";
         yy = yy + "+";
      }
   }
   console.log(y); // the only datum i need
   
   if (lastMove.color[0] === "w") { // if white lets add a new block []
      lastMove.game.push([]);
   }
   lastMove.game[lastMove.turn].push(yy);
   if (lastMove.color[0] === "r") { // if red let's give notice that the block ends
      lastMove.turn++;    
   }
}

// fixed attackMap capture
function pawnMove(capture, finis, initium, myColor, imagine, iGpsPlenum, iGpsVacuum) {
   // we already know that my selected piece is a pawn, and that the end square is empty
   capture = capture || false;
   finis = finis || tango.end;
   initium = initium || tango.origin;
   myColor = myColor || players.colors[currentPlayer];
   imagine = imagine || false;
   iGpsPlenum = iGpsPlenum || null;
   iGpsVacuum= iGpsVacuum || null;
   var 
      enPassant = false,
      advanceOne = true, // else means advance two
      whatMove,
      myPawnOrigin,
      opPawnOrigin,
      opMiddle,
      exitCode = 0,
      resNecanda = false; // to see that we are actually capturing something
   
   if (initium === finis) { // this is thought for the attackMap function
      exitCode = 5; // 5 to maintain unity
      return(exitCode);
   }

   // color checker
   if (myColor === "white") {
      yUp = 1;
      myPawnOrigin = 2; // 2nd row
      opPawnOrigin = 7;
      opMiddle = 5;
   } else {
      yUp = -1;
      myPawnOrigin = 7; // 7th row
      opPawnOrigin = 2;
      opMiddle = 4;
   }
   // we dont need to make sure it isnt friendly since that lock will make attack map to 
   // stop working properly and also in occide we already have that lock
   if (capture && ((!imagine && ubi(finis).firstChild) || 
   (imagine && finis !== iGpsPlenum && finis !== iGpsVacuum && ubi(finis).firstChild))) {
      resNecanda = ubi(finis).firstChild;
   } else if (capture && imagine && finis === iGpsPlenum) {
      resNecanda = true;
   }

   // advance checker
   if (Number(finis[ROW]) === Number(initium[ROW]) + yUp) { // I want to advance 1
      advanceOne = true;
      // if (c/3 === b/2-1) or (c/1 === b/2+1)
      if (capture && resNecanda && (columns.n[finis[COLUMN]] === columns.n[initium[COLUMN]] - 1 
         || columns.n[finis[COLUMN]] === columns.n[initium[COLUMN]] + 1)) {
         return(exitCode); // successful capture
      }
   } else if (Number(finis[ROW]) === Number(initium[ROW]) + (yUp * 2) 
      && Number(initium[ROW]) === myPawnOrigin) { // and I start from the beginning 
      // midRow = Number(tango.origin[ROW]) + yUp;
      advanceOne = false; // I want to advance 2
   } else { // out of range on y axis
      exitCode = 2;
      if (theConsole === ON) { // when using attackMap we want to show no console
         console.log("Exit code: " + exitCode + ".\nOut of range on y axis.\n" + pawn.s + " can only move upwards & up to two squares.");
      }
      return(exitCode); // we can't move such a move
   }

   // capture safety
   if (capture) {
      exitCode = 7;
      if (theConsole === ON) { // when using attackMap we want to show no console
         console.log("Exit code: " + exitCode + ".\nUnsuccesful capture.");
      }
      return(exitCode);
   }

   // imagine safety
   if (imagine) { // if there was no capture we should exit
      // if imagine is true, we shouldn't map advance moves
      exitCode = 8;
      if (theConsole === ON) { // when using attackMap we want to show no console
         console.log("Exit code: " + exitCode + ".\nImagine mode on. Pawn move. We are only looking for captures");
      }
      return (exitCode);
   } 

   // eat or advance?
   if (lastMove.end[COLUMN] === finis[COLUMN] // avoid en passant behaviour from other columns
      && (columns.n[finis[COLUMN]] === columns.n[initium[COLUMN]] - 1 
      || columns.n[finis[COLUMN]] === columns.n[initium[COLUMN]] + 1 )) {
         whatMove = "eat";
         enPassant = true; // do I intend to move "en passant"?
   } else if (columns.n[finis[COLUMN]] === columns.n[initium[COLUMN]]) {
      whatMove = "advance";
   } else { // out of range on x axis
      exitCode = 3;
      if (theConsole === ON) { // when using attackMap we want to show no console
         console.log("Exit code: " + exitCode + ".\nOut of range on x axis.\n" + pawn.s + " can only move by advancing 1 or 2 squares, or by eating the opponents pawns diagonally 1 square");
      }
      return(exitCode); // we can't move such a move
   }

   if (!enPassant) {
      surroundChecker(initium, false, myColor);
      if (!advanceOne) { // if I want to move two squares and no one blockades
         if (!imagine && ubi(surroundingGps.u).firstChild || (imagine && finis === iGpsPlenum)
         || (imagine && finis !== iGpsVacuum && ubi(surroundingGps.u).firstChild)) { // a string ;; also equal to tango.origin[COLUMN] + midRow
               exitCode = 4;
               if (theConsole === ON) { // when using attackMap we want to show no console
                  console.log("Exit code: " + exitCode + ".\nA piece is in between.");
               }
               return (exitCode);
         }
      } // else, if empty, we want to move one square in range
      if (!imagine && !ubi(surroundingGps.u).firstChild || (imagine && finis === iGpsVacuum) 
         || (imagine && finis !== iGpsPlenum && !ubi(surroundingGps.u).firstChild)) {
         return(exitCode); // 0
      }

   } else if (lastMove.piece === pawn.s
      && Number(lastMove.end[ROW]) === opMiddle 
      && Number(lastMove.origin[ROW]) === opPawnOrigin
      // until this point we already checked last move was a pawn that moved two squares
      && advanceOne // we need to make sure we want to advance one square
      // if (c/3 === b/2-1) or (c/1 === b/2+1) ,, if the target column is the one next to my row
      && whatMove === "eat"
      // if the row of the opponent's Pawn is same as my origin row
      && Number(lastMove.end[ROW]) === Number(initium[ROW])
   ) {
      // EN PASSANT KILL
      lastMove.img.parentNode.remove(); // delete the last piece <div piece, not the img>
      if (theConsole === ON) { // when using attackMap we want to show no console
         console.log("En passant capture");   
      }
      return(exitCode); // 0
   } else {
      exitCode = 1;
      if (theConsole === ON) { // when using attackMap we want to show no console
         console.log("Exit code: " + exitCode + "\nEn passant is not possible.");      
      }
      return(exitCode); // current piece and last piece are pawns but en passant not possible
   }
}

function rookMove(finis, initium, piecediv, myColor, imagine, iGpsPlenum, iGpsVacuum) {
   finis = finis || tango.end;
   initium = initium || tango.origin;
   piecediv = piecediv || tango.piece;
   myColor = myColor || players.colors[currentPlayer];
   imagine = imagine || false;
   iGpsPlenum = iGpsPlenum || null;
   iGpsVacuum= iGpsVacuum || null;

   var difference, startGps = initium, quo, pieceChecker, exitCode = 0;
   if (initium === finis) { // this is thought for the attackMap function
      exitCode = 5; // 5 to maintain unity
      return(exitCode);
   }
   // checking friendly captures here will break the attackMap!!
   if (imagine && finis === iGpsPlenum) { // iGpsPlenum presoposes a friendly piece
      exitCode = 4;
      return(exitCode);
   } 

   // if the column or the row is the same
   if (columns.n[finis[COLUMN]] === columns.n[initium[COLUMN]]) {
      difference = Math.abs(Number(finis[ROW]) - Number(initium[ROW])); // how many squares are in between
      if (Number(finis[ROW]) > Number(initium[ROW])) { // what direction?
         if (myColor === "white") {
            quo = "u"; // up
         } else {
            quo = "d"; // down
         }
      } else {
         if (myColor === "white") {
            quo = "d";
         } else {
            quo = "u";
         }
      }
      // we never check the last square for it either is empty or with a piece, and we have already checked that
      for (var i = 1; i < difference; i++) { 
         surroundChecker(startGps, piecediv);
         pieceChecker = ubi(surroundingGps[quo]); // a square
         if (surroundingGps[quo] === iGpsPlenum && imagine) { 
            // iGpsPlenum will always be full
            exitCode = 6;
            if (theConsole === ON) { // when using attackMap we want to show no console
               console.log("Exit code: " + exitCode + ".\nA piece is in between.");
            }
            return (exitCode);
         } else if (surroundingGps[quo] === iGpsVacuum && imagine) { 
            1; // iGpsVacuum will always be empty
         } else if (pieceChecker.firstChild) {
            exitCode = 1;
            if (theConsole === ON) { // when using attackMap we want to show no console
               console.log("Error code: " + exitCode + ".\nA piece is in between.");               
            }
            return(exitCode);
         }
         startGps = surroundingGps[quo]; // it can be .u or .d
      }
      return(exitCode); // 0
   } else if (Number(finis[ROW]) === Number(initium[ROW])) {
      difference = Math.abs(columns.n[finis[COLUMN]] - columns.n[initium[COLUMN]]);
      if (columns.n[finis[COLUMN]] < columns.n[initium[COLUMN]]) { // what direction?
         if (myColor === "white") {
            quo = "l"; // left
         } else {
            quo = "r"; // right
         }
      } else {
         if (myColor === "white") {
            quo = "r";
         } else {
            quo = "l";
         } 
      }
      // we never check the last square for it either is empty or with a piece, and we have already checked that
      for (var i = 1; i < difference; i++) { // the i = 1 gets out the tango.end
         surroundChecker(startGps, piecediv);
         pieceChecker = ubi(surroundingGps[quo]);
         if (surroundingGps[quo] === iGpsPlenum && imagine) { 
            // iGpsPlenum will always be full
            exitCode = 6;
            if (theConsole === ON) { // when using attackMap we want to show no console
               console.log("Exit code: " + exitCode + ".\nA piece is in between.");
            }
            return (exitCode);
         } else if (surroundingGps[quo] === iGpsVacuum && imagine) { 
            1; // iGpsVacuum will always be empty
         } else if (pieceChecker.firstChild) {
            exitCode = 2;
            if (theConsole === ON) { // when using attackMap we want to show no console
               console.log("Error code: " + exitCode + ".\nA piece is in between.");               
            }
            return(exitCode);
         }
         startGps = surroundingGps[quo]; // it can be .l or .r
      }
      return(exitCode);
   }
   exitCode = 3; // if not a rook possible move
   return(exitCode);
}

function knightMove(finis, initium, myColor) {
   finis = finis || tango.end;
   initium = initium || tango.origin;
   myColor = myColor || tango.color;

   if (initium === finis) {
      return(5); // to maintain unity it is 5
   }

   checkDirection(myColor);
   var knightMoves = { // let's code with knight on d4 as sample
      a: columns.l[columns.n[initium[COLUMN]] - xRight] + (Number(initium[ROW]) + yUp * 2), // Nc6
      b: columns.l[columns.n[initium[COLUMN]] - xRight * 2] + (Number(initium[ROW]) + yUp), // Nb5 
      c: columns.l[columns.n[initium[COLUMN]] - xRight * 2] + (Number(initium[ROW]) - yUp), // Nb3 
      d: columns.l[columns.n[initium[COLUMN]] - xRight] + (Number(initium[ROW]) - yUp * 2), // Nc2 
      e: columns.l[columns.n[initium[COLUMN]] + xRight] + (Number(initium[ROW]) - yUp * 2), // Ne2 
      f: columns.l[columns.n[initium[COLUMN]] + xRight * 2] + (Number(initium[ROW]) - yUp), // Nf3  
      g: columns.l[columns.n[initium[COLUMN]] + xRight * 2] + (Number(initium[ROW]) + yUp), // Nf5  
      h: columns.l[columns.n[initium[COLUMN]] + xRight] + (Number(initium[ROW]) + yUp * 2) // Ne6
   };
   for (var x in knightMoves) {
      if (finis === knightMoves[x]) {
         return(0);
      }
   }
   return(1);
}

function bishopMove(quidSquareId, finis, initium, piecediv, myColor, squareId, imagine, iGpsPlenum, iGpsVacuum) { // In Chess diagonals are equal to the sides of their triangles
   finis = finis || tango.end;
   initium = initium || tango.origin;
   piecediv = piecediv || tango.piece;
   myColor = myColor || tango.color;
   squareId = squareId || mySquareId;
   imagine = imagine || false;
   iGpsPlenum = iGpsPlenum || null;
   iGpsVacuum= iGpsVacuum || null;

   if (board[squareId].c !== board[quidSquareId].c) { // newSquareId or OpSquareId
      return(1); // if the color of my bishop doesn't match the end square ,, or I selected end = origin
   }
   if (initium === finis) {
      return(5);
   }
   // if friendly we deal that on successful move or in checkmate, not on attackMap
   if (imagine && finis === iGpsPlenum) { // iGpsPlenum presoposes a friendly piece
      return(4);
   } 
   var myRow = Number(initium[ROW]), endRow = Number(finis[ROW]), // as example a1-c3
   myColumn = columns.n[initium[COLUMN]], endColumn = columns.n[finis[COLUMN]],
   startGps = initium, whatDirection;
   var rowDif = Math.abs(endRow - myRow), colDif = Math.abs(endColumn - myColumn);
   if (rowDif === colDif) { // if we have got a perfect triangle
      checkDirection(myColor);
      if (yUp === 1) {
         if (endRow > myRow) {
            if (endColumn > myColumn) {
               whatDirection = "ur";
            } else {
               whatDirection = "ul";
            }
         } else if (endColumn > myColumn) {
            whatDirection = "dr";
         } else {
            whatDirection = "dl";
         }
      } else {
         if (endRow > myRow) {
            if (endColumn > myColumn) {
               whatDirection = "dl";
            } else {
               whatDirection = "dr";
            }
         } else if (endColumn > myColumn) {
            whatDirection = "ul";
         } else {
            whatDirection = "ur";
         }
      }
      surroundChecker(startGps, piecediv);
      while (surroundingGps[whatDirection] !== finis) { // i dont study the start gps nor the end
         if (surroundingGps[whatDirection] === iGpsPlenum && imagine) { 
            // iGpsPlenum will always be full
            if (theConsole === ON) { // when using attackMap we want to show no console
               console.log("Exit code: 6.\nA piece is in between.");
            }
            return(6);
         } else if (surroundingGps[whatDirection] === iGpsVacuum && imagine) { 
            1; // iGpsVacuum will always be empty
         } else if (ubi(surroundingGps[whatDirection]).firstChild) { // if not empty
            if (theConsole === ON) { // when using attackMap we want to show no console
               console.log("Exit code: 2.\nA piece is in between.");
            }
            return(2);
         }
         startGps = surroundingGps[whatDirection];
         surroundChecker(startGps, piecediv);
      }
   } else {
      return(3);
   }
   return(0);
}

function queenMove(quidSquareId, finis, initium, piecediv, myColor, squareId, imagine, iGpsPlenum, iGpsVacuum) {
   finis = finis || tango.end;
   initium = initium || tango.origin;
   piecediv = piecediv || tango.piece;
   myColor = myColor || tango.color;
   squareId = squareId || mySquareId;
   imagine = imagine || false;
   iGpsPlenum = iGpsPlenum || null;
   iGpsVacuum= iGpsVacuum || null;

   if (initium === finis) { // this is thought for the attackMap function
      // 5 to maintain unity
      return(5);
   }
   return (rookMove(finis, initium, piecediv, myColor, imagine, iGpsPlenum, iGpsVacuum) * bishopMove(quidSquareId, finis, initium, piecediv, myColor, squareId, imagine, iGpsPlenum, iGpsVacuum));
}

function kingMove(finis, initium, piecediv, castle) { // we are considering the end gps as empty
   finis = finis || tango.end;
   initium = initium || tango.origin;
   piecediv = piecediv || tango.piece;
   castle = castle || false;
   var legal = false, exitCode = 0;

   // first check if the square is reachable
   if (initium === finis) { // this is thought for the attackMap function
      exitCode = 5; // 5 to maintain unity
      return(exitCode);
   }

   // moving by one
   surroundChecker(initium, piecediv);
   for (var x in surroundingGps) {
      if (finis === surroundingGps[x]) {
         legal = true;
         // if there's a piece there of my color
         if (ubi(finis).firstChild && ubi(finis).firstChild.firstChild.id === piecediv.firstChild.id) {
            exitCode = 2;
            if (theConsole === ON) { // when using attackMap we want to show no console
               console.log("Error code: " + exitCode + ".\nWe cannot capture a friendly piece");         
            }
            return(exitCode);
         }
      }
   }

   // castling
   if (castle) { // we require this to avoid this code to run on hypothetical moves
      exitCode = 4; // unsuccessful castle ;; we place this line here to avoid bugs
      var opColorNum = players.colorNum[opColor],
      myColorNum = players.colorNum[myColor];
      if (players.kcastle[myColorNum]) { // if castle rights are true
         attackMap(); // we need to avoid passing through check
         if (myColor === "white" && finis === "g1" && players.rcastle.h1) {
            if (ubi("f1").firstChild === null && ubi("g1").firstChild === null // if empty & not attacked
            && !players.attacks[opColorNum]["f1"] && !players.attacks[opColorNum]["g1"]) {
               legal = true;
               exitCode = -1; // we want to avoid castling move if check
            }
         } else if (myColor === "white" && finis === "c1" && players.rcastle.a1) {
            if (ubi("d1").firstChild === null && ubi("c1").firstChild === null
            && ubi("b1").firstChild === null && !players.attacks[opColorNum]["d1"] // if empty & not attacked
            && !players.attacks[opColorNum]["c1"] && !players.attacks[opColorNum]["b1"]) {
               legal = true;
               exitCode = -1; // we want to avoid castling move if check
            }
         } else if (myColor === "red" && finis === "g8" && players.rcastle.h8) {
            if (ubi("f8").firstChild === null && ubi("g8").firstChild === null // if empty & not attacked
            && !players.attacks[opColorNum]["f8"] && !players.attacks[opColorNum]["g8"]) {
               legal = true;
               exitCode = -1; // we want to avoid castling move if check
            }
         } else if (myColor === "red" && finis === "c8" && players.rcastle.a8) {
            if (ubi("d8").firstChild === null && ubi("c8").firstChild === null
            && ubi("b8").firstChild === null && !players.attacks[opColorNum]["d8"] // if empty & not attacked
            && !players.attacks[opColorNum]["c8"] && !players.attacks[opColorNum]["b8"]) {
               legal = true;
               exitCode = -1; // we want to avoid castling move if check
            }
         } // if successful we dont want to take away castling rights here, only after successful move
      }
   }

   if (!legal) {
      exitCode = 1;
      if (theConsole === ON) { // when using attackMap we want to show no console
         console.log("Error code: " + exitCode + ".\n" + king.s + " only moves by one square.");         
      }
      return(exitCode);
   } // else
   return(exitCode);
}

function ubi(gps) {
   return document.querySelector('[gps="' + gps + '"]'); // same as quaero('[gps="' + gps + '"]')
}

function checkDirection(myColor) {
   if (myColor === "white") {
      yUp = 1;
      xRight = 1;
   } else {
      yUp = -1;
      xRight = -1;
   }
}

function surroundChecker(gps, myPiece, myColor) { // fixed input par
   myPiece = myPiece || tango.piece;
   myColor = myColor || 0;
   var myColumn = columns.n[gps[COLUMN]],
   myRow = Number(gps[ROW]);
   if (myColor === 0) { // myColor overrides myPiece 
      checkDirection(myPiece.firstChild.id);
   } else {
      checkDirection(myColor);
   }
   
   surroundingGps = { 
      dl: columns.l[myColumn - xRight] + (myRow - yUp), 
      l: columns.l[myColumn - xRight] + myRow, 
      ul: columns.l[myColumn - xRight] + (myRow + yUp), 
      u: gps[COLUMN] + (myRow + yUp), 
      ur: columns.l[myColumn + xRight] + (myRow + yUp), 
      r: columns.l[myColumn + xRight] + myRow, 
      dr: columns.l[myColumn + xRight] + (myRow - yUp), 
      d: gps[COLUMN] + (myRow - yUp) 
   };

   for (var x in surroundingGps) {
      if (Number(surroundingGps[x][1]) === 9 || Number(surroundingGps[x][1]) === 0 || surroundingGps[x] == undefined) {
         surroundingGps[x] = null;
      }
   }
}

function relinquo(ev) { // drop function
   // if the piece I touch is not of my turn
   if (tango.color !== players.colors[currentPlayer]) { // only if color's turn
      return(1);
   }
   if (lastMove.color === players.colors[currentPlayer]) {
      throw new Error("Last move's color matches current player color.");
   }
   ev.stopPropagation();
   /**
    * Event.stopPropagation(): void
    * When dispatched in a tree, invoking this method prevents event from reaching any objects other than the current object.
    */
   tango.endintra0 = tango.endpiece = ev.target; // empty square or piecediv
   tango.endintra1 = ev.target.parentNode; // gameboard or piecediv

   surroundChecker(tango.origin);

   if (tango.endintra0.firstChild) { // if the intra square has a child (occupied)
      occide();
   } else { // if my target square is empty (if no piece)
      tango.end = tango.endintra0.getAttribute("gps"); // end gps
      // mySquareId and opSquareId contain the board's ids as a number
      mySquareId = Number(ubi(tango.origin).getAttribute("square-id"));
      newSquareId = Number(ubi(tango.end).getAttribute("square-id"));

      // add castle and promoting
      var myPiece = tango.piece.id; // for instance "pawn"
      let y = 0; // no castle
      if (myPiece === "king" && ((myColor === "white" && tango.origin === "e1" && (tango.end === "g1" || tango.end === "c1")) 
         || (myColor === "red" && tango.origin === "e8" && (tango.end === "g8" || tango.end === "c8")))) {
         y = 2; // special move (castle)
      }

      let x = window[myPiece].move(tango.end, tango.origin, y, newSquareId, tango.piece, tango.color, mySquareId);
      if (x === 0) {
         successfulMove(myPiece, newSquareId);
         return(0);
      } else if (myPiece === king.s && x === -1) { // safety check
         successfulMove(myPiece, newSquareId, false, null, tango.end, tango.origin, 1); // 1 for castle
         return(-1);
      } else if (myPiece === pawn.s && x === -2) { // safety check
         successfulMove(myPiece, newSquareId, false, null, tango.end, tango.origin, 2); // 2 for promoting
         return(-2);
      } // else no move is allowed
      if (theConsole === ON) { // when using attackMap we want to show no console
         console.log("Intended " + myPiece + " move ilegal.");               
      }
      return(1);
   } 
}

function getScore() {

}

function attackMapReset() {
   for (var x = 0; x < board.length; x++) {
      /* console.log(x);  */
      players.attacks[WHITE][board[x].n] = false;
      players.attacks[RED][board[x].n] = false;
      /* console.log(board[x].n);  */
   }
}

function attackMap(imagine, iGpsPlenum, iGpsVacuum, iPiece, iColor) { // castle...
   imagine = imagine || false; // this let's me map hypotetical moves
   iGpsPlenum = iGpsPlenum || null; // the color doesnt matter
   iGpsVacuum= iGpsVacuum || null;
   theConsole = OFF;
   attackMapReset(); // at the beginning of each turn lets reset our checker
   // as long as there's a square ;; we could set it to 64 manually
   for (var i = 0; i < board.length; i++) {
      // first let's reset
      var thisPiece = null, thisPieceName = null, thisColor = null, thisGps = null, squareId = null;
      var thisSquare = ubi(board[i].n); // for instance, the div of the square of "a8"
      squareId = Number(thisSquare.getAttribute("square-id"));
      thisGps = thisSquare.getAttribute("gps");
      if (imagine && thisGps === iGpsVacuum) {
         1;
      } else if (thisSquare.firstChild || (imagine && thisGps === iGpsPlenum)) {
         if (imagine && thisGps === iGpsPlenum) {
            iSquare.innerHTML = iPiece[iColor[0]]; // the div string ;; iSquare is hidden
            thisPieceName = iPiece.s; // the string
            thisPiece = iSquare.firstChild;
            thisColor = iColor;
         } else { // if we are imagining its going to be empty 
            thisPiece = thisSquare.firstChild; // piecediv
            thisPieceName = thisPiece.id;
            thisColor = thisPiece.firstChild.id;
         }
         // there's a bug in checkmate() with the lastmoved piece
         if (thisPieceName === undefined && lastMove.end === thisGps) {
            iSquare.innerHTML = window[lastMove.piece][lastMove.color[0]];
            thisPiece = iSquare.firstChild; // piecediv
            thisPieceName = thisPiece.id;
            thisColor = thisPiece.firstChild.id;
         }
         // let's use this function to locate the kings ;; when mapping we will find both kings
         if (thisPieceName === "king") {
            players.kings[players.colorNum[thisColor]] = thisGps;
         }

         // we are inside the if there's a piece here
         for (var j = 0; j < board.length; j++) {
            var otherSquare = ubi(board[j].n); // the div of "a4"
            var otherSquareId = Number(otherSquare.getAttribute("square-id"));
            var otherGps = otherSquare.getAttribute("gps"); // "a4"        
            if (window[thisPieceName].move(otherGps, thisGps, 1, otherSquareId, thisPiece, thisColor, squareId, imagine, iGpsPlenum, iGpsVacuum) === 0) { // knight.move(...)
               players.attacks[players.colorNum[thisColor]][otherGps] = true; // this piece attacks the end
            }
         }
      }
   }
   iSquare.innerHTML = "";
   theConsole = ON;
} // it works detecting them in the middle squares (in between) and detects them as imaginary pieces

function isAttacked(myPiece, finis, initium, thisColor) { // fixed undeclared parms
   myPiece = myPiece || tango.piece;
   finis = finis || tango.end;
   initium = initium || tango.origin;
   thisColor = thisColor || myColor;
   var thatColor; // now the function works disconnected from the actual player
   if (thisColor === "white") {
      thatColor = "red";
   } else if (thisColor === "red") {
      thatColor = "white";
   }
   var opColorNum = players.colorNum[thatColor];
   // check this before doing the move
   attackMap(); // this fn checks the real map when we move the king
   // if the opponent attacks this gps where I want to move my king
   if (players.attacks[opColorNum][finis] && myPiece.s === "king") { 
   // I cannot go into check ;; it works bc the map of attacked squares doesnt detect self protection
      return (1); 
   } else {
      // this works because the lock to prevent moving to the king's square is a line in occide() 
      // not the actual code for each piece

      // in this function we give as params an empty square and the filled square 
      attackMap(true, finis, initium, myPiece, thisColor); // works 4 either capture or occupying
      // if after imagining the move the king is still on check on the map...
      // discovery check? block check? did I get out of check?
      // either he moves or he doesn't
      var myKingGps = players.kings[players.colorNum[thisColor]];
      if (players.attacks[opColorNum][myKingGps]) { // I cannot go into check
         attackMap(); // reset
         return (2);
      }
      attackMap(); // reset
      return(0); // no threat
   }
}

// check if friendly piece
function checkmate() { // fixed pawn moves
   isAttacked();
   var myKingGps = players.kings[players.colorNum[myColor]],
   opColorNum = players.colorNum[opColor]; 
   if (players.attacks[opColorNum][myKingGps]) { // if the new color is attacked
      var legalMoves = 0;
      for (var i = 0; i < board.length; i++) {
         // first let's reset
         var thisPiece = null, thisPieceName = null, thisColor = null, thisGps = null, squareId = null;
         var thisSquare = ubi(board[i].n); // for instance, the div of the square of "a8"
         squareId = Number(thisSquare.getAttribute("square-id"));
         thisGps = thisSquare.getAttribute("gps");
         if (thisSquare.firstChild) { // if there's a piece
            thisPiece = thisSquare.firstChild; // piecediv
            thisPieceName = thisPiece.id;
            thisColor = thisPiece.firstChild.id;     
            if (thisColor === myColor) {
               for (var j = 0; j < board.length; j++) {
                  var otherSquare = ubi(board[j].n); // the div of "a4"
                  var otherSquareId = Number(otherSquare.getAttribute("square-id"));
                  var otherGps = otherSquare.getAttribute("gps"); // "a4"
                  theConsole = OFF; // each time we run isAttacked() the console is on at the end
                  // we don't use imaginary moves here because we are only looking for real moves to get out of check
                  if (window[thisPieceName].move(otherGps, thisGps, 1, otherSquareId, thisPiece, thisColor, squareId) === 0) { // knight.move(...)                     
                     if (isAttacked(window[thisPieceName], otherGps, thisGps, myColor) === 0)  { 
                        // we should check if it's a legal move
                        if (ubi(otherGps).firstChild) { // we exclude friendly pieces
                           if (ubi(otherGps).firstChild.firstChild.id !== thisColor) { // enemy piece
                              legalMoves++;
                              console.log("thisPieceName: " + thisPieceName + " otherGps: " + otherGps + " thisGps: " + thisGps + " otherSquareId: " + otherSquareId + " thisPiece: " + thisPiece + " thisColor: " + thisColor + " squareId: " + squareId);
                           }
                        } else { // empty square
                           legalMoves++;
                           console.log("thisPieceName: " + thisPieceName + " otherGps: " + otherGps + " thisGps: " + thisGps + " otherSquareId: " + otherSquareId + " thisPiece: " + thisPiece + " thisColor: " + thisColor + " squareId: " + squareId);
                        }
                     }
                     
                  }
                  if (thisPieceName === pawn.s) { // look again without considering captures
                     // if the pawn move doesnt go to the actual threat
                     if (!ubi(otherGps).firstChild && (window[thisPieceName].move(otherGps, thisGps, 0, otherSquareId, thisPiece, thisColor, squareId) === 0)) { // knight.move(...)
                        if (isAttacked(window[thisPieceName], otherGps, thisGps, myColor) === 0)  { 
                           // we should check if it's a legal move
                           legalMoves++;
                           console.log("thisPieceName: " + thisPieceName + " otherGps: " + otherGps + " thisGps: " + thisGps + " otherSquareId: " + otherSquareId + " thisPiece: " + thisPiece + " thisColor: " + thisColor + " squareId: " + squareId);
                        }
                        
                     }      
                  }
               }
            }
         }
      }
      console.log("Number of legal moves = " + legalMoves + ".");
      theConsole = ON;
      if (legalMoves === 0) {
         players.score[currentPlayer] = 0;
         players.score[opColorNum] = 1;
         checkmated = true;
         alert(opColor + " wins by checkmate");
         return(0); // checkmate
      }
   }
   return(1);
}

function quaero(attr, all) {
   all = all || false;
   if (all) {
      return document.querySelectorAll(attr);
   }
   return document.querySelector(attr);
}

function flipBoard() {

   for (var i = 81, j = 0; i > 0; i--) { // for each coordinate ;; j is a second counter
      square.setAttribute("square-id", i); // Sets the value of element's first attribute whose qualified name is qualifiedName to value.
   
      // These are the boarders
      if (i === 0 || i === 9 || i === 18 || i === 27 || i === 36 || i === 45 || i === 54 ||  i === 63 || i >= 72) {
         // a way of detecting the boarders
         var a = 0, b = 9, c = 18, d = 27, e = 36, f = 45, g = 54, h = 63, vowels = ["a", "b", "c", "d", "e", "f", "g", "h"];
         var cont; // contains
         var sursum = 1; // top is a bad name ;; border-left
   
         if (i === a) {
            cont = "8";
         } else if (i === b) {
            cont = "7";
         } else if (i === c) {
            cont = "6";
         } else if (i === d) {
            cont = "5";
         } else if (i === e) {
            cont = "4";
         } else if (i === f) {
            cont = "3";
         } else if (i === g) {
            cont = "2";
         } else if (i === h) {
            cont = "1";
         } else if (i === 72) {
            cont = "";
            sursum = 3; // border
         } else { 
            // for instance 73 - 73 is 0
            cont = vowels[i - 73]; 
            sursum = 2; // border-down
         }
   
         // the content of that square is going to be the name
         square.innerHTML = cont;
   
         // let's number each one, then name them
         square.setAttribute("gps", cont); // load the name
         
         // the color stays the same
         square.classList.add("pink");
   
         // lets id these boarder squares
         if (sursum === 1) {
            square.classList.add("boarder-left");
         } else if (sursum === 2) {
            square.classList.add("boarder-down");
         } else {
            square.classList.add("boarder");
         }
      }
   
      else { // game squares
         // the content of that square is going to be the start image
         square.innerHTML = board[j]["p"]; // load the initial position
         
         if (square.firstChild) { // if there
            square.firstChild.setAttribute("draggable", true); // only pieces start with a child on the square (div)
         }
   
         // let's number each one, then name them
         square.setAttribute("gps", board[j]["n"]); // load the name
         
         // this is a square part of the game, not a boarder
         square.classList.add("intra");
   
         // the color depends on the coordinate
         if (board[j]["c"] === 1) {
            square.classList.add("red");
         }         
         else {
            square.classList.add("white");
         }
         j++;
      }
      
      // add it to the gameboard
      gameboard.append(square);
   }


}

function flipIds() {
   if (!flipWill) {
      return;
   }
   var omnia = document.querySelectorAll("#gameboard .intra");
   omnia.forEach(
      function (square, i) {
         if (currentPlayer === WHITE) { // if its white
            square.setAttribute("square-id", (width * width - 1) - i);
         } else {
            square.setAttribute("square-id", i);
         }
      }
   ); 
}

function saveGame() {
   
   var y = "", z = "", comma = ", ", lastcomma = ", ";
   for (var x in lastMove.board) {
      if (!lastMove.board[x+1]) {
         lastcomma = "";
      }
      y = y + lastMove.board[x].n + comma + lastMove.board[x].c + comma + lastMove.board[x].p + lastcomma;
   }

   for (var x in lastMove.game) {
      if (lastMove.game[x][1]) {
         comma = comma + lastMove.game[x][1] + comma;
      } else {
         comma = "";
      }
      z = z + lastMove.game[x][0] + comma;
   }
   
   var content = 
   "lastMove.end = " + lastMove.end +"\n"
   + "lastMove.origin = " + lastMove.origin +"\n"
   + "lastMove.piece = " + lastMove.piece +"\n"
   + "lastMove.color = " + lastMove.color +"\n"
   + "lastMove.img = " + window[lastMove.piece][lastMove.color[0]] +"\n"
   + "lastMove.turn = " + lastMove.turn +"\n"
   + "lastMove.board = " + y +"\n" 
   + "lastMove.game = " + z +"\n";

   var file = new File(["\ufeff" + content],
      "chess.txt",
      {type:"text/plain:charset=UTF-8"}
   );

   var url = window.URL.createObjectURL(file);

   var a = document.createElement("a");
   a.style = "display:none";
   a.href = url;
   a.download = file.name;
   a.click();
   window.URL.revokeObjectURL(url);
}

var fileInput = document.querySelector("#loadgame");
var preview = document.getElementById("preview");
fileInput.addEventListener("change", 
   function() {
      var fr = new FileReader();
      fr.readAsText(fileInput.files[0]);
      fr.addEventListener("load", 
         function() {
            preview.textContent = fr.result;
         }
      );
   }
);

omnia.forEach(
   function (square) {
      square.addEventListener("dragstart", 
         function(ev) {
            if (!checkmated) {
               // console.log("test sumo");
               sumo(ev);
            }
         });
      square.addEventListener("dragover", 
         function(ev) {
            if (!checkmated) {
               // console.log("test superteneo");
               superteneo(ev);
            }
         });
      square.addEventListener("drop", 
         function(ev) {
            if (!checkmated) {
               // console.log("test relinquo");
               relinquo(ev);
            }
         });
   }
);