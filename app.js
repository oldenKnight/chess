"use strict";

const COLUMN = 0, ROW = 1, WHITE = 0, RED = 1;
var gameboard = document.querySelector("#gameboard"), // the div
   showPlayer = document.querySelector("#player"), // whose turn it is
   extraInfo = document.querySelector("#info-display"), // the extra info to show below the player's name
   width = 8,
   players = {
      colors: ["white", "red"],
      pieces: [
         [king, queen, bishop, bishop, knight, knight, rook, rook,
            pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn ],
         [king, queen, bishop, bishop, knight, knight, rook, rook,
            pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn ]
      ],
      score: [ , ],
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
   flipWill = false; // do you want to flip the board?
   showPlayer.textContent = players.colors[currentPlayer];

// pre setup
for (var x = 0; x < board.length; x++) {
   /* console.log(x);  */
   players.attacks[WHITE][board[x].n] = false;
   players.attacks[RED][board[x].n] = false;
   /* console.log(board[x].n);  */
}

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
   } else {
      currentPlayer = WHITE;
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
   // isKingAttacked();
   var 
      myPiece = tango.piece.id,
      opponentsPieceColor = tango.endpiece.firstChild.id,
      opponentsPiece = tango.endpiece.id,
      legal = false;

   checkDirection(players.colors[currentPlayer]);
   
   // not the best way to compare strings
   // only if opponents piece && piece is not a "king"
   if (tango.color != opponentsPieceColor && opponentsPiece !== king.s) { 
      tango.end = tango.endintra1.getAttribute("gps");
      
      // mySquareId and opSquareId contain the board's ids as a number
      mySquareId = Number(ubi(tango.end).getAttribute("square-id"));
      opSquareId = Number(ubi(tango.end).getAttribute("square-id"));

      // normal pawn capture, en passant has its own function
      if (myPiece === pawn.s) {
         if (pawnMove(true) === 0) { // true since there's a capture
            legal = true;
         }
      } else if (myPiece === rook.s) {
         if (rookMove() === 0) {
            legal = true;
         }
      } else if (myPiece === knight.s) {
         if (knightMove() === 0) {
            legal = true;
         }
      } else if (myPiece === bishop.s) {
         if (bishopMove(opSquareId) === 0) {
            legal = true;
         }
      } else if (myPiece === queen.s) {
         if (queenMove(opSquareId) === 0) {
            legal = true;
         }
      } else if (myPiece === king.s) {
         if (kingMove() === 0) {
            legal = true;
         }
      }
      // We already checked that is a legal move
      if (legal) {
         successfulMove(myPiece, opSquareId, true, opponentsPiece);
      }
   } 
}

