import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, ChevronDown, ChevronRight } from "lucide-react";

export default function LearningView() {
  const { gameType } = useParams();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const lessons = {
    chess: [
      {
        title: "Piece Movement",
        desc: "Learn how the Pawn, Knight, Bishop, Rook, Queen, and King move.",
        content: "Pawns move forward but capture diagonally. Knights move in an 'L' shape. Bishops move diagonally, Rooks strictly horizontally/vertically. Queens can move in any direction, and Kings may only shift one square at a time."
      },
      { title: "Captures", desc: "How to take opponent pieces.", content: "To capture, move your piece to the square occupied by an opponent's piece. The captured piece is permanently removed from the board, giving you a material advantage." },
      {
        title: "Castling",
        desc: "A special defensive move involving the King and Rook.",
        content: "Castling allows you to move the King two squares toward a Rook on its original square, then immediately jumping the Rook to the other side. You cannot castle out of, through, or into check."
      },
      { title: "Check & Checkmate", desc: "How to win the game.", content: "A check is a direct attack on an opponent's King, forcing them to respond immediately. A checkmate happens when the king is in check and no legal response can save it – ending the game." },
    ],
    shogi: [
      { title: "Movement", desc: "Basic movements of Japanese chess pieces.", content: "Promoted pieces gain the movements of a Gold General. Pawns and Lances only move forward, requiring a promotion to retreat." },
      {
        title: "Promotion",
        desc: "How pieces upgrade when entering the enemy camp.",
        content: "When moving into the farthest three ranks of the opponent's territory, pieces like Pawn, Lance, Knight, Silver, Rook, and Bishop flip to become stronger versions of themselves."
      },
      {
        title: "Piece Drops",
        desc: "The core mechanic of Shogi - returning captured pieces to the board.",
        content: "Instead of moving a piece on the board, you can take a captured enemy piece from your 'stand' and place it almost anywhere on the board as your own piece. This keeps the game permanently dynamic."
      },
    ],
    checkers: [
      { title: "Movement", desc: "Simple diagonal forward movement.", content: "Standard checkers may only step diagonally forward on the dark squares. They cannot move straight or horizontally." },
      { title: "Capturing", desc: "Jumping over opponent pieces.", content: "To capture an opponent, you 'jump' diagonally over their piece into an empty square directly behind it. Captures are mandatory if available, which can be used to set traps." },
      {
        title: "King Rules",
        desc: "Reaching the end of the board allows moving backward.",
        content: "When a standard piece reaches the furthest row from the player, it is crowned a King. A King gains the powerful ability to move and capture backwards as well as forwards."
      },
    ],
  };

  const courseData = lessons[gameType as keyof typeof lessons] || [];

  return (
    <div className="min-h-screen bg-[#0d0d0d] p-8 flex flex-col relative overflow-hidden text-[#e0e0e0]">
      <header className="max-w-4xl mx-auto w-full flex justify-between items-center mb-10 pb-6 border-b border-white/10">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white/70 hover:text-white rounded-sm text-[10px] font-bold uppercase tracking-widest border border-white/10 hover:border-white/30 transition-all"
        >
          <ArrowLeft size={14} /> Terminate
        </Link>
      </header>

      <main className="max-w-4xl mx-auto w-full">
        <div className="bg-[#161616] rounded-sm p-12 border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.5)] mb-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-0 opacity-50"></div>
          <BookOpen size={48} className="mx-auto mb-6 text-[#d4af37] opacity-80 relative z-10" />
          <h1 className="text-4xl font-serif italic mb-2 capitalize text-white relative z-10">
            {gameType} <span className="text-[#d4af37]">Learning Hub</span>
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#d4af37] relative z-10 opacity-70">
            Master the basics before you play.
          </p>
        </div>

        <div className="space-y-4">
          {courseData.map((lesson, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="bg-[#1a1a1a] p-6 rounded-sm border border-white/5 border-l-2 border-l-[#d4af37] flex flex-col group cursor-pointer hover:bg-white/5 hover:border-[#d4af37]/30 transition-all"
              >
                <div className="flex items-center justify-between w-full">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37] mb-2 block">
                      Module {idx + 1}
                    </span>
                    <h3 className="text-xl font-serif text-white mb-1 group-hover:text-[#d4af37] transition-colors">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-white/50 tracking-wider ">{lesson.desc}</p>
                  </div>
                  <div className={`w-10 h-10 border rounded-full flex items-center justify-center transition-colors ${isExpanded ? 'bg-[#d4af37] border-[#d4af37]' : 'border-white/10 group-hover:bg-[#d4af37] group-hover:border-[#d4af37]'}`}>
                    {isExpanded ? (
                       <ChevronDown size={20} className={isExpanded ? 'text-black' : 'text-[#d4af37] group-hover:text-black'} />
                    ) : (
                       <ChevronRight size={20} className="text-[#d4af37] group-hover:text-black" />
                    )}
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-white/5 text-sm leading-relaxed text-white/80 animate-in fade-in slide-in-from-top-2">
                    {lesson.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            to={`/game/${gameType}?mode=bot`}
            className="inline-block px-8 py-4 bg-white text-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#d4af37] transition-all rounded-sm shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            Ready? Try a Bot Match
          </Link>
        </div>
      </main>
    </div>
  );
}
