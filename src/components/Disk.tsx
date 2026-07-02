import { motion } from 'motion/react';
import { DiskSize } from '../types';

interface DiskProps {
  size: DiskSize;
  isTop: boolean;
  isSelected: boolean;
}

// Macaron palette for the disks (higher saturation)
const colors: Record<DiskSize, { top: string, side: string, inner: string, ring: string }> = {
  1: { top: '#FCA5A5', side: '#F87171', inner: '#EF4444', ring: '#FECACA' }, // Rose/Pink
  2: { top: '#FCD34D', side: '#FBBF24', inner: '#F59E0B', ring: '#FDE68A' }, // Amber/Yellow
  3: { top: '#86EFAC', side: '#4ADE80', inner: '#22C55E', ring: '#BBF7D0' }, // Mint Green
  4: { top: '#93C5FD', side: '#60A5FA', inner: '#3B82F6', ring: '#BFDBFE' }, // Sky Blue
  5: { top: '#C4B5FD', side: '#A78BFA', inner: '#8B5CF6', ring: '#DDD6FE' }, // Lavender Purple
  6: { top: '#F9A8D4', side: '#F472B6', inner: '#EC4899', ring: '#FBCFE8' }, // Bubblegum Pink
};

export function Disk({ size, isTop, isSelected }: DiskProps) {
  // Base width per size
  const width = size * 22 + 50; 
  const c = colors[size];
  
  // 7 layers for performance while maintaining 3D look
  const layers = [0, 4, 8, 12, 16, 20, 24];

  return (
    <motion.div
      layoutId={`disk-${size}`}
      className="relative flex items-center justify-center pointer-events-none"
      style={{ width: `${width}px`, height: '24px' }}
      animate={{ y: isSelected ? [-30, -38, -30] : 0 }}
      transition={{ 
        layout: { type: "spring", bounce: 0.2, duration: 0.6 },
        y: isSelected 
          ? { repeat: Infinity, duration: 2, ease: "easeInOut" }
          : { type: "spring", bounce: 0.3, duration: 0.5 }
      }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
        {layers.map((offset, i) => {
          const isTopLayer = i === 0;
          const isBottomLayer = i === layers.length - 1;
          const fill = isTopLayer ? c.top : c.side;
          
          return (
            <div 
              key={i}
              className="absolute inset-0 flex items-center justify-center"
              style={{ transform: `translateY(${offset}px)` }}
            >
              {/* Gear Body scaled to isometric */}
              <div 
                className="relative"
                style={{ width: `${width}px`, height: `${width}px`, transform: `scaleY(0.55)` }}
              >
                <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full ${isBottomLayer ? 'drop-shadow-lg' : ''}`}>
                  <circle cx="50" cy="50" r="37" fill={fill} />
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                    <path 
                      key={angle} 
                      d="M 44 4 Q 50 1 56 4 L 62 17 L 38 17 Z" 
                      fill={fill} 
                      transform={`rotate(${angle} 50 50)`} 
                      stroke={fill}
                      strokeWidth="1"
                      strokeLinejoin="round"
                    />
                  ))}
                </svg>
                
                {/* Details on top layer */}
                {isTopLayer && (
                  <>
                    {/* Inner sunken area */}
                    <div className="absolute top-[22%] left-[22%] w-[56%] h-[56%] rounded-full shadow-[inset_0_4px_8px_rgba(0,0,0,0.25)] pointer-events-none border border-black/10" style={{ backgroundColor: c.inner }}></div>
                    
                    {/* Inner gear details (decorative dots) */}
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                      {[0, 90, 180, 270].map(angle => (
                         <circle key={angle} cx="50" cy="28" r="2.5" fill="#000" transform={`rotate(${angle} 50 50)`} />
                      ))}
                    </svg>

                    {/* Raised center ring */}
                    <div className="absolute top-[36%] left-[36%] w-[28%] h-[28%] rounded-full shadow-[0_3px_6px_rgba(0,0,0,0.3),inset_0_2px_3px_rgba(255,255,255,0.6)] border border-black/5" style={{ backgroundColor: c.ring }}></div>
                    
                    {/* Center Hole for the peg */}
                    <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[26px] h-[26px] rounded-full bg-white shadow-[inset_0_6px_10px_rgba(0,0,0,0.2)] border-[3px] border-slate-200"></div>
                    
                    {/* Top Edge Highlight on the gear rim to make it pop */}
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
                      <circle cx="50" cy="50" r="35.5" fill="none" stroke="white" strokeWidth="1" />
                    </svg>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
