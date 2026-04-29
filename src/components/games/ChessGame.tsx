import { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { playSound } from "../../lib/audio";
import { socket } from "../../lib/socket";

// Determine if we should make a random move or basic greedy capture
const makeBotMove = (game: Chess, level: string): string | null => {
  const possibleMoves = game.moves();
  if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0)
    return null;

  const levelIndex = [
    "Beginner",
    "Easy",
    "Intermediate",
    "Hard",
    "Advanced",
    "Expert",
    "Candidate",
    "Master",
    "Grandmaster",
    "Champion",
  ].indexOf(level);

  let chosenMove =
    possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

  if (levelIndex > 0) {
    const attackingMoves = possibleMoves.filter(
      (m) => m.includes("x") || m.includes("+"),
    );
    if (attackingMoves.length > 0 && Math.random() < levelIndex * 0.1) {
      chosenMove =
        attackingMoves[Math.floor(Math.random() * attackingMoves.length)];
    }
  }

  return chosenMove;
};

export default function ChessGame({
  mode,
  botLevel,
  roomId,
  playerColor,
  onGameOver,
}: {
  mode: "bot" | "online";
  botLevel: string;
  roomId?: string;
  playerColor?: "w" | "b";
  onGameOver: (result: string) => void;
}) {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());

  const makeMove = useCallback(
    (
      moveStr: string | { from: string; to: string; promotion?: string },
      isIncoming = false,
    ): boolean => {
      const gameCopy = new Chess(game.fen());
      try {
        const result = gameCopy.move(moveStr);
        if (result) {
          setGame(gameCopy);
          setFen(gameCopy.fen());
          playSound(result.captured ? "capture" : "move");

          if (mode === "online" && !isIncoming && roomId) {
            socket.emit("send_move", { roomId, move: moveStr });
          }

          if (gameCopy.isGameOver()) {
            if (gameCopy.isCheckmate()) onGameOver("Checkmate");
            else if (gameCopy.isDraw()) onGameOver("Draw");
            else onGameOver("Game Over");
            playSound("win");
          }
          return true;
        }
      } catch {
        return false; // Illegal move
      }
      return false;
    },
    [game, onGameOver, mode, roomId],
  );

  const onDrop = ({ sourceSquare, targetSquare, piece }: any) => {
    // Check if it's player's turn in online mode
    if (mode === "online" && game.turn() !== playerColor) return false;

    return makeMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece?.[1]?.toLowerCase() ?? "q", // default to queen
    });
  };

  useEffect(() => {
    if (mode === "bot" && game.turn() === "b" && !game.isGameOver()) {
      const timer = setTimeout(() => {
        const botMove = makeBotMove(game, botLevel);
        if (botMove) {
          makeMove(botMove);
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [fen, mode, game, botLevel, makeMove]);

  useEffect(() => {
    if (mode === "online") {
      const onReceiveMove = ({ move }: any) => {
        makeMove(move, true);
      };
      socket.on("receive_move", onReceiveMove);
      return () => {
        socket.off("receive_move", onReceiveMove);
      };
    }
  }, [mode, makeMove]);

  return (
    <div className="w-full max-w-[600px] mx-auto aspect-square">
      <Chessboard
        options={{
          position: fen,
          onPieceDrop: onDrop,
          boardOrientation: playerColor === "b" ? "black" : "white",
          darkSquareStyle: { backgroundColor: "#b58863" },
          lightSquareStyle: { backgroundColor: "#f0d9b5" }
        }}
      />
    </div>
  );
}
