import { useState, useEffect } from "react";
import {
  useParams,
  useSearchParams,
  Link,
  useNavigate,
} from "react-router-dom";
import { ArrowLeft, Loader2, Bot, Swords, Trophy, User, Zap, Users } from "lucide-react";
import ChessGame from "../components/games/ChessGame";
import CheckersGame from "../components/games/CheckersGame";
import ShogiGame from "../components/games/ShogiGame";
import { useSettings } from "../store/useSettings";
import { getRandomBot, BotProfile } from "../lib/botProfiles";

export default function GameView() {
  const { gameType } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initMode = (searchParams.get("mode") as "bot" | "online" | "local") || "bot";
  const { botLevel } = useSettings();

  const [actualMode, setActualMode] = useState<"bot" | "online" | "local">(initMode);
  const [matchStatus, setMatchStatus] = useState<
    "idle" | "searching" | "found" | "failed"
  >(initMode === "local" ? "found" : "idle");
  const [gameOver, setGameOver] = useState<string | null>(null);
  const [opponent, setOpponent] = useState<BotProfile | null>(null);
  const [playerColor, setPlayerColor] = useState<"w" | "b">("w");

  useEffect(() => {
    if (initMode === "online") {
      setMatchStatus("searching");
      
      const searchTimer = setTimeout(() => {
        const bot = getRandomBot();
        setOpponent(bot);
        setPlayerColor(Math.random() > 0.5 ? "w" : "b");
        setMatchStatus("found");
        setActualMode("bot");
      }, 2000);

      return () => clearTimeout(searchTimer);
    } else if (initMode === "local") {
       setActualMode("local");
       setMatchStatus("found");
    } else {
      setActualMode("bot");
      setOpponent(null);
    }
  }, [initMode, gameType]);

  const handleGameOver = (result: string) => {
    setGameOver(result);
  };

  const commonProps = {
    mode: actualMode,
    botLevel: opponent ? opponent.name : botLevel,
    playerColor,
    onGameOver: handleGameOver,
  };

  return (
    <div className="min-h-screen bg-bg p-8 flex flex-col relative overflow-hidden">
      <header className="max-w-6xl w-full mx-auto flex justify-between items-center mb-12 pb-6 border-b border-zinc-100 relative z-10">
        <Link
          to="/"
          className="flex items-center gap-3 px-6 py-2.5 bg-white/50 text-zinc-400 hover:text-zinc-900 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] border border-zinc-100 hover:border-zinc-300 transition-all inner-glow shadow-sm"
        >
          <ArrowLeft size={14} /> Abort Operation
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-6 py-2.5 bg-zinc-900 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-lg">
            {initMode === "online" ? (
              <Swords size={14} className="text-zinc-400" />
            ) : initMode === "local" ? (
              <Users size={14} className="text-zinc-400" />
            ) : (
              <Bot size={14} className="text-zinc-400" />
            )}
            <span>{gameType}</span>
            <span className="text-white/20">|</span>
            <span className="text-white/60 font-medium">
              {initMode === "online" ? "Elite Ranked" : initMode === "local" ? "Local Combat" : `Sim: ${botLevel}`}
            </span>
          </div>
        </div>
      </header>

      {matchStatus === "searching" && (
        <div className="flex-1 flex flex-col items-center justify-center relative z-10">
          <div className="relative mb-12">
            <div className="absolute inset-0 animate-ping bg-zinc-100 rounded-full scale-150 opacity-50"></div>
            <div className="relative w-32 h-32 bg-white inner-glow border border-zinc-50 rounded-3xl flex items-center justify-center shadow-xl">
              <Loader2 className="animate-spin text-zinc-900" size={48} />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-zinc-900 mb-4 tracking-tighter">Locating Node...</h2>
          <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-300 font-black">Scanning Global Distribution Network</p>
        </div>
      )}

      {matchStatus === "found" && (
        <main className="flex-1 max-w-7xl w-full mx-auto grid lg:grid-cols-[1fr_auto_1fr] items-center justify-center gap-16 relative z-10">
          {/* Player Info Left */}
          <div className="hidden lg:flex flex-col items-end gap-8 order-1">
             <div className="text-right">
                <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-2 block font-black">{initMode === "local" ? "Player One" : "Authorized User"}</span>
                <h3 className="text-4xl font-bold text-zinc-900 tracking-tight">{initMode === "local" ? "Commander A" : "Lead Strategist"}</h3>
                <div className="flex items-center justify-end gap-2 mt-3">
                   <Trophy size={16} className="text-zinc-300" />
                   <span className="text-xs text-zinc-400 tracking-widest font-black uppercase">{initMode === "local" ? "Home Territory" : "Elite Status"}</span>
                </div>
             </div>
             <div className="w-28 h-28 bg-white inner-glow border border-zinc-100 rounded-3xl flex items-center justify-center shadow-sm">
                <User size={56} className="text-zinc-100" />
             </div>
          </div>

          {/* Game Board Center */}
          <div className="flex flex-col items-center order-2">
            {gameOver && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-2xl">
                <div className="bg-white p-16 rounded-3xl border border-zinc-100 shadow-[0_32px_64px_rgba(0,0,0,0.08)] text-center max-w-md w-full inner-glow">
                  <div className="w-24 h-24 bg-zinc-50 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-zinc-100 shadow-sm">
                    <Trophy size={48} className="text-zinc-900" />
                  </div>
                  <h2 className="text-5xl font-bold text-zinc-900 mb-4 tracking-tighter">Terminated</h2>
                  <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-400 mb-12 font-black">{gameOver}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => window.location.reload()}
                      className="btn-primary py-4 text-[11px] rounded-2xl"
                    >
                      Restart
                    </button>
                    <button
                      onClick={() => navigate("/")}
                      className="btn-outline py-4 text-[11px] rounded-2xl bg-zinc-50"
                    >
                      Exit Hub
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="relative glass-card p-6 rounded-3xl inner-glow border border-white/60">
               {gameType === "chess" && <ChessGame {...commonProps} />}
               {gameType === "checkers" && <CheckersGame {...commonProps} />}
               {gameType === "shogi" && <ShogiGame {...commonProps} />}
            </div>
            
            <div className="mt-10 flex items-center gap-5 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300">
               <span className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${playerColor === 'w' ? 'bg-zinc-200 border border-zinc-300' : 'bg-zinc-800'}`}></div>
                  {playerColor === "w" ? "White" : "Black"} Side
               </span>
               <span className="w-1.5 h-1.5 rounded-full bg-zinc-100"></span>
               <span>{initMode === "online" ? "Ranked Session" : initMode === "local" ? "Multiplayer Protocol" : "Training Session"}</span>
            </div>
          </div>

          {/* Opponent Info Right */}
          <div className="hidden lg:flex flex-col items-start gap-8 order-3">
             <div className="text-left">
                <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-2 block font-black">{initMode === "local" ? "Player Two" : "Opponent Node"}</span>
                <h3 className="text-4xl font-bold text-zinc-900 tracking-tight">
                  {initMode === "local" ? "Commander B" : (opponent?.name || "Neural Bot")}
                </h3>
                <div className="flex items-center justify-start gap-2 mt-3">
                   {initMode === "local" ? <Users size={16} className="text-zinc-300" /> : <Zap size={16} className="text-zinc-300" />}
                   <span className="text-xs text-zinc-400 tracking-widest font-black uppercase">
                     {initMode === "local" ? "Direct Engagement" : `Lv. ${opponent?.rating || 1000}`}
                   </span>
                </div>
             </div>
             <div className="w-28 h-28 bg-white inner-glow border border-zinc-100 rounded-3xl flex items-center justify-center overflow-hidden shadow-sm">
                {initMode === "local" ? (
                  <User size={56} className="text-zinc-100" />
                ) : (
                  <>
                    <div 
                      className="w-full h-full opacity-10" 
                      style={{ backgroundColor: opponent?.avatarColor || "#000" }}
                    ></div>
                    <Bot size={56} className="absolute text-zinc-200" />
                  </>
                )}
             </div>
             <p className="text-[11px] text-zinc-400 italic max-w-[200px] leading-relaxed font-medium">
                {initMode === "local" ? "Engage in local tactical exchange without neural mediation." : `"${opponent?.description}"`}
             </p>
          </div>
        </main>
      )}

      {matchStatus === "idle" && (
         <main className="flex-1 max-w-5xl w-full mx-auto flex flex-col items-center justify-center relative z-10">
            <div className="glass-card p-6 rounded-3xl inner-glow border border-white/60">
               {gameType === "chess" && <ChessGame {...commonProps} />}
               {gameType === "checkers" && <CheckersGame {...commonProps} />}
               {gameType === "shogi" && <ShogiGame {...commonProps} />}
            </div>
         </main>
      )}
    </div>
  );
}



