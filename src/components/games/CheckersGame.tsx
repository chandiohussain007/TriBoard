import { useState, useEffect } from "react";
import GridBoard from "./GridBoard";
import { playSound } from "../../lib/audio";
import { socket } from "../../lib/socket";

type Piece = { type: "checker"; player: 1 | 2; isKing: boolean } | null;

const createInitialCheckersState = (): Piece[][] => {
  const board: Piece[][] = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 === 1)
        board[r][c] = { type: "checker", player: 2, isKing: false };
    }
  }
  for (let r = 5; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 === 1)
        board[r][c] = { type: "checker", player: 1, isKing: false };
    }
  }
  return board;
};

// Simplified Checkers Logic
const getValidCheckersMoves = (
  board: Piece[][],
  r: number,
  c: number,
  turn: 1 | 2,
): [number, number][] => {
  const piece = board[r][c];
  if (!piece || piece.player !== turn) return [];

  const moves: [number, number][] = [];
  const directions = piece.isKing
    ? [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ]
    : piece.player === 1
      ? [
          [-1, -1],
          [-1, 1],
        ]
      : [
          [1, -1],
          [1, 1],
        ];

  // Basic moves
  for (const [dr, dc] of directions) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && !board[nr][nc]) {
      moves.push([nr, nc]);
    }
  }

  // Jumps
  for (const [dr, dc] of directions) {
    const nr = r + dr;
    const nc = c + dc;
    const jr = nr + dr;
    const jc = nc + dc;
    if (jr >= 0 && jr < 8 && jc >= 0 && jc < 8) {
      const midPiece = board[nr][nc];
      if (midPiece && midPiece.player !== piece.player && !board[jr][jc]) {
        moves.push([jr, jc]); // This is an oversimplification. Doesn't force jumps or handle multi-jumps well.
      }
    }
  }
  return moves;
};

export default function CheckersGame({
  mode,
  playerColor,
  onGameOver,
}: {
  mode: "bot" | "online" | "local";
  playerColor: "w" | "b";
  onGameOver: (result: string) => void;
}) {
  const [board, setBoard] = useState(createInitialCheckersState());
  const [turn, setTurn] = useState<1 | 2>(1);
  const [selected, setSelected] = useState<[number, number] | null>(null);

  const validMoves = selected
    ? getValidCheckersMoves(board, selected[0], selected[1], turn)
    : [];

  const handleMove = (
    from: [number, number],
    to: [number, number]
  ) => {
    const newBoard = board.map((row) => [...row]);
    const piece = newBoard[from[0]][from[1]]!;

    let captured = false;
    if (Math.abs(from[0] - to[0]) === 2) {
      const midR = (from[0] + to[0]) / 2;
      const midC = (from[1] + to[1]) / 2;
      newBoard[midR][midC] = null;
      captured = true;
    }

    newBoard[to[0]][to[1]] = piece;
    newBoard[from[0]][from[1]] = null;

    if (piece.player === 1 && to[0] === 0) piece.isKing = true;
    if (piece.player === 2 && to[0] === 7) piece.isKing = true;

    playSound(captured ? "capture" : "move");
    setBoard(newBoard);
    setTurn(turn === 1 ? 2 : 1);
  };

  const onGridMove = (from: [number, number], to: [number, number]) => {
    handleMove(from, to);
  };

  // Bot move logic
  useEffect(() => {
    if (mode === "bot" && turn === 2) {
      const timer = setTimeout(() => {
        const possiblePieces = [];
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            if (board[r][c]?.player === 2) {
              const moves = getValidCheckersMoves(board, r, c, 2);
              if (moves.length > 0) {
                possiblePieces.push({ r, c, moves });
              }
            }
          }
        }

        if (possiblePieces.length > 0) {
          const rPieceIndex = Math.floor(Math.random() * possiblePieces.length);
          const chosen = possiblePieces[rPieceIndex];
          const rMoveIndex = Math.floor(Math.random() * chosen.moves.length);
          handleMove([chosen.r, chosen.c], chosen.moves[rMoveIndex]);
        } else {
          onGameOver("Checkers - Player 1 Wins");
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [turn, mode, board]);

  return (
    <div className="w-full max-w-[720px] mx-auto">
        <GridBoard
          rows={8}
          cols={8}
          gameState={board}
          onMove={onGridMove}
          selectedSquare={selected}
          setSelectedSquare={setSelected}
          validMoves={validMoves}
        />
    </div>
  );
}

