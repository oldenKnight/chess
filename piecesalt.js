function Piece(nomen, value, limited, gps, diag, x, y) { // the last three are optional to specify
   this.x = x || true; // moves on x? 
   this.y = y || true; // moves on y?
   this.diag = diag || true; // diagonal?
   this.limited = limited || false; // limited squares?
   // current loc
   this.gps = gps || "";
   this.s = nomen; // string
   this.value = 0;
   this.move = function(finis, initium, capture, quidSquareId, piecediv, myColor, squareId) {
      capture = capture || false;
      if (this.s === "king") {
         return kingMove(finis, initium, piecediv);
      } else if (this.s === "queen") {
         return queenMove(quidSquareId, finis, initium, piecediv, myColor, squareId);
      } else if (this.s === "rook") {
         return rookMove(finis, initium, piecediv, myColor);
      } else if (this.s === "knight") {
         return knightMove(finis, initium, myColor);
      } else if (this.s === "bishop") {
         return bishopMove(quidSquareId, finis, initium, piecediv, myColor, squareId);
      } else if (this.s === "pawn") {
         return pawnMove(capture, finis, initium, myColor);
      }
   };
   this.attacks = [];
   this.divGet = function(color) {
      return (window[this.s][color[0]]);
   };

   // king cannot be captured; pawn captures diagonally
}

var king = new Piece("king", 0, true);
var queen = new Piece("queen", 9);
var bishop = new Piece("bishop", 3, false, "", true, false, false);
var knight = new Piece("knight", 3, true, "", false, false, false);
var rook = new Piece("rook", 5, false, "", false);
var pawn = new Piece("pawn", 1, true, "", false, true, false);

// red pieces
king.r = '<div class="piece" id= "king"><img src="rking1.svg" alt="Red King" id="red" class="chess-piece" width="70px" height="85px"></div>';
queen.r = '<div class="piece" id= "queen"><img src="rqueen.svg" alt="Red Queen" id="red" class="chess-piece" width="70px" height="85px"></div>';
bishop.r = '<div class="piece" id= "bishop"><img src="rbishop.svg" alt="Red Bishop" id="red" class="chess-piece" width="70px" height="90px"></div>';
knight.r = '<div class="piece" id= "knight"><img src="rknight.svg" alt="Red Knight" id="red" class="chess-piece" width="60px" height="90px"></div>';
rook.r = '<div class="piece" id= "rook"><img src="rrook.svg" alt="Red Rook" id="red" class="chess-piece" width="90px" height="90px"></div>';
pawn.r = '<div class="piece" id= "pawn"><img src="rpawn.svg" alt="Red Pawn" id="red" class="chess-piece" width="60px" height="80px"></div>';

// white pieces
king.w = '<div class="piece" id= "king"><img src="wking1.svg" alt="White King" id="white" class="chess-piece" width="70px" height="90px"></div>';
queen.w = '<div class="piece" id= "queen"><img src="wqueen.svg" alt="White Queen" id="white" class="chess-piece" width="50px" height="90px"></div>';
bishop.w = '<div class="piece" id= "bishop"><img src="wbishop.svg" alt="White Bishop" id="white" class="chess-piece" width="70px" height="90px"></div>';
knight.w = '<div class="piece" id= "knight"><img src="wknight.svg" alt="White Knight" id="white" class="chess-piece" width="60px" height="90px"></div>';
rook.w = '<div class="piece" id= "rook"><img src="wrook.svg" alt="White Rook" id="white" class="chess-piece" width="90px" height="90px"></div>';
pawn.w = '<div class="piece" id= "pawn"><img src="wpawn.svg" alt="White Pawn" id="white" class="chess-piece" width="60px" height="80px"></div>';
