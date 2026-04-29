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
      className="w-full aspect-square border-8 border-white shadow-[0_24px_64px_rgba(0,0,0,0.06)] overflow-hidden relative rounded-2xl inner-glow"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const isDark = boardType === "checker" ? (r + c) % 2 === 1 : false;
          const bgColor =
            isDark || boardType === "shogi"
              ? "#f8fafc" // Light silver/white
              : "#ffffff";

          const isSelected =
            selectedSquare?.[0] === r && selectedSquare?.[1] === c;
          const isValidMove = validMoves.some((m) => m[0] === r && m[1] === c);
          const piece = gameState[r][c];

          return (
            <div
              key={`${r}-${c}`}
              onClick={() => handleSquareClick(r, c)}
              className="relative flex items-center justify-center cursor-pointer transition-all duration-300"
              style={{
                backgroundColor: boardType === "shogi" ? "#fdfcf0" : bgColor,
                border: "1px solid #f1f5f9",
              }}
            >
              {isSelected && (
                <div className="absolute inset-0 bg-zinc-900/5 backdrop-blur-[2px] z-10"></div>
              )}
              {isValidMove && !piece && (
                <div className="absolute w-1/4 h-1/4 bg-zinc-900/10 rounded-full z-10"></div>
              )}
              {isValidMove && piece && (
                <div className="absolute inset-0 border-4 border-zinc-900/10 rounded-full z-20"></div>
              )}

              {piece && (
                <div className="relative z-20 w-[75%] h-[75%] transition-transform duration-500 hover:scale-105">
                  {piece.type === "checker" ? (
                    <div
                      className={`w-full h-full rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-zinc-100 ${piece.player === 1 ? "bg-zinc-800" : "bg-white"} flex items-center justify-center inner-glow`}
                    >
                      {piece.isKing && (
                        <div className={`w-1/2 h-1/2 rounded-full border ${piece.player === 1 ? "border-white/20" : "border-zinc-200"}`}></div>
                      )}
                    </div>
                  ) : (
                    <div
                      className={`w-full h-full flex flex-col items-center justify-center font-bold text-lg clip-path-shogi-piece bg-white border border-zinc-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-zinc-800 ${piece.player === 2 ? "rotate-180" : ""} inner-glow`}
                    >
                      <span className="opacity-80">{piece.symbol}</span>
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

