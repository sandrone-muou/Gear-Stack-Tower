import { motion } from 'motion/react';
import { DiskSize } from '../types';

interface DiskProps {
  size: DiskSize;
  isTop: boolean;
  isSelected: boolean;
}

// Premium candy-like palette for the disks
const colors: Record<DiskSize, { top: string, side: string, inner: string, ring: string }> = {
  1: { top: '#FFAED4', side: '#F472B6', inner: '#FF94C6', ring: '#FCE7F3' }, // Pink
  2: { top: '#FDE047', side: '#EAB308', inner: '#FACC15', ring: '#FEF9C3' }, // Yellow
  3: { top: '#86EFAC', side: '#22C55E', inner: '#4ADE80', ring: '#DCFCE7' }, // Green
  4: { top: '#93C5FD', side: '#3B82F6', inner: '#60A5FA', ring: '#DBEAFE' }, // Blue
  5: { top: '#C4B5FD', side: '#8B5CF6', inner: '#A78BFA', ring: '#EDE9FE' }, // Purple
  6: { top: '#FCA5A5', side: '#EF4444', inner: '#F87171', ring: '#FEE2E2' }, // Red
};

export function Disk({ size, isTop, isSelected }: DiskProps) {
  // Base width per size
  const width = size * 22 + 50; 
  const c = colors[size];
  
  // 5 layers for beautiful 3D thickness without too much performance hit
  const layers = [0, 5, 10, 15, 20];

  return (
    <motion.div
      layoutId={`disk-${size}`}
      className="relative flex items-center justify-center pointer-events-none transform-gpu will-change-transform"
      style={{ width: `${width}px`, height: '24px', zIndex: isSelected ? 50 : 10 }}
      transition={{ 
        layout: { type: "spring", stiffness: 350, damping: 30, mass: 0.8 }
      }}
    >
      <motion.div 
        className="w-full h-full relative transform-gpu will-change-transform"
        animate={{ y: isSelected ? -30 : 0 }}
        transition={{ 
          y: { type: "spring", stiffness: 400, damping: 25, mass: 0.8 }
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
                <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full ${isBottomLayer ? 'drop-shadow-xl' : ''}`}>
                  <circle cx="50" cy="50" r="40" fill={fill} />
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
                    <rect 
                      key={angle}
                      x="43" y="4" width="14" height="18" rx="5"
                      fill={fill} 
                      transform={`rotate(${angle} 50 50)`} 
                    />
                  ))}
                </svg>
                
                {/* Details on top layer */}
                {isTopLayer && (
                  <>
                    {/* Inner sunken area */}
                    <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] rounded-full shadow-[inset_0_6px_12px_rgba(0,0,0,0.15),0_2px_4px_rgba(255,255,255,0.5)] border border-white/30" style={{ backgroundColor: c.inner }}></div>
                    
                    {/* Inner gear details (decorative dots) */}
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
                      {[0, 60, 120, 180, 240, 300].map(angle => (
                         <circle key={angle} cx="50" cy="27" r="3.5" fill="#fff" transform={`rotate(${angle} 50 50)`} />
                      ))}
                    </svg>

                    {/* Raised center ring */}
                    <div className="absolute top-[35%] left-[35%] w-[30%] h-[30%] rounded-full shadow-[0_4px_8px_rgba(0,0,0,0.2),inset_0_3px_6px_rgba(255,255,255,0.7)] border border-white/50" style={{ backgroundColor: c.ring }}></div>
                    
                    {/* Center Hole for the peg */}
                    <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[22px] h-[22px] rounded-full bg-[#EAE5D9] shadow-[inset_0_4px_8px_rgba(0,0,0,0.3)] border-[2px] border-[#D5D0C5]"></div>
                    
                    {/* Top Edge Highlight on the gear rim to make it pop */}
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
                      <circle cx="50" cy="50" r="39" fill="none" stroke="white" strokeWidth="1.5" />
                      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
                        <rect 
                          key={angle}
                          x="44" y="5" width="12" height="12" rx="4"
                          fill="none"
                          stroke="white"
                          strokeWidth="1"
                          transform={`rotate(${angle} 50 50)`} 
                        />
                      ))}
                    </svg>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      </motion.div>
    </motion.div>
  );
}
