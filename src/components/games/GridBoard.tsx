import { useState, useCallback, useEffect } from "react";
import { playSound } from "../../lib/audio";

// Generic Board Grid for Checkers and Shogi
export default function GridBoard({
  rows,
  cols,
  gameState,
  onMove,
  lightSquareColor = "#f0d9b5",
  darkSquareColor = "#b58863",
  boardType = "checker", // 'checker' or 'shogi'
  selectedSquare,
  setSelectedSquare,
  validMoves = [],
}: {
  rows: number;
  cols: number;
  gameState: any[][]; // 2D array of piece objects or null
  onMove: (from: [number, number], to: [number, number]) => void;
  lightSquareColor?: string;
  darkSquareColor?: string;
  boardType?: "checker" | "shogi";
  selectedSquare: [number, number] | null;
  setSelectedSquare: (sq: [number, number] | null) => void;
  validMoves?: [number, number][];
}) {
  const handleSquareClick = (r: number, c: number) => {
    if (selectedSquare) {
      // Check if clicking same square to deselect
      if (selectedSquare[0] === r && selectedSquare[1] === c) {
        setSelectedSquare(null);
        return;
      }
      // Check if clicking valid move square
      const isValid = validMoves.some((m) => m[0] === r && m[1] === c);
      if (isValid) {
        onMove(selectedSquare, [r, c]);
        setSelectedSquare(null);
      } else {
        // If clicking another piece of mine, select it
        if (gameState[r][c]) {
          setSelectedSquare([r, c]);
        } else {
          setSelectedSquare(null);
        }
      }
    } else {
      if (gameState[r][c]) {
        // basic check, deeper logic handles if it's my piece
        setSelectedSquare([r, c]);
      }
    }
  };

  return (
    <div
      className="w-full aspect-square border-4 border-stone-800 shadow-xl overflow-hidden relative"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const isDark = boardType === "checker" ? (r + c) % 2 === 1 : false; // Shogi has uniform squares
          const bgColor =
            isDark || boardType === "shogi"
              ? darkSquareColor
              : lightSquareColor;

          const isSelected =
            selectedSquare?.[0] === r && selectedSquare?.[1] === c;
          const isValidMove = validMoves.some((m) => m[0] === r && m[1] === c);
          const piece = gameState[r][c];

          return (
            <div
              key={`${r}-${c}`}
              onClick={() => handleSquareClick(r, c)}
              className="relative flex items-center justify-center cursor-pointer transition-colors"
              style={{
                backgroundColor: boardType === "shogi" ? "#e3c16f" : bgColor,
                border: boardType === "shogi" ? "1px solid #1c1917" : "none",
              }}
            >
              {isSelected && (
                <div className="absolute inset-0 bg-yellow-400 opacity-40"></div>
              )}
              {isValidMove && !piece && (
                <div className="absolute w-1/3 h-1/3 bg-black opacity-20 rounded-full"></div>
              )}
              {isValidMove && piece && (
                <div className="absolute inset-0 border-4 border-red-500 rounded-full relative z-20"></div>
              )}

              {piece && (
                <div className="relative z-10 w-[80%] h-[80%]">
                  {piece.type === "checker" ? (
                    <div
                      className={`w-full h-full rounded-full shadow-md border-2 border-black/20 ${piece.player === 1 ? "bg-zinc-800" : "bg-red-600"} flex items-center justify-center`}
                    >
                      {piece.isKing && (
                        <div className="w-1/2 h-1/2 rounded-full border border-white/50"></div>
                      )}
                    </div>
                  ) : (
                    // Shogi Piece Placeholder
                    <div
                      className={`w-full h-full flex flex-col items-center justify-center font-bold text-xl clip-path-shogi-piece bg-[#edd5a1] border border-stone-600 shadow-sm ${piece.player === 2 ? "rotate-180" : ""}`}
                      style={{
                        clipPath:
                          "polygon(50% 0%, 100% 20%, 90% 100%, 10% 100%, 0% 20%)",
                      }}
                    >
                      {piece.symbol}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        }),
      )}
    </div>
  );
}