function successfulMove(myPiece, quidSquareId, capture, opponentsPiece) {
   capture = capture || false;
   var action = " to ", x = "", firstL = myPiece[0];
   if (myPiece === "knight") {
      firstL = "n" + tango.origin;
   }  else if (myPiece === "pawn") {
      firstL = "";
   } else if (myPiece === "rook") { // we could improve this to show full only if both rooks are on the same column
      firstL = firstL + tango.origin;
   }

   if (capture) {
      // if isAttacked(myPiece, tango.endpiece, myColor, oppColor) /**detects myKing.ubi */    && isAttacked()

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
   
   // logging move ;; for instance 'pawn e4 takes pawn d5'
   console.log(myPiece + " " + tango.origin + action + tango.end); // the only datum i need
   
   if (myColor[0] === "w") {
      lastMove.game.push([]);
   }
   lastMove.game[lastMove.turn].push(firstL + x + tango.end);
   if (myColor[0] === "r") {
      lastMove.turn++;    
   }

   // change player turn
   playerSwitch(); 
}

function pawnMove(capture) {
   // we already know that my selected piece is a pawn, and that the end square is empty
   capture = capture || false;
   var 
      // myPiece = tango.piece.id,
      enPassant = false,
      advanceOne = true, // else means advance two
      whatMove,
      myPawnOrigin,
      opPawnOrigin,
      // myMiddle,
      // midRow,
      opMiddle,
      exitCode = 0;

   // color checker
   if (players.colors[currentPlayer] === "white") {
      yUp = 1;
      myPawnOrigin = 2; // 2nd row
      opPawnOrigin = 7;
      // myMiddle = 4;
      opMiddle = 5;
   } else {
      yUp = -1;
      myPawnOrigin = 7; // 7th row
      opPawnOrigin = 2;
      // myMiddle = 5;
      opMiddle = 4;
   }

   // advance checker
   if (Number(tango.end[ROW]) === Number(tango.origin[ROW]) + yUp) { // I want to advance 1
      advanceOne = true;
      // if (c/3 === b/2-1) or (c/1 === b/2+1)
      if (capture === true && (columns.n[tango.end[COLUMN]] === columns.n[tango.origin[COLUMN]] - 1 
         || columns.n[tango.end[COLUMN]] === columns.n[tango.origin[COLUMN]] + 1)) {
         return(exitCode); // capture
      }
   } else if (Number(tango.end[ROW]) === Number(tango.origin[ROW]) + (yUp * 2) 
      && Number(tango.origin[ROW]) === myPawnOrigin) { // and I start from the beginning 
      // midRow = Number(tango.origin[ROW]) + yUp;
      advanceOne = false; // I want to advance 2
   } else { // out of range on y axis
      exitCode = 2;
      console.log("Exit code: " + exitCode + ".\nOut of range on y axis.\n" + pawn.s + " can only move upwards & up to two squares.");
      return(exitCode); // we can't move such a move
   }

   // eat or advance?
   if (lastMove.end[COLUMN] === tango.end[COLUMN] // avoid en passant behaviour from other columns
      && (columns.n[tango.end[COLUMN]] === columns.n[tango.origin[COLUMN]] - 1 
      || columns.n[tango.end[COLUMN]] === columns.n[tango.origin[COLUMN]] + 1 )) {
         whatMove = "eat";
         enPassant = true; // do I intend to move "en passant"?
   } else if (columns.n[tango.end[COLUMN]] === columns.n[tango.origin[COLUMN]]) {
      whatMove = "advance";
   } else { // out of range on x axis
      exitCode = 3;
      console.log("Exit code: " + exitCode + ".\nOut of range on x axis.\n" + pawn.s + " can only move by advancing 1 or 2 squares, or by eating the opponents pawns diagonally 1 square");
      return(exitCode); // we can't move such a move
   }

   if (enPassant === false) {
      if (advanceOne === false) { // if I want to move two squares and no one blockades
         if ((ubi(surroundingGps.u)).firstChild) { // a string ;; also equal to tango.origin[COLUMN] + midRow
            exitCode = 4;
            console.log("Exit code: " + exitCode + ".\nA piece is in between.")
            return (exitCode);
         }
      } // else if we want to move one square in range, we have already checked that it is empty
      return(exitCode); // 0
   } else if (lastMove.piece === pawn.s
      && Number(lastMove.end[ROW]) === opMiddle 
      && Number(lastMove.origin[ROW]) === opPawnOrigin
      // until this point we already checked last move was a pawn that moved two squares
      && advanceOne // we need to make sure we want to advance one square
      // if (c/3 === b/2-1) or (c/1 === b/2+1) ,, if the target column is the one next to my row
      && whatMove === "eat"
      // if the row of the opponent's Pawn is same as my origin row
      && Number(lastMove.end[ROW]) === Number(tango.origin[ROW])
   ) {
      // EN PASSANT KILL
      lastMove.img.parentNode.remove(); // delete the last piece <div piece, not the img>
      console.log("En passant capture");
      return(exitCode); // 0
   } else {
      exitCode = 1;
      console.log("Exit code: " + exitCode + "\nEn passant is not possible.")
      return(exitCode); // current piece and last piece are pawns but en passant not possible
   }
}

function rookMove() {
   var difference, startGps = tango.origin, quo, pieceChecker, exitCode = 0;
   // if the column or the row is the same
   if (columns.n[tango.end[COLUMN]] === columns.n[tango.origin[COLUMN]]) {
      difference = Math.abs(Number(tango.end[ROW]) - Number(tango.origin[ROW])); // how many squares are in between
      if (Number(tango.end[ROW]) > Number(tango.origin[ROW])) { // what direction?
         if (players.colors[currentPlayer] === "white") {
            quo = "u"; // up
         } else {
            quo = "d"; // down
         }
      } else {
         if (players.colors[currentPlayer] === "white") {
            quo = "d";
         } else {
            quo = "u";
         }
      }
      // we never check the last square for it either is empty or with a piece, and we have already checked that
      for (var i = 1; i < difference; i++) { 
         surroundChecker(startGps);
         pieceChecker = ubi(surroundingGps[quo]);
         if (pieceChecker.firstChild) {
            exitCode = 1;
            console.log("Error code: " + exitCode + ".\nA piece is in between.");
            return(exitCode);
         }
         startGps = surroundingGps[quo]; // it can be .u or .d
      }
      return(exitCode); // 0
   } else if (Number(tango.end[ROW]) === Number(tango.origin[ROW])) {
      difference = Math.abs(columns.n[tango.end[COLUMN]] - columns.n[tango.origin[COLUMN]]);
      if (columns.n[tango.end[COLUMN]] < columns.n[tango.origin[COLUMN]]) { // what direction?
         if (players.colors[currentPlayer] === "white") {
            quo = "l"; // left
         } else {
            quo = "r"; // right
         }
      } else {
         if (players.colors[currentPlayer] === "white") {
            quo = "r";
         } else {
            quo = "l";
         } 
      }
      // we never check the last square for it either is empty or with a piece, and we have already checked that
      for (var i = 1; i < difference; i++) { // the i = 1 gets out the tango.end
         surroundChecker(startGps);
         pieceChecker = ubi(surroundingGps[quo]);
         if (pieceChecker.firstChild) {
            exitCode = 2;
            console.log("Error code: " + exitCode + ".\nA piece is in between.");
            return(exitCode);
         }
         startGps = surroundingGps[quo]; // it can be .l or .r
      }
      return(exitCode);
   }
   exitCode = 3; // if not a rook possible move
   return(exitCode);
}

function knightMove() {
   checkDirection(tango.color);
   var knightMoves = { // let's code with knight on d4 as sample
      a: columns.l[columns.n[tango.origin[COLUMN]] - xRight] + (Number(tango.origin[ROW]) + yUp * 2), // Nc6
      b: columns.l[columns.n[tango.origin[COLUMN]] - xRight * 2] + (Number(tango.origin[ROW]) + yUp), // Nb5 
      c: columns.l[columns.n[tango.origin[COLUMN]] - xRight * 2] + (Number(tango.origin[ROW]) - yUp), // Nb3 
      d: columns.l[columns.n[tango.origin[COLUMN]] - xRight] + (Number(tango.origin[ROW]) - yUp * 2), // Nc2 
      e: columns.l[columns.n[tango.origin[COLUMN]] + xRight] + (Number(tango.origin[ROW]) - yUp * 2), // Ne2 
      f: columns.l[columns.n[tango.origin[COLUMN]] + xRight * 2] + (Number(tango.origin[ROW]) - yUp), // Nf3  
      g: columns.l[columns.n[tango.origin[COLUMN]] + xRight * 2] + (Number(tango.origin[ROW]) + yUp), // Nf5  
      h: columns.l[columns.n[tango.origin[COLUMN]] + xRight] + (Number(tango.origin[ROW]) + yUp * 2) // Ne6
   };
   for (var x in knightMoves) {
      if (tango.end === knightMoves[x]) {
         return(0);
      }
   }
   return(1);
}

function bishopMove(quidSquareId) { // In Chess diagonals are equal to the sides of their triangles
   if (board[mySquareId].c !== board[quidSquareId].c) { // newSquareId or OpSquareId
      return(1); // if the color of my bishop doesn't match the end square
   } 
   var myRow = Number(tango.origin[ROW]), endRow = Number(tango.end[ROW]), // as example a1-c3
   myColumn = columns.n[tango.origin[COLUMN]], endColumn = columns.n[tango.end[COLUMN]],
   startGps = tango.origin, whatDirection;
   var rowDif = Math.abs(endRow - myRow), colDif = Math.abs(endColumn - myColumn);
   if (rowDif === colDif) { // if we have got a perfect triangle
      checkDirection(tango.color);
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
      surroundChecker(startGps);
      while (surroundingGps[whatDirection] !== tango.end) { // i dont study the start gps nor the end
         if (ubi(surroundingGps[whatDirection]).firstChild) { // if not empty
            return(2);
         }
         startGps = surroundingGps[whatDirection];
         surroundChecker(startGps);
      }
   } else {
      return(3);
   }
   return(0);
}

function queenMove(quidSquareId) {
   return (rookMove() * bishopMove(quidSquareId));
}

function kingMove() { // we are considering the end gps as empty
   var legal = false, exitCode = 0;
   // first check if the square is reachable
   surroundChecker(tango.origin);
   for (var x in surroundingGps) {
      if (tango.end === surroundingGps[x]) {
         legal = true;
      }
   }
   if (legal === false) {
      exitCode = 1;
      console.log("Error code: " + exitCode + ".\n" + king.s + " only moves by one square.");
      return(exitCode);
   }
   // Now lets check that the surrounding squares are not attacked
   surroundChecker(tango.end);
   for (var x in surroundingGps) {
      var ibi = ubi(surroundingGps[x]);
      if(ibi.firstChild && ibi.firstChild.firstChild.id !== tango.color) { // works but 
      // change for check if attacked
         exitCode = 2;
         return(exitCode);
      }
   }
   if (legal) {
      return(exitCode);
   }
}

function ubi(gps) {
   return document.querySelector('[gps="' + gps + '"]'); // same as quaero('[gps="' + gps + '"]')
}

function checkDirection(color) {
   if (color === "white") {
      yUp = 1;
      xRight = 1;
   } else {
      yUp = -1;
      xRight = -1;
   }
}

function surroundChecker(gps, myPiece) {
   myPiece = myPiece || tango.piece;
   var myColumn = columns.n[gps[COLUMN]],
   myRow = Number(gps[ROW]);
   checkDirection(myPiece.firstChild.id);
   
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
   tango.endintra0 = tango.endpiece = ev.target; // empty square or piece
   tango.endintra1 = ev.target.parentNode; // piece

   surroundChecker(tango.origin);

   if (tango.endintra0.firstChild) { // if the intra square has a child (occupied)
      occide();
   } else if (!tango.endintra0.firstChild) { // if my target square is empty (if no piece)
      tango.end = tango.endintra0.getAttribute("gps"); // end gps
      // mySquareId and opSquareId contain the board's ids as a number
      mySquareId = Number(ubi(tango.origin).getAttribute("square-id"));
      newSquareId = Number(ubi(tango.end).getAttribute("square-id"));

      var myPiece = tango.piece.id; // for instance "pawn"
      if (myPiece === pawn.s) {
         if (pawnMove() !== 0) {
            console.log("Intended " + pawn.s + " move ilegal.")
            return(1);
         };
      } else if (myPiece === king.s) {
         if (kingMove() !== 0) {
            console.log("Intended " + king.s + " move ilegal.")
            return(1);
         };
      } else if (myPiece === rook.s) {
         if (rookMove() !== 0) {
            console.log("Intended " + rook.s + " move ilegal.")
            return(1);
         }
      } else if (myPiece === knight.s) {
         if (knightMove() !== 0) {
            console.log("Intended " + knight.s + " move ilegal.")
            return(1);
         }
      } else if (myPiece === bishop.s) {
         if (bishopMove(newSquareId) !== 0) {
            console.log("Intended " + bishop.s + " move ilegal.")
            return(1);
         }
      } else if (myPiece === queen.s) {
         if (queenMove(newSquareId) !== 0) {
            console.log("Intended " + queen.s + " move ilegal.")
            return(1);
         }
      }
      successfulMove(myPiece, newSquareId);
   } // else no move is allowed
   

  /*  // only if opponents piece
   tango.end = ev.target.parentNode.append(tango.piece); // append to the second square
   ev.target.remove(); */

}

function getScore() {

}

function attackCheck() {
   // as long as there's a square ;; we could set it to 64 manually
   for (var i = 0; i < board.length; i++) {
      var thisPiece = null, thisPieceName = null, thisColor = null; // first reset
      var thisSquare = ubi(board[i].n);
      if (thisSquare.firstChild) {
         thisPiece = thisSquare.firstChild;
         thisPieceName = thisPiece.id;
         thisColor = thisPiece.firstChild.id;

         for (var j = 0; j < board.length; j++) {
            var otherSquare = ubi(board[j].n);
            thisPieceName.move(otherSquare, thisSquare);
         }
      }
   }
}

function isAttacked(myPiece, capture, opPiece) {
   capture = capture || false;
   opPiece = opPiece || false;
   if (myColor === "white") { // or players.colors[currentPlayer]
      var ibi = ubi(myPiece); // or tango.end
      players.attacks[WHITE] 
   }
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
   if (flipWill == false) {
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
      square.addEventListener("dragstart", sumo);
      square.addEventListener("dragover", superteneo);
      square.addEventListener("drop", relinquo);
   }
);