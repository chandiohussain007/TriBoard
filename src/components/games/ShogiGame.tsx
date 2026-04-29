import { useState, useEffect } from "react";
import GridBoard from "./GridBoard";
import { playSound } from "../../lib/audio";
import { socket } from "../../lib/socket";

type Piece = { type: "shogi"; symbol: string; player: 1 | 2 } | null;

// Very simplified Shogi Board
const createInitialShogiState = (): Piece[][] => {
  const board: Piece[][] = Array(9)
    .fill(null)
    .map(() => Array(9).fill(null));

  // Player 2 (Top)
  board[0] = ["香", "桂", "銀", "金", "王", "金", "銀", "桂", "香"].map(
    (s) => ({ type: "shogi", symbol: s, player: 2 }),
  );
  board[1][1] = { type: "shogi", symbol: "飛", player: 2 };
  board[1][7] = { type: "shogi", symbol: "角", player: 2 };
  for (let i = 0; i < 9; i++)
    board[2][i] = { type: "shogi", symbol: "歩", player: 2 };

  // Player 1 (Bottom)
  for (let i = 0; i < 9; i++)
    board[6][i] = { type: "shogi", symbol: "歩", player: 1 };
  board[7][1] = { type: "shogi", symbol: "角", player: 1 };
  board[7][7] = { type: "shogi", symbol: "飛", player: 1 };
  board[8] = ["香", "桂", "銀", "金", "玉", "金", "銀", "桂", "香"].map(
    (s) => ({ type: "shogi", symbol: s, player: 1 }),
  );

  return board;
};

// Extremely basic valid moves matching checking only forward for pawns
const getValidShogiMoves = (
  board: Piece[][],
  r: number,
  c: number,
  turn: 1 | 2,
): [number, number][] => {
  const piece = board[r][c];
  if (!piece || piece.player !== turn) return [];
  const moves: [number, number][] = [];

  const dr = piece.player === 1 ? -1 : 1;

  // Simplification: only pawns, kings, golds move for this prototype
  if (piece.symbol === "歩") {
    const nr = r + dr;
    if (
      nr >= 0 &&
      nr < 9 &&
      (!board[nr][c] || board[nr][c]!.player !== piece.player)
    ) {
      moves.push([nr, c]);
    }
  } else {
    // Fallback generic 1-step move in any direction
    for (let rd = -1; rd <= 1; rd++) {
      for (let cd = -1; cd <= 1; cd++) {
        if (rd === 0 && cd === 0) continue;
        const nr = r + rd;
        const nc = c + cd;
        if (
          nr >= 0 &&
          nr < 9 &&
          nc >= 0 &&
          nc < 9 &&
          (!board[nr][nc] || board[nr][nc]!.player !== piece.player)
        ) {
          moves.push([nr, nc]);
        }
      }
    }
  }
  return moves;
};

export default function ShogiGame({
  mode,
  playerColor,
  onGameOver,
}: {
  mode: "bot" | "online" | "local";
  playerColor: "w" | "b";
  onGameOver: (result: string) => void;
}) {
  const [board, setBoard] = useState(createInitialShogiState());
  const [turn, setTurn] = useState<1 | 2>(1);
  const [selected, setSelected] = useState<[number, number] | null>(null);

  const validMoves = selected
    ? getValidShogiMoves(board, selected[0], selected[1], turn)
    : [];

  const handleMove = (
    from: [number, number],
    to: [number, number]
  ) => {
    const newBoard = board.map((row) => [...row]);
    const piece = newBoard[from[0]][from[1]]!;
    const captured = newBoard[to[0]][to[1]];

    newBoard[to[0]][to[1]] = piece;
    newBoard[from[0]][from[1]] = null;

    playSound(captured ? "capture" : "move");

    if (captured && (captured.symbol === "王" || captured.symbol === "玉")) {
      onGameOver(`Shogi - Player ${turn} Wins`);
      playSound("win");
    }

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
        for (let r = 0; r < 9; r++) {
          for (let c = 0; c < 9; c++) {
            if (board[r][c]?.player === 2) {
              const moves = getValidShogiMoves(board, r, c, 2);
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
          onGameOver("Shogi - Player 1 Wins");
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [turn, mode, board]);

  return (
    <div className="w-full max-w-[720px] mx-auto">
        <GridBoard
          rows={9}
          cols={9}
          gameState={board}
          onMove={onGridMove}
          selectedSquare={selected}
          setSelectedSquare={setSelected}
          validMoves={validMoves}
          boardType="shogi"
        />
    </div>
  );
}

