import { Link } from "react-router-dom";
import {
  Play,
  BookOpen,
  Bot,
  Volume2,
  VolumeX,
  Swords,
  Trophy,
  Shield,
  Zap,
  Users,
} from "lucide-react";
import { useSettings } from "../store/useSettings";

export default function Home() {
  const { soundEnabled, setSoundEnabled } = useSettings();

  const games = [
    { 
      id: 'chess', 
      name: 'Grandmaster Chess', 
      desc: 'The ultimate test of strategy.', 
      icon: <Trophy className="text-zinc-800" size={32} />,
      color: "from-zinc-100 to-white"
    },
    { 
      id: 'shogi', 
      name: 'Shogi Master', 
      desc: 'Japanese tradition reborn.', 
      icon: <Shield className="text-zinc-800" size={32} />,
      color: "from-zinc-100 to-white"
    },
    { 
      id: 'checkers', 
      name: 'Elite Checkers', 
      desc: 'Swift, tactical, lethal.', 
      icon: <Zap className="text-zinc-800" size={32} />,
      color: "from-zinc-100 to-white"
    }
  ];

  return (
    <div className="min-h-screen bg-bg selection:bg-zinc-200 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-8 py-10 relative z-10">
        <header className="flex items-center justify-between pb-8 border-b border-zinc-100 mb-16">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-white inner-glow rounded-xl flex items-center justify-center text-zinc-900 font-bold shadow-sm border border-zinc-100">
              TB
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 leading-none">
                TriBoard <span className="text-zinc-400 font-light italic">Elite</span>
              </h1>
              <p className="text-[9px] uppercase tracking-[0.4em] text-zinc-400 mt-1 font-semibold">Strategic Excellence</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center gap-3 px-5 py-2 bg-white/50 border border-zinc-100 text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all text-zinc-500 hover:text-zinc-900 rounded-xl inner-glow shadow-sm"
            >
              {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} className="opacity-50" />}
              <span>{soundEnabled ? 'Audio On' : 'Muted'}</span>
            </button>
          </div>
        </header>

        <main>
          <section className="mb-20 text-center flex flex-col items-center">
            <span className="inline-block px-4 py-1.5 bg-white text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full mb-8 border border-zinc-100 inner-glow shadow-sm">
              Design Excellence v2.5
            </span>
            <h2 className="text-8xl font-bold text-zinc-900 leading-[1.05] mb-8 tracking-tighter max-w-4xl">
              Elevated <span className="text-zinc-300">Strategy.</span> <br />
              <span className="bg-gradient-to-r from-zinc-900 to-zinc-400 bg-clip-text text-transparent">Pure Precision.</span>
            </h2>
            <p className="text-zinc-400 max-w-xl text-lg leading-relaxed mb-12 tracking-tight font-medium">
              A minimalist board game experience crafted with frosted aesthetics and high-key precision for the modern strategist.
            </p>
          </section>

          <div className="grid lg:grid-cols-3 gap-10 mb-24">
            {games.map((game) => (
              <div key={game.id} className="group relative glass-card p-12 rounded-3xl transition-all duration-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:-translate-y-2 flex flex-col min-h-[520px] inner-glow border border-white/60">
                <div className="relative z-10 mb-10">
                  <div className="w-20 h-20 bg-white inner-glow border border-zinc-50 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-700 shadow-sm">
                    {game.icon}
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-2 block font-bold">Standard Arena</span>
                  <h3 className="text-4xl font-bold text-zinc-900 tracking-tight">{game.name}</h3>
                  <p className="text-zinc-400 text-sm mt-4 leading-relaxed max-w-[200px] font-medium">{game.desc}</p>
                </div>
                
                <div className="space-y-3 relative z-10 mt-auto">
                  <Link 
                    to={`/game/${game.id}?mode=online`}
                    className="btn-primary w-full flex items-center justify-center gap-3 text-[11px] h-14"
                  >
                    <Swords size={18} /> Ranked Play
                  </Link>
                  <Link 
                    to={`/game/${game.id}?mode=local`}
                    className="btn-outline w-full flex items-center justify-center gap-3 text-[11px] h-14 bg-white/40 border-zinc-900/10 text-zinc-900 hover:bg-zinc-900 hover:text-white"
                  >
                    <Users size={18} /> Local Versus
                  </Link>
                  <Link 
                    to={`/game/${game.id}?mode=bot`}
                    className="btn-outline w-full flex items-center justify-center gap-3 text-[11px] h-14 bg-white/40"
                  >
                    <Bot size={18} /> Practice Bot
                  </Link>
                  <Link 
                    to={`/learning/${game.id}`}
                    className="flex items-center justify-center gap-2 w-full pt-4 text-[10px] font-bold uppercase tracking-widest text-zinc-300 hover:text-zinc-900 transition-all"
                  >
                    Documentation <BookOpen size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <section className="glass-card p-12 rounded-3xl relative overflow-hidden inner-glow border border-white/60 text-center">
             <div className="relative z-10">
                <h4 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-900 mb-4">Tactical Intelligence Hub</h4>
                <p className="text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
                  Engage in high-fidelity simulations against state-of-the-art neural opponents or challenge fellow strategists in local combat protocols.
                </p>
             </div>
          </section>
        </main>
        
        <footer className="mt-24 pt-10 border-t border-zinc-100 flex flex-col md:flex-row gap-8 justify-between items-center text-[10px] text-zinc-300 tracking-[0.3em] uppercase font-bold mb-12">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.4)]"></span>
              <span className="text-zinc-400">Environment Active</span>
            </div>
            <span className="text-zinc-100">|</span>
            <span className="text-zinc-400">Stable Protocol</span>
          </div>
          <div className="text-center md:text-right">
            <p className="text-zinc-400">TriBoard Elite © {new Date().getFullYear()}</p>
            <p className="mt-2 text-[8px] opacity-40 tracking-[0.4em]">Apple-Style Glassmorphism v2.5</p>
          </div>
        </footer>
      </div>
    </div>
  );
}



