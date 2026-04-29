import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, ChevronDown, ChevronRight, Zap, Target, Shield, Trophy } from "lucide-react";

export default function LearningView() {
  const { gameType } = useParams();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const lessons = {
    chess: [
      {
        title: "Tactical Maneuvers",
        desc: "The foundation of board dominance.",
        content: "Pawns move forward but capture diagonally. Knights move in an 'L' shape. Bishops move diagonally, Rooks strictly horizontally/vertically. Queens can move in any direction, and Kings may only shift one square at a time."
      },
      { title: "Material Acquisition", desc: "Executing strategic captures.", content: "To capture, move your piece to the square occupied by an opponent's piece. The captured piece is permanently removed from the board, giving you a material advantage." },
      {
        title: "Defensive Protocols",
        desc: "Castling and King safety.",
        content: "Castling allows you to move the King two squares toward a Rook on its original square, then immediately jumping the Rook to the other side. You cannot castle out of, through, or into check."
      },
      { title: "Terminal Sequence", desc: "Check & Checkmate mechanics.", content: "A check is a direct attack on an opponent's King, forcing them to respond immediately. A checkmate happens when the king is in check and no legal response can save it – ending the game." },
    ],
    shogi: [
      { title: "Regional Strategy", desc: "Basic movements of Japanese chess.", content: "Promoted pieces gain the movements of a Gold General. Pawns and Lances only move forward, requiring a promotion to retreat." },
      {
        title: "Field Upgrade",
        desc: "The Promotion mechanic.",
        content: "When moving into the farthest three ranks of the opponent's territory, pieces like Pawn, Lance, Knight, Silver, Rook, and Bishop flip to become stronger versions of themselves."
      },
      {
        title: "Tactical Redeployment",
        desc: "The core mechanic of piece drops.",
        content: "Instead of moving a piece on the board, you can take a captured enemy piece from your 'stand' and place it almost anywhere on the board as your own piece. This keeps the game permanently dynamic."
      },
    ],
    checkers: [
      { title: "Linear Combat", desc: "Diagonal forward engagement.", content: "Standard checkers may only step diagonally forward on the dark squares. They cannot move straight or horizontally." },
      { title: "Aggressive Overlap", desc: "Jumping and elimination.", content: "To capture an opponent, you 'jump' diagonally over their piece into an empty square directly behind it. Captures are mandatory if available, which can be used to set traps." },
      {
        title: "Sovereign Status",
        desc: "King rules and backward mobility.",
        content: "When a standard piece reaches the furthest row from the player, it is crowned a King. A King gains the powerful ability to move and capture backwards as well as forwards."
      },
    ],
  };

  const courseData = lessons[gameType as keyof typeof lessons] || [];

  return (
    <div className="min-h-screen bg-bg p-8 flex flex-col relative overflow-hidden">
      <header className="max-w-4xl mx-auto w-full flex justify-between items-center mb-16 pb-6 border-b border-zinc-100 relative z-10">
        <Link
          to="/"
          className="flex items-center gap-3 px-6 py-2.5 bg-white/50 text-zinc-400 hover:text-zinc-900 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] border border-zinc-100 hover:border-zinc-300 transition-all inner-glow shadow-sm"
        >
          <ArrowLeft size={14} /> Back to Control
        </Link>
      </header>

      <main className="max-w-4xl mx-auto w-full relative z-10">
        <div className="glass-card rounded-3xl p-20 border border-white/60 mb-16 text-center relative overflow-hidden inner-glow">
          <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent z-0"></div>
          <BookOpen size={64} className="mx-auto mb-10 text-zinc-900 relative z-10" />
          <h1 className="text-6xl font-bold mb-6 capitalize text-zinc-900 relative z-10 tracking-tighter">
            {gameType} <span className="text-zinc-300 font-light italic">Documentation</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-400 relative z-10 font-black">
            Classified Strategy Module - Level 4 Access
          </p>
        </div>

        <div className="space-y-8 mb-20">
          {courseData.map((lesson, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="bg-white/40 p-10 rounded-3xl border border-white/60 flex flex-col group cursor-pointer hover:bg-white/60 transition-all duration-700 inner-glow shadow-sm"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-8">
                    <div className="w-14 h-14 bg-white inner-glow border border-zinc-50 rounded-2xl flex items-center justify-center text-zinc-900 font-bold text-2xl group-hover:bg-zinc-900 group-hover:text-white transition-all shadow-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-zinc-900 mb-2 group-hover:text-zinc-600 transition-colors tracking-tight">
                        {lesson.title}
                      </h3>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-black">{lesson.desc}</p>
                    </div>
                  </div>
                  <div className={`w-12 h-12 border rounded-full flex items-center justify-center transition-all ${isExpanded ? 'bg-zinc-900 border-zinc-900' : 'border-zinc-100 group-hover:border-zinc-300'}`}>
                    {isExpanded ? (
                       <ChevronDown size={24} className="text-white" />
                    ) : (
                       <ChevronRight size={24} className="text-zinc-200 group-hover:text-zinc-400" />
                    )}
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="mt-10 pt-10 border-t border-zinc-100 text-lg leading-relaxed text-zinc-500 animate-in fade-in slide-in-from-top-6 font-medium tracking-tight">
                    <div className="flex gap-6 items-start">
                       <Zap size={20} className="text-zinc-200 shrink-0 mt-1.5" />
                       <p className="leading-loose">{lesson.content}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mb-20">
          <Link
            to={`/game/${gameType}?mode=bot`}
            className="btn-primary inline-flex items-center gap-6 px-16 py-6 text-xs h-16"
          >
            Initiate Training <Target size={20} />
          </Link>
        </div>
      </main>
    </div>
  );
}


