import { useState, useEffect, useCallback, useMemo } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { playSound } from "../../lib/audio";
import { Lightbulb, RotateCcw, Info } from "lucide-react";

// Determine if we should make a random move or basic greedy capture
const makeBotMove = (game: Chess, level: string): string | null => {
  const possibleMoves = game.moves();
  if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0)
    return null;

  const levelLower = level.toLowerCase();
  
  // High level bots (Magnus, Garry)
  if (levelLower.includes("magnus") || levelLower.includes("garry") || levelLower.includes("champion") || levelLower.includes("grandmaster")) {
     // Try to find captures or checks first
     const strongMoves = possibleMoves.filter(m => m.includes("x") || m.includes("+") || m.includes("#"));
     if (strongMoves.length > 0) return strongMoves[Math.floor(Math.random() * strongMoves.length)];
  }

  // Intermediate levels
  if (levelLower.includes("martin") || levelLower.includes("intermediate") || levelLower.includes("expert")) {
     const captures = possibleMoves.filter(m => m.includes("x"));
     if (captures.length > 0 && Math.random() > 0.3) return captures[Math.floor(Math.random() * captures.length)];
  }

  // Default to random move
  return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
};

export default function ChessGame({
  playerColor,
  botLevel,
  mode,
  onGameOver,
}: {
  playerColor: "w" | "b";
  botLevel: string;
  mode: "bot" | "online" | "local";
  onGameOver: (result: string) => void;
}) {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [hint, setHint] = useState<string | null>(null);
  const [optionSquares, setOptionSquares] = useState({});

  const makeMove = useCallback(
    (moveStr: string | { from: string; to: string; promotion?: string }): boolean => {
      try {
        const result = game.move(moveStr);
        if (result) {
          setFen(game.fen());
          setHint(null);
          setOptionSquares({});
          playSound(result.captured ? "capture" : "move");

          if (game.isGameOver()) {
            if (game.isCheckmate()) onGameOver("Checkmate");
            else if (game.isDraw()) onGameOver("Draw");
            else onGameOver("Game Over");
            playSound("win");
          }
          return true;
        }
      } catch {
        return false;
      }
      return false;
    },
    [game, onGameOver],
  );

  function onDrop({ sourceSquare, targetSquare }: any) {
    if (mode !== "local" && game.turn() !== playerColor) return false;

    const move = makeMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    return move;
  }

  function onSquareClick({ square }: any) {
    if (mode !== "local" && game.turn() !== playerColor) return;
    
    // Show legal moves
    const moves = game.moves({
      square: square as any,
      verbose: true,
    });
    if (moves.length === 0) {
      setOptionSquares({});
      return;
    }

    const newSquares = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to as any) && game.get(move.to as any).color !== game.get(square as any).color
            ? "radial-gradient(circle, rgba(255,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(212, 175, 55, 0.3)",
    };
    setOptionSquares(newSquares);
  }

  const getHint = () => {
    const moves = game.moves();
    if (moves.length > 0) {
      const best = moves.find(m => m.includes("#")) || moves.find(m => m.includes("+")) || moves.find(m => m.includes("x")) || moves[0];
      setHint(best);
      setTimeout(() => setHint(null), 3000);
    }
  };

  useEffect(() => {
    if (mode === "bot" && game.turn() !== playerColor && !game.isGameOver()) {
      const timer = setTimeout(() => {
        const botMove = makeBotMove(game, botLevel);
        if (botMove) {
          makeMove(botMove);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [fen, game, botLevel, playerColor, makeMove, mode]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-[640px]">
      <div className="w-full aspect-square shadow-2xl border-4 border-white/5 rounded-sm overflow-hidden">
        <Chessboard
          options={{
            position: fen,
            onPieceDrop: onDrop,
            onSquareClick: onSquareClick,
            boardOrientation: playerColor === "b" ? "black" : "white",
            darkSquareStyle: { backgroundColor: "#e2e8f0" },
            lightSquareStyle: { backgroundColor: "#f8fafc" },
            squareStyles: optionSquares,
          }}
        />
      </div>

      <div className="flex gap-4 w-full">
        <button
          onClick={getHint}
          className="flex-1 flex items-center justify-center gap-3 bg-white inner-glow border border-zinc-100 text-zinc-900 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-all shadow-sm"
        >
          <Lightbulb size={18} className="text-zinc-400" />
          {hint ? `Hint: ${hint}` : "Tactical Hint"}
        </button>
        <button
          onClick={() => {
            const newGame = new Chess();
            setGame(newGame);
            setFen(newGame.fen());
            setOptionSquares({});
            setHint(null);
          }}
          className="flex items-center justify-center gap-3 bg-white inner-glow border border-zinc-100 text-zinc-400 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-zinc-900 hover:bg-zinc-50 transition-all shadow-sm"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      <div className="w-full p-6 bg-white/40 border border-white/60 rounded-3xl flex items-start gap-4 inner-glow shadow-sm">
         <Info size={18} className="text-zinc-300 mt-0.5 shrink-0" />
         <p className="text-[10px] text-zinc-400 leading-relaxed uppercase tracking-wider font-black">
            Engage nodes for legal maneuvers. Use hint protocols for high-key tactical optimization.
         </p>
      </div>
    </div>
  );
}

