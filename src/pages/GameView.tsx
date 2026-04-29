import { useState, useEffect } from "react";
import {
  useParams,
  useSearchParams,
  Link,
  useNavigate,
} from "react-router-dom";
import { ArrowLeft, Loader2, Bot, Swords } from "lucide-react";
import ChessGame from "../components/games/ChessGame";
import CheckersGame from "../components/games/CheckersGame";
import ShogiGame from "../components/games/ShogiGame";
import { useSettings } from "../store/useSettings";
import { socket } from "../lib/socket";

export default function GameView() {
  const { gameType } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initMode = (searchParams.get("mode") as "bot" | "online") || "bot";
  const { botLevel } = useSettings();

  const [actualMode, setActualMode] = useState<"bot" | "online">(initMode);
  const [matchStatus, setMatchStatus] = useState<
    "idle" | "searching" | "found" | "failed"
  >("idle");
  const [gameOver, setGameOver] = useState<string | null>(null);

  const [roomId, setRoomId] = useState<string>("");
  const [playerColor, setPlayerColor] = useState<"w" | "b">("w");

  useEffect(() => {
    if (initMode === "online") {
      socket.connect();
      setMatchStatus("searching");
      socket.emit("find_match", { gameType });

      const timeout = setTimeout(() => {
        // Fallback to bot after 5 seconds if no match
        if (matchStatus === "searching") {
          socket.emit("cancel_match");
          setMatchStatus("failed");
          setTimeout(() => {
            setActualMode("bot");
            setMatchStatus("idle"); // Clear the status so it plays like a normal bot match
          }, 2000); // show "falling back to bot" for 2s
        }
      }, 5000);

      socket.on("match_found", (data) => {
        setMatchStatus("found");
        setRoomId(data.roomId);
        setPlayerColor(data.players[socket.id]);
        clearTimeout(timeout);
      });

      socket.on("opponent_disconnected", () => {
        setGameOver("Opponent Disconnected");
      });

      return () => {
        clearTimeout(timeout);
        socket.emit("cancel_match");
        socket.off("match_found");
        socket.off("opponent_disconnected");
        socket.disconnect();
      };
    } else {
      setActualMode("bot");
    }
  }, [initMode, gameType]);

  const handleGameOver = (result: string) => {
    setGameOver(result);
  };

  const commonProps = {
    mode: actualMode,
    botLevel,
    roomId,
    playerColor,
    onGameOver: handleGameOver,
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] p-8 flex flex-col relative overflow-hidden">
      <header className="max-w-5xl w-full mx-auto flex justify-between items-center mb-8 pb-6 border-b border-white/10 relative z-10">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white/70 hover:text-white rounded-sm text-[10px] font-bold uppercase tracking-widest border border-white/10 hover:border-white/30 transition-all"
        >
          <ArrowLeft size={14} /> Terminate
        </Link>
        <div className="flex items-center gap-3 px-5 py-2.5 bg-[#161616] rounded-sm border border-[#d4af37]/30 text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(212,175,55,0.05)]">
          {actualMode === "bot" ? (
            <Bot size={14} className="text-[#d4af37]" />
          ) : (
            <Swords size={14} className="text-[#d4af37]" />
          )}
          <span className="text-white">{gameType}</span>
          <span className="text-white/20">|</span>
          <span className="text-white/60">
            {actualMode === "bot" ? `Target: ${botLevel}` : "Ranked Match"}
          </span>
          {actualMode === "online" && matchStatus === "found" && (
            <span
              className={`ml-2 w-2.5 h-2.5 rounded-full ${playerColor === "w" ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" : "bg-[#111] border border-white/30"}`}
              title={`You play as ${playerColor === "w" ? "White" : "Black"}`}
            />
          )}
        </div>
      </header>

      {matchStatus === "searching" && (
        <div className="flex-1 flex flex-col items-center justify-center relative z-10">
          <Loader2 className="animate-spin text-[#d4af37] mb-6" size={40} />
          <h2 className="text-2xl font-serif text-white mb-2">Acquiring Target...</h2>
          <p className="text-[10px] uppercase tracking-widest text-[#d4af37]">
            Will fallback to Bot shortly.
          </p>
        </div>
      )}

      {matchStatus === "failed" && (
        <div className="flex-1 flex flex-col items-center justify-center relative z-10">
          <Bot className="text-[#d4af37] mb-6" size={40} />
          <h2 className="text-2xl font-serif text-white mb-2">No players available</h2>
          <p className="text-[10px] uppercase tracking-widest text-white/50">Engaging Bot Protocol...</p>
        </div>
      )}

      {(matchStatus === "idle" || matchStatus === "found") && (
        <main className="flex-1 max-w-5xl w-full mx-auto flex flex-col items-center justify-center relative z-10">
          {gameOver && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md rounded-sm">
              <div className="bg-[#161616] p-10 border border-[#d4af37]/30 shadow-[0_0_50px_rgba(212,175,55,0.15)] text-center max-w-md w-full">
                <h2 className="text-4xl font-serif italic text-white mb-2">Match Concluded</h2>
                <p className="text-xs uppercase tracking-widest text-[#d4af37] mb-10">{gameOver}</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="flex-1 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#d4af37] transition-all"
                  >
                    Rematch
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="flex-1 py-3 bg-transparent border border-white/20 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/5 transition-all"
                  >
                    Return
                  </button>
                </div>
              </div>
            </div>
          )}

          {gameType === "chess" && <ChessGame {...commonProps} />}
          {gameType === "checkers" && <CheckersGame {...commonProps} />}
          {gameType === "shogi" && <ShogiGame {...commonProps} />}
        </main>
      )}
    </div>
  );
}
