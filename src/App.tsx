import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GameView from "./pages/GameView";
import LearningView from "./pages/LearningView";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0d0d0d] text-[#e0e0e0] font-sans selection:bg-[#d4af37]/30">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game/:gameType" element={<GameView />} />
          <Route path="/learning/:gameType" element={<LearningView />} />
        </Routes>
      </div>
    </Router>
  );
}
