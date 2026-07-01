import { motion } from 'motion/react';
import { DiskSize } from '../types';

interface DiskProps {
  size: DiskSize;
  isTop: boolean;
  isSelected: boolean;
}

const colors: Record<DiskSize, { top: string, side: string }> = {
  1: { top: '#C4B5FD', side: '#8B5CF6' }, // Purple
  2: { top: '#93C5FD', side: '#3B82F6' }, // Blue
  3: { top: '#86EFAC', side: '#22C55E' }, // Green
  4: { top: '#FDE047', side: '#EAB308' }, // Yellow
  5: { top: '#FDBA74', side: '#F97316' }, // Orange
  6: { top: '#FCA5A5', side: '#EF4444' }, // Red
};

export function Disk({ size, isTop, isSelected }: DiskProps) {
  // Base width per size
  const width = size * 24 + 50; 
  const c = colors[size];
  
  // 12 layers for seamless 24px thickness (2px per layer)
  const layers = Array.from({ length: 12 });

  return (
    <motion.div
      layoutId={`disk-${size}`}
      className="relative flex items-center justify-center pointer-events-none"
      style={{ width: `${width}px`, height: '24px' }}
      animate={{ y: isSelected ? -30 : 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
        {layers.map((_, i) => {
          const isTopLayer = i === 0;
          return (
            <div 
              key={i}
              className="absolute inset-0 flex items-center justify-center"
              style={{ transform: `translateY(${i * 2}px)` }}
            >
              {/* Gear Body scaled to isometric */}
              <div 
                className="relative"
                style={{ width: `${width}px`, height: `${width}px`, transform: `scaleY(0.55)` }}
              >
                {/* 4 crossed rectangles to make 8 teeth */}
                <div className="w-full h-[35%] absolute top-[32.5%] left-0 rounded-[2px]" style={{ backgroundColor: isTopLayer ? c.top : c.side }}></div>
                <div className="w-[35%] h-full absolute top-0 left-[32.5%] rounded-[2px]" style={{ backgroundColor: isTopLayer ? c.top : c.side }}></div>
                <div className="w-full h-[35%] absolute top-[32.5%] left-0 rounded-[2px] rotate-45" style={{ backgroundColor: isTopLayer ? c.top : c.side }}></div>
                <div className="w-[35%] h-full absolute top-0 left-[32.5%] rounded-[2px] rotate-45" style={{ backgroundColor: isTopLayer ? c.top : c.side }}></div>
                
                {/* Solid inner body */}
                <div className="w-[82%] h-[82%] absolute top-[9%] left-[9%] rounded-full" style={{ backgroundColor: isTopLayer ? c.top : c.side }}></div>
                
                {/* Highlights and details on top layer */}
                {isTopLayer && (
                  <>
                    <div className="absolute inset-0 rounded-full border border-white/20"></div>
                    <div className="w-[70%] h-[70%] absolute top-[15%] left-[15%] rounded-full border-2 border-white/10"></div>
                  </>
                )}
                
                {/* Center Hole for the peg */}
                <div className="w-[26px] h-[26px] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3E2723] shadow-[inset_0_4px_8px_rgba(0,0,0,0.6)] border-2 border-[#5C3A21]"></div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
