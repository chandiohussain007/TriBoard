import { Link } from "react-router-dom";
import {
  Play,
  BookOpen,
  User,
  Bot,
  Volume2,
  VolumeX,
  Swords,
} from "lucide-react";
import { useSettings } from "../store/useSettings";
import { botLevels } from "../lib/constants";

export default function Home() {
  const { soundEnabled, setSoundEnabled, botLevel, setBotLevel } =
    useSettings();

  const games = [
    { id: 'chess', name: 'Chess', desc: 'Classic International' },
    { id: 'shogi', name: 'Shogi', desc: 'Japanese Tradition' },
    { id: 'checkers', name: 'Checkers', desc: 'Swift & Simple' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-8 pt-6">
      <header className="flex items-center justify-between pb-6 border-b border-white/10 mb-10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#d4af37] to-[#8a6d1d] rounded-sm flex items-center justify-center text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.2)]">TL</div>
          <h1 className="text-xl font-semibold tracking-widest uppercase text-white">TriBoard <span className="text-[#d4af37] font-light">Lite</span></h1>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-2 px-4 py-1.5 border border-white/20 text-xs uppercase tracking-widest hover:bg-white/10 transition-all text-white/80"
            title="Toggle Sound"
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} className="opacity-50" />}
            <span>Sound {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </header>

      <div className="mb-8">
        <h2 className="text-[42px] font-serif italic text-white leading-tight mb-2">Choose your arena.</h2>
        <p className="text-white/50 max-w-md text-sm">Instant strategy. No accounts. No delays. Select a classic and start your match in seconds.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {games.map((game) => (
          <div key={game.id} className="group relative bg-[#161616] border border-white/5 p-8 rounded-sm hover:border-[#d4af37]/50 transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-0 opacity-50"></div>
            
            <div className="relative z-10 mb-10">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] mb-1 block">{game.desc}</span>
              <h3 className="text-3xl font-serif text-white">{game.name}</h3>
            </div>
            
            <div className="space-y-3 relative z-10 mt-auto">
              <Link 
                to={`/game/${game.id}?mode=online`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-white text-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#d4af37] transition-all shadow-md"
              >
                <Swords size={16} /> Play Online
              </Link>
              <Link 
                to={`/game/${game.id}?mode=bot`}
                className="flex items-center justify-center gap-2 w-full py-3 border border-white/20 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
              >
                <Bot size={16} /> Practice vs Bot
              </Link>
              <Link 
                to={`/learning/${game.id}`}
                className="flex items-center justify-center gap-2 w-full pt-3 text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-[#d4af37] hover:underline transition-all"
              >
                <BookOpen size={14} /> Learn Basics →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <section className="bg-[#1a1a1a] p-6 border border-white/5 rounded-sm">
        <h4 className="text-xs font-bold uppercase tracking-widest text-[#d4af37] mb-2 flex items-center gap-2">
          <Bot size={14} /> Bot Difficulty Target
        </h4>
        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-6">Select difficulty level for your practice matches and fallback online games.</p>
        
        <div className="flex flex-wrap gap-2">
          {botLevels.map((level) => (
            <button
              key={level}
              onClick={() => setBotLevel(level)}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] border transition-all rounded-sm ${
                botLevel === level 
                  ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.2)]' 
                  : 'bg-transparent border-white/20 text-white/50 hover:border-white/50 hover:text-white'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </section>
      
      <footer className="mt-12 py-6 border-t border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center text-[10px] text-white/40 tracking-wider uppercase">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Gateway Active</span>
        </div>
        <div className="text-center md:text-right">
          <p>TriBoard Lite © {new Date().getFullYear()}</p>
          <p className="mt-1 opacity-70">Made for Ai Seekho Hackathon 2026 GDG Live Pakistan</p>
        </div>
      </footer>
    </div>
  );
}
