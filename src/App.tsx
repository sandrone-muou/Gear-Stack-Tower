/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { RotateCcw, Maximize, Minimize } from 'lucide-react';
import { Peg } from './components/Peg';
import { DiskSize } from './types';

const INITIAL_PEGS: DiskSize[][] = [[6, 5, 4, 3, 2, 1], [], []];

export default function App() {
  const [pegs, setPegs] = useState<DiskSize[][]>(INITIAL_PEGS);
  const [selectedPeg, setSelectedPeg] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [scale, setScale] = useState(1);
  const [isPortrait, setIsPortrait] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const updateLayout = () => {
      const isPort = window.innerHeight > window.innerWidth;
      setIsPortrait(isPort);
      const BASE_WIDTH = 950;
      const BASE_HEIGHT = 500;
      const availableWidth = isPort ? window.innerHeight : window.innerWidth;
      const availableHeight = isPort ? window.innerWidth : window.innerHeight;
      const scaleX = availableWidth / BASE_WIDTH;
      const scaleY = availableHeight / BASE_HEIGHT;
      setScale(Math.min(1, scaleX, scaleY));
    };
    
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
      } catch (e) {
        console.error("Error attempting to enable fullscreen:", e);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isWon) {
      interval = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isWon]);

  const handlePegClick = (pegIndex: number) => {
    if (isWon) return;

    if (selectedPeg === null) {
      if (pegs[pegIndex].length > 0) {
        setSelectedPeg(pegIndex);
      }
    } else {
      if (selectedPeg === pegIndex) {
        setSelectedPeg(null);
        return;
      }

      const sourcePeg = pegs[selectedPeg];
      const destPeg = pegs[pegIndex];
      const diskToMove = sourcePeg[sourcePeg.length - 1];
      const topDiskAtDest = destPeg.length > 0 ? destPeg[destPeg.length - 1] : Infinity;

      if (diskToMove < topDiskAtDest) {
        const newPegs = [...pegs];
        newPegs[selectedPeg] = sourcePeg.slice(0, -1);
        newPegs[pegIndex] = [...destPeg, diskToMove];
        
        setPegs(newPegs);
        setMoves(m => m + 1);
        if (!isPlaying) setIsPlaying(true);

        if (newPegs[1].length === 6 || newPegs[2].length === 6) {
          setIsWon(true);
        }
      }
      setSelectedPeg(null);
    }
  };

  const resetGame = () => {
    setPegs(INITIAL_PEGS);
    setSelectedPeg(null);
    setMoves(0);
    setTime(0);
    setIsPlaying(false);
    setIsWon(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m > 0) {
      return `${m}分钟${s}秒`;
    }
    return `${s}秒`;
  };

  const wrapperStyle = isPortrait ? {
    width: '100vh',
    height: '100vw',
    transform: 'rotate(90deg)',
    transformOrigin: 'top left',
    position: 'absolute' as const,
    top: 0,
    left: '100vw',
  } : {
    width: '100%',
    height: '100%',
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-[#5c4033] overflow-hidden font-sans touch-none">
      <div style={wrapperStyle} className="flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#8B5A2B]/40 via-[#5C3A21]/60 to-[#3E2723]/90 pointer-events-none"></div>
        
        {/* Header Info */}
        <div className="relative z-20 flex justify-between items-start p-4 md:p-8 pointer-events-none">
          <div className="text-white/90 space-y-1 pointer-events-auto">
            <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-4 drop-shadow-md">齿轮堆栈塔</h1>
            <p className="text-sm opacity-90 drop-shadow hidden md:block">将所有齿轮移动至另一侧</p>
            <p className="text-sm opacity-90 drop-shadow hidden md:block mb-6">需保持较小的齿轮在上</p>
            
            <div className="mt-2 md:mt-8 space-y-1 md:space-y-2">
              <p className="text-sm md:text-lg font-medium drop-shadow">移动步数: {moves}</p>
              <p className="text-sm md:text-lg font-medium drop-shadow">挑战时间: {formatTime(time)}</p>
            </div>
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            <button 
              onClick={toggleFullscreen}
              className="flex items-center justify-center p-2 md:px-5 md:py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all border border-white/20 shadow-lg cursor-pointer"
              title={isFullscreen ? "退出全屏" : "全屏"}
            >
              {isFullscreen ? <Minimize className="w-5 h-5 md:w-5 md:h-5" /> : <Maximize className="w-5 h-5 md:w-5 md:h-5" />}
              <span className="font-medium text-sm md:text-base hidden md:block ml-2">{isFullscreen ? "退出" : "全屏"}</span>
            </button>
            <button 
              onClick={resetGame}
              className="flex items-center gap-1 md:gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all border border-white/20 shadow-lg cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
              <span className="font-medium text-sm md:text-base">重新开始</span>
            </button>
          </div>
        </div>

      {/* Game Board Container */}
      <div className="flex-1 flex items-center justify-center relative z-10 w-full overflow-hidden">
        <div 
          style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
          className="w-[900px] h-[400px] flex items-end justify-center relative shrink-0"
        >
          {/* Base Layer (3D Extruded Board) */}
        <div className="absolute bottom-[20px] w-[850px] h-[160px]">
          {/* Shadow */}
          <div className="absolute top-[60px] left-[30px] right-[30px] h-[100px] bg-black/40 blur-2xl rounded-[100px]"></div>

          {/* Wooden Board Stack (simulating 3D thickness) */}
          <div className="absolute inset-0 top-[30px] bg-[#5C3A21] rounded-[60px]"></div>
          <div className="absolute inset-0 top-[25px] bottom-[5px] bg-[#6F4420] rounded-[60px]"></div>
          <div className="absolute inset-0 top-[20px] bottom-[10px] bg-[#8B5A2B] rounded-[60px]"></div>
          <div className="absolute inset-0 top-[15px] bottom-[15px] bg-[#9C6531] rounded-[60px]"></div>
          <div className="absolute inset-0 top-[10px] bottom-[20px] bg-[#B27337] rounded-[60px]"></div>
          <div className="absolute inset-0 top-[5px] bottom-[25px] bg-[#C18143] rounded-[60px]"></div>
          
          {/* Top Face */}
          <div className="absolute inset-0 bottom-[30px] bg-[#DEB887] rounded-[60px] border-[3px] border-[#C19A6B] shadow-[inset_0_0_80px_rgba(139,90,43,0.3)] overflow-hidden">
              {/* Inner border detail */}
              <div className="absolute inset-4 border-[2px] border-[#8B5A2B] opacity-30 rounded-[45px]"></div>
              
              {/* Decorative Diamonds */}
              <div className="absolute bottom-[25px] left-0 right-0 flex justify-between px-[120px]">
                <div className="flex gap-8 opacity-90 transform scale-y-[0.6]">
                  <div className="w-5 h-5 bg-[#FFD700] rotate-45 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3),_4px_4px_6px_rgba(0,0,0,0.4)] border-[2px] border-[#DAA520]"></div>
                  <div className="w-5 h-5 bg-[#FFD700] rotate-45 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3),_4px_4px_6px_rgba(0,0,0,0.4)] border-[2px] border-[#DAA520]"></div>
                </div>
                <div className="flex gap-8 opacity-90 transform scale-y-[0.6]">
                  <div className="w-5 h-5 bg-[#FFD700] rotate-45 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3),_4px_4px_6px_rgba(0,0,0,0.4)] border-[2px] border-[#DAA520]"></div>
                  <div className="w-5 h-5 bg-[#FFD700] rotate-45 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3),_4px_4px_6px_rgba(0,0,0,0.4)] border-[2px] border-[#DAA520]"></div>
                </div>
              </div>
          </div>
        </div>

        {/* Pegs Layer */}
        <div className="absolute bottom-[75px] w-[850px] flex justify-around items-end px-[40px]">
          {pegs.map((pegDisks, i) => (
            <Peg 
              key={i} 
              id={i} 
              disks={pegDisks} 
              isSelected={selectedPeg === i}
              onSelect={() => handlePegClick(i)}
            />
          ))}
        </div>
      </div>
      </div>

      {isWon && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-in fade-in duration-300">
          <div className="bg-[#a67c52] p-8 md:p-10 rounded-3xl shadow-2xl border-4 border-amber-900 text-white text-center max-w-sm md:max-w-md w-full">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">挑战成功！</h2>
            <div className="space-y-2 md:space-y-3 mb-6 md:mb-8 bg-black/20 p-4 md:p-6 rounded-2xl">
              <p className="text-lg md:text-xl">总步数: <span className="font-bold text-yellow-400">{moves}</span> 步</p>
              <p className="text-lg md:text-xl">总用时: <span className="font-bold text-yellow-400">{formatTime(time)}</span></p>
            </div>
            <button 
              onClick={resetGame}
              className="px-8 py-3 w-full bg-green-600 hover:bg-green-500 rounded-full font-bold text-lg md:text-xl transition-all shadow-lg border-b-4 border-green-800 active:border-b-0 active:translate-y-1 cursor-pointer"
            >
              再来一局
            </button>
          </div>
        </div>
      )}
      
      </div>
    </div>
  );
}
