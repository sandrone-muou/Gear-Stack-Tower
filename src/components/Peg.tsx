import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { Disk } from './Disk';
import { DiskSize } from '../types';

interface PegProps {
  id: number;
  disks: DiskSize[];
  isSelected: boolean;
  onSelect: () => void;
}

export function Peg({ id, disks, isSelected, onSelect }: PegProps) {
  return (
    <div 
      className="relative flex flex-col items-center justify-end w-[220px] h-[320px] cursor-pointer group"
      onClick={onSelect}
    >
      {/* Interaction hit area */}
      <div className="absolute inset-0 hover:bg-[#5C5852]/5 rounded-[40px] transition-colors z-30"></div>

      {/* Indicator */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-10 w-10 pointer-events-none z-20">
        {isSelected && (
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          >
            <ChevronDown className="w-12 h-12 text-[#5C5852] drop-shadow-sm" />
          </motion.div>
        )}
      </div>

      {/* Base connecting the stick to the board */}
      <div className="absolute bottom-[20px] left-1/2 -translate-x-1/2 w-[60px] h-[60px] rounded-full bg-[#BEB8B0] transform scale-y-[0.55] shadow-[0_6px_12px_rgba(0,0,0,0.1)] border-[2px] border-[#A8A198]"></div>
      <div className="absolute bottom-[25px] left-1/2 -translate-x-1/2 w-[52px] h-[52px] rounded-full bg-[#D3CDC5] transform scale-y-[0.55]"></div>

      {/* The stick (Cylinder in isometric) */}
      <div className="absolute bottom-[44px] w-[18px] h-[220px] bg-gradient-to-r from-[#B3ACA2] via-[#EAE5D9] to-[#B3ACA2] shadow-xl">
        {/* Stick top face */}
        <div className="absolute -top-3 left-0 w-full h-[18px] rounded-full bg-[#D3CDC5] transform scale-y-[0.55] shadow-inner">
           {/* Decorative tip base */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[24px] h-[24px] rounded-full bg-[#C6BAA8] shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.1)] border-2 border-[#A89D8B]"></div>
        </div>
        {/* Decorative tip point */}
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 w-4 h-6">
           <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[26px] border-b-[#C6BAA8] filter drop-shadow-sm"></div>
        </div>
      </div>
      
      {/* Disks container */}
      <div className="absolute bottom-[36px] flex flex-col-reverse items-center justify-start w-full z-10 pointer-events-none">
        {disks.map((disk, index) => {
          const isTop = index === disks.length - 1;
          return (
            <Disk 
              key={disk} 
              size={disk} 
              isTop={isTop}
              isSelected={isSelected && isTop}
            />
          );
        })}
      </div>
    </div>
  );
}
