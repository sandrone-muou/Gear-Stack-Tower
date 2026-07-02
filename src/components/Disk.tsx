import { motion } from 'motion/react';
import { DiskSize } from '../types';

interface DiskProps {
  size: DiskSize;
  isTop: boolean;
  isSelected: boolean;
}

// Adjusted colors to look more like brass/metallic/pastel puzzle gears
const colors: Record<DiskSize, { top: string, side: string, inner: string, ring: string }> = {
  1: { top: '#D8B4E2', side: '#A77FB2', inner: '#B88CC4', ring: '#EAD1F0' }, // Purple-ish
  2: { top: '#A9C5E8', side: '#7599C4', inner: '#8FAED2', ring: '#CBE0F5' }, // Blue-ish
  3: { top: '#A3D9A5', side: '#6CB56F', inner: '#88C68A', ring: '#C6EAC8' }, // Green-ish
  4: { top: '#F5D77F', side: '#C9A644', inner: '#E0BB55', ring: '#FBE8A4' }, // Yellow/Gold
  5: { top: '#F4B07B', side: '#C67D42', inner: '#DF9258', ring: '#FAD0AF' }, // Orange-ish
  6: { top: '#E88F8F', side: '#BA5757', inner: '#D17373', ring: '#F3ADAD' }, // Red-ish
};

export function Disk({ size, isTop, isSelected }: DiskProps) {
  // Base width per size
  const width = size * 22 + 50; 
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
          const isBottomLayer = i === layers.length - 1;
          const fill = isTopLayer ? c.top : c.side;
          
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
                    <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[26px] h-[26px] rounded-full bg-[#3E2723] shadow-[inset_0_6px_10px_rgba(0,0,0,0.8)] border-[3px] border-[#5C3A21]"></div>
                    
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
