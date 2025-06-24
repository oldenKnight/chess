"use strict";

var gameboard = document.querySelector("#gameboard"), // the div
   showPlayer = document.querySelector("#player"), // whose turn it is
   extraInfo = document.querySelector("#info-display"), // the extra info to show below the player's name
   width = 8,
   board = [ // n for name, c for color, p for piece
      { n: "a8", c: 1, p: rook }, {n: "b8", c: 0, p: knight}, {n: "c8", c: 1, p: bishop}, {n: "d8", c: 0, p: queen}, {n: "e8", c: 1, p: king}, {n: "f8", c: 0, p: bishop}, {n: "g8", c: 1, p: knight}, {n: "h8", c: 0, p: rook},
      { n: "a7", c: 0, p: pawn }, {n: "b7", c: 1, p: pawn}, {n: "c7", c: 0, p: pawn}, {n: "d7", c: 1, p: pawn}, {n: "e7", c: 0, p: pawn}, {n: "f7", c: 1, p: pawn}, {n: "g7", c: 0, p: pawn}, {n: "h7", c: 1, p: pawn},
      { n: "a6", c: 1, p: "" }, {n: "b6", c: 0, p: ""}, {n: "c6", c: 1, p: ""}, {n: "d6", c: 0, p: ""}, {n: "e6", c: 1, p: ""}, {n: "f6", c: 0, p: ""}, {n: "g6", c: 1, p: ""}, {n: "h6", c: 0, p: ""},
      { n: "a5", c: 0, p: "" }, {n: "b5", c: 1, p: ""}, {n: "c5", c: 0, p: ""}, {n: "d5", c: 1, p: ""}, {n: "e5", c: 0, p: ""}, {n: "f5", c: 1, p: ""}, {n: "g5", c: 0, p: ""}, {n: "h5", c: 1, p: ""},
      { n: "a4", c: 1, p: "" }, {n: "b4", c: 0, p: ""}, {n: "c4", c: 1, p: ""}, {n: "d4", c: 0, p: ""}, {n: "e4", c: 1, p: ""}, {n: "f4", c: 0, p: ""}, {n: "g4", c: 1, p: ""}, {n: "h4", c: 0, p: ""},
      { n: "a3", c: 0, p: "" }, {n: "b3", c: 1, p: ""}, {n: "c3", c: 0, p: ""}, {n: "d3", c: 1, p: ""}, {n: "e3", c: 0, p: ""}, {n: "f3", c: 1, p: ""}, {n: "g3", c: 0, p: ""}, {n: "h3", c: 1, p: ""},
      { n: "a2", c: 1, p: pawn }, {n: "b2", c: 0, p: pawn}, {n: "c2", c: 1, p: pawn}, {n: "d2", c: 0, p: pawn}, {n: "e2", c: 1, p: pawn}, {n: "f2", c: 0, p: pawn}, {n: "g2", c: 1, p: pawn}, {n: "h2", c: 0, p: pawn},
      { n: "a1", c: 0, p: rook }, {n: "b1", c: 1, p: knight}, {n: "c1", c: 0, p: bishop}, {n: "d1", c: 1, p: queen}, {n: "e1", c: 0, p: king}, {n: "f1", c: 1, p: bishop}, {n: "g1", c: 0, p: knight}, {n: "h1", c: 1, p: rook}
   ],
   startPosition = [
      rook, knight, bishop, queen, king, bishop, knight, rook, 
      pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
      "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "",
      pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
      rook, knight, bishop, queen, king, bishop, knight, rook
   ]; // the starting position of the board for the pieces

function createBoard() { // inject into #gameboard
   startPosition.forEach( // Performs the specified function for each element in an array (callback)
      function(startPosition, i) {
         var square = document.createElement("div"); // Creates an instance of the element for the specified tag.
         square.classList.add("square"); // Allows for manipulation of element's class content attribute as a set of whitespace-separated tokens through a DOMTokenList object.
         square.innerHTML = startPosition;
         square.setAttribute("square-id", i); // Sets the value of element's first attribute whose qualified name is qualifiedName to value.
         var sq = i + 1; // actual square
         // 9-16, 25-32, 41-48, 57-64
         if (sq % 2 !== 0) {
            square.classList.add("white");
         }         
         else {
            square.classList.add("red");
         }
         gameboard.append(square);
      }
   )

};

// main
createBoard();
